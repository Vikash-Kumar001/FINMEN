import axios from "axios";

// 🌐 Set the base URL from .env or fallback to localhost
const baseURL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

// ✅ Create an Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // Enables cookies for cross-origin requests
});

// 🔄 Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "Unknown error";
    console.error("🔴 API Error:", msg);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/institution-type', '/individual-account', '/register-stakeholder', '/register-parent', '/register-seller', '/register-teacher', '/school-registration', '/college-registration', '/choose-account-type'];
      
      // Only redirect if not already on login/register page and not on public paths
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !publicPaths.includes(currentPath)) {
        console.warn("🔐 Authentication failed. Clearing token and redirecting to login.");
        
        // Clear invalid token
        localStorage.removeItem("finmen_token");
        
        // Clear any other auth-related storage
        try {
          // Clear session cookies
          document.cookie.split(";").forEach(c => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        } catch (e) {
          console.error("Error clearing cookies:", e);
        }
        
        // Redirect to login after a short delay to prevent multiple redirects
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      } else {
        // On public/auth pages, just clear token without redirecting
        localStorage.removeItem("finmen_token");
      }
    }
    
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
          // Check if token is expired (basic check)
          try {
            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp < currentTime) {
              console.warn("⚠️ Token expired. Removing...");
              localStorage.removeItem("finmen_token");
              return config;
            }
          } catch (parseError) {
            console.warn("⚠️ Could not parse token payload");
          }
          
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
