from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, User, Project
from routes import register_routes 
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database config
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'db.sqlite3')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Register routes
register_routes(app)

# Create tables
with app.app_context():
    db.create_all()

# Run the server
if __name__ == "__main__":
    app.run(debug=True)
