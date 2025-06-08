import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',  // Your FastAPI backend URL
  withCredentials: true,                 // For cookies/auth if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
