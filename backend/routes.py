from flask import request, jsonify
from models import db, User, Project
import json
import requests
from llm_utils import extract_filter_from_query

def register_routes(app):

    @app.route('/save_project', methods=['POST'])
    def save_project():
        data = request.json
        username = data.get("username")
        project_name = data.get("project_name")
        filters = data.get("filters")

        print("🔹 Saving project:", username, project_name, filters)

        if not (username and project_name and filters):
            print("❌ Missing fields in request.")
            return jsonify({"error": "Missing fields"}), 400

        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"👤 Creating new user: {username}")
            user = User(username=username)
            db.session.add(user)
            db.session.commit()

        # Check if project name already exists for this user (optional safeguard)
        existing = Project.query.filter_by(user_id=user.id, name=project_name).first()
        if existing:
            print(f"⚠️ Project '{project_name}' already exists for user '{username}'. Overwriting.")
            existing.filters = json.dumps(filters)
            db.session.commit()
            return jsonify({"message": "Project updated"})

        new_project = Project(user_id=user.id, name=project_name, filters=json.dumps(filters))
        db.session.add(new_project)
        db.session.commit()

        print("✅ Project saved.")
        return jsonify({"message": "Project saved"})

    @app.route('/load_projects/<username>', methods=['GET'])
    def load_projects(username):
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify([])

        projects = Project.query.filter_by(user_id=user.id).all()
        result = [{"name": p.name, "filters": json.loads(p.filters)} for p in projects]
        return jsonify(result)

    @app.route('/map_data')
    def map_data():
        url = "https://data.cityofnewyork.us/resource/u9wf-3gbt.geojson?$limit=300"
        response = requests.get(url)
        raw_data = response.json()

        buildings = []

        for feature in raw_data.get('features', []):
            try:
                properties = feature.get('properties', {})
                geometry = feature.get('geometry', {})

                height_roof = properties.get('height_roof')
                coordinates = geometry.get('coordinates')

                if height_roof is not None and coordinates:
                    height = float(height_roof)
                    buildings.append({
                        'height': round(height, 2),
                        'coordinates': coordinates,
                        'construction_year': properties.get('construction_year')
                    })
            except (ValueError, KeyError, TypeError) as e:
                print("Skipped entry due to error:", e)

        print(f"Loaded {len(buildings)} buildings")
        return jsonify(buildings)

    @app.route('/query_llm', methods=['POST'])
    def handle_llm_query():
        data = request.get_json()
        user_input = data.get('query', '')

        if not user_input:
            return jsonify({"error": "No query provided"}), 400

        response = extract_filter_from_query(user_input)

        try:
            parsed = json.loads(response) if isinstance(response, str) else response
            return jsonify(parsed)
        except Exception as e:
            print("Failed to parse LLM response:", response)
            return jsonify({"error": "Failed to parse response"}), 500
