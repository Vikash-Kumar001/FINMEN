import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API, // e.g. http://localhost:5000/api
  withCredentials: true,             // Send cookies (JWT)
});

export default api;
