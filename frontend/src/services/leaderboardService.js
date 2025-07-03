import api from "../utils/api";

// 🏆 Fetch the leaderboard data
export const fetchLeaderboard = async () => {
  const res = await api.get("/leaderboard", { withCredentials: true });
  return res.data;
};
