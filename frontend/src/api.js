import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const fetchMapData = () => axios.get(`${BASE_URL}/map_data`);


export const fetchLLMFilter = (query) =>
  axios.post(`${BASE_URL}/query_llm`, { query });

export const saveProject = (username, projectName, filters) =>
  axios.post(`${BASE_URL}/save_project`, {
    username,
    project_name: projectName,
    filters,
  });

export const loadProjects = (username) =>
  axios.get(`${BASE_URL}/load_projects/${username}`);