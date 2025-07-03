import api from "../utils/api";

export const getMissionsByLevel = (level) =>
  api.get(`/game/missions/${level}`);

export const completeMission = (id) =>
  api.post(`/game/complete/${id}`);

export const getUserProgress = () => api.get("/game/progress");
