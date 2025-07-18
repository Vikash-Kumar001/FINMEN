import api from "../utils/api";

// Save mood log
export const submitMood = (data) => api.post("/api/mood/log", data);

// Fetch all moods for logged-in user
export const getMyMoods = () => api.get("/api/mood/my");
