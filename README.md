# Calgary 3D Dashboard

This project is a full-stack web application that allows users to visualize buildings in Calgary in 3D using natural language queries. The backend uses Flask and integrates Google Gemini LLM to parse queries. The frontend uses React and Three.js for 3D rendering.

---

## 🚀 Features

- 3D building visualization using real geospatial data
- Filter buildings by height, year, and zoning with natural language queries
- Save/load project filters by username
- Google Gemini API integration for LLM-powered query interpretation

---

📁 **Project Structure**

```text
MASIVAssignment/
├── backend/                # Flask API and database logic
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── llm_utils.py
│   └── requirements.txt
├── frontend/               # React + Three.js dashboard
│   ├── public/
│   │   └── calgary.jpg
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── api.js
│   │   └── components/
│   │       ├── MapView.js
│   │       └── SaveLoadPanel.js
│   └── package.json
```


## 🧠 Prerequisites

- Node.js (v18 recommended)
- Python 3.9 or newer
- Git
- Google Gemini API key (for LLM filter extraction)

---

## 🔧 Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
2. (Optional but recommended) Create a virtual environment:

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

3. Add your Gemini API Key
Create a file named .env in backend/:

GEMINI_API_KEY=your_actual_api_key

4. Start the backend
python app.py

5. Delete node_modules and package-lock.json if starting clean:

## 🔧 Frontend Setup (React)

1. Navigate to the frontend directory
cd frontend

2. Install dependencies
npm install
npm install \
  @react-three/drei@9.56.14 \
  @react-three/fiber@8.13.3 \
  @testing-library/dom@10.4.0 \
  @testing-library/jest-dom@6.6.3 \
  @testing-library/react@16.3.0 \
  @testing-library/user-event@13.5.0 \
  axios@1.10.0 \
  react@18.2.0 \
  react-dom@18.2.0 \
  react-scripts@5.0.1 \
  three@0.152.2 \
  web-vitals@2.1.4

3. Start your project

npm start


