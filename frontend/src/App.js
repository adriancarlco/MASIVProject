import React, { useState } from 'react';
import MapView from './components/MapView';
import SaveLoadPanel from './components/SaveLoadPanel';
import { fetchLLMFilter } from './api';

function App() {
  const [filters, setFilters] = useState({});

  const handleUserQuery = async (queryText) => {
    try {
      const res = await fetchLLMFilter(queryText);
      const filter = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      setFilters(filter);
    } catch (err) {
      console.error("Failed to extract filter from query:", err);
      alert("Sorry, I couldn't understand your query.");
    }
  };

  return (
    <div className="app-container">
      <h1 className="dashboard-title">Calgary 3D Dashboard</h1>
      <input
        className="query-input"
        placeholder="Type your query (e.g. buildings over 100 feet)"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleUserQuery(e.target.value);
        }}
      />
      <SaveLoadPanel currentFilters={filters} onLoadFilters={setFilters} />
      <MapView filters={filters} />
    </div>
  );
}

export default App;
