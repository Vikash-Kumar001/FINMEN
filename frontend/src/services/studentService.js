import api from "../utils/api";

export const fetchStudentProfile = () => api.get("/auth/me");
export const fetchMoodLogs = () => api.get("/mood/logs");
export const fetchUserProgress = () => api.get("/game/progress");
