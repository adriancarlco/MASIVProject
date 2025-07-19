import React, { useState } from 'react';
import { saveProject, loadProjects } from '../api.js';

export default function SaveLoadPanel({ currentFilters, onLoadFilters }) {
  const [username, setUsername] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  const handleSave = () => {
    saveProject(username, projectName, currentFilters).then(() => {
      alert('Project saved!');
      handleLoadList(); // refresh
    });
  };

  const handleLoadList = () => {
    loadProjects(username).then((res) => setProjects(res.data));
  };

  return (
    <div className="save-load-panel">
      <input className="input-field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="input-field" placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
      <button className="btn" onClick={handleSave}>Save Project</button>
      <button className="btn" onClick={handleLoadList}>Load Projects</button>

      <ul className="project-list">
        {projects.map((p, i) => (
          <li key={i} className="project-item">
            {p.name} <button className="btn" onClick={() => onLoadFilters(p.filters)}>Load</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
