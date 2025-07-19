import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Load .env variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")

def extract_filter_from_query(user_input):
    prompt = f"""Extract a filter JSON from this query: "{user_input}".
    Return a JSON object with:
    - 'attribute': the building attribute to filter on (e.g., 'height', 'zoning', 'value', 'construction_year')
    - 'operator': one of '>', '<', '=', 'contains'
    - 'value': the filter value

    Example output: {{ "attribute": "height", "operator": ">", "value": 100 }}
    Another example: {{ "attribute": "construction_year", "operator": "<", "value": 2000 }}"""

    try:
        response = model.generate_content(prompt)
        
        if not response or not hasattr(response, "text"):
            print("Gemini response was empty or malformed.")
            return None

        text = response.text.strip()

        # Remove code block if it exists
        if text.startswith("```"):
            text = "\n".join(line for line in text.splitlines() if not line.strip().startswith("```"))

        return json.loads(text)

    except json.JSONDecodeError as jde:
        print("⚠️ JSON parsing error:", jde)
        return None
    except Exception as e:
        print("❌ Gemini LLM error:", e)
        return None
