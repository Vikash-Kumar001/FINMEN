import api from "../utils/api";

// Fetch current authenticated user
export const getCurrentUser = () => 
  api.get("/auth/me");

// Logout the current user
export const logout = () => 
  api.post("/auth/logout");
