import axios from "axios";

// Set the base URL from .env or fallback to localhost
const baseURL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

// Create an Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // Enables cookies for cross-origin requests
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "Unknown error";
    console.error("🔴 API Error:", msg);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        console.warn("🔐 Authentication failed. Clearing token and redirecting to login.");
        
        // Clear invalid token
        localStorage.removeItem("finmen_token");
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;