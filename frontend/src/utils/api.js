import axios from "axios";

// 🌐 Set the base URL from .env or fallback to localhost
const baseURL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

// ✅ Create an Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // Enables cookies for cross-origin requests
});

// 🔄 Response interceptor for centralized error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "Unknown error";
    console.error("🔴 API Error:", msg);
    return Promise.reject(error);
  }
);

// 🔐 Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finmen_token");

    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("⚠️ Malformed token found. Removing...");
          localStorage.removeItem("finmen_token");
        }
      } catch (err) {
        console.error("❌ Token parsing error:", err.message);
        localStorage.removeItem("finmen_token");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
