import axios from "axios";

// ✅ Axios instance for all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://finmen.onrender.com', // 🔄 Set correct backend URL
  withCredentials: true, // Ensures cookies like JWT token are sent
});

// 🔄 Response interceptor for error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error("🔴 API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🔄 Request interceptor for token handling
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('finmen_token');

    if (token) {
      try {
        // Validate JWT format (header.payload.signature)
        if (typeof token === 'string' && token.includes('.') && token.split('.').length === 3) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("⚠️ Invalid token format in localStorage");
          localStorage.removeItem('finmen_token');
        }
      } catch (err) {
        console.error("❌ Error processing token:", err.message);
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

export default api;
