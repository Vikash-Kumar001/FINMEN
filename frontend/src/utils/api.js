import axios from "axios";

// ✅ Axios instance for all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Use VITE_API_URL
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
    
    // Validate token before using it
    if (token) {
      try {
        // Simple validation - check if token has the correct format (header.payload.signature)
        if (typeof token === 'string' && token.includes('.') && token.split('.').length === 3) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("⚠️ Invalid token format found in localStorage");
          // Clear the invalid token
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