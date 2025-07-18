import api from "../utils/api";

export const getMissionsByLevel = (level) =>
  api.get(`/api/game/missions/${level}`);

export const completeMission = (id) =>
  api.post(`/api/game/complete/${id}`);

export const getUserProgress = () => api.get("/api/game/progress");
