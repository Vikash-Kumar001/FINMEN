// src/utils/api.js
import axios from "axios";

// ✅ Axios instance for all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API, // Example: http://localhost:5000/api
  withCredentials: true,             // Ensures cookies like JWT token are sent with every request
});

// 🔄 Optional: Interceptors for auto error logging or token handling
// You can enable these if needed:

// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error("🔴 API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export default api;
