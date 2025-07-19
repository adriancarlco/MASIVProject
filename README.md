# Calgary 3D Dashboard

This project is a full-stack web application that allows users to visualize buildings in Calgary in 3D using natural language queries. The backend uses Flask and integrates Google Gemini LLM to parse queries. The frontend uses React and Three.js for 3D rendering.

---

## 🚀 Features

- 3D building visualization using real geospatial data
- Filter buildings by height, year, and zoning with natural language queries
- Save/load project filters by username
- Google Gemini API integration for LLM-powered query interpretation

---

## 📁 Project Structure

MASIVAssignment/
├── backend/ # Flask API and database logic
│ ├── app.py
│ ├── models.py
│ ├── routes.py
│ ├── llm_utils.py
│ └── requirements.txt
├── frontend/ # React + Three.js dashboard
│ ├── public/
│ │ └── calgary.jpg
│ ├── src/
│ │ ├── App.js
│ │ ├── App.css
│ │ ├── api.js
│ │ └── components/
│ │ ├── MapView.js
│ │ └── SaveLoadPanel.js
│ └── package.json

## 🧠 Prerequisites

- Node.js (v18+ recommended)
- Python 3.9 or newer
- Git
- Google Gemini API key (for LLM filter extraction)

---

## 🔧 Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
2. (Optional but recommended) Create a virtual environment:

Copy
Edit
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
