import api from "../utils/api";

// Fetch current authenticated user
export const getCurrentUser = () => 
  api.get("/api/auth/me");

// Logout the current user
export const logout = () => 
  api.post("/api/auth/logout");
