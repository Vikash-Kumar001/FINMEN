import api from "../utils/api";


// 🎁 Get all available rewards (visible to students)
export const fetchAvailableRewards = async () => {
  const res = await api.get("/api/rewards");
  return res.data;
};

// 🛍️ Redeem a reward (student redeeming)
export const redeemReward = async (rewardId) => {
  const res = await api.post(`/api/rewards/redeem/${rewardId}`);
  return res.data;
};

// 📄 Get current user's redemption history
export const fetchMyRedemptions = async () => {
  const res = await api.get("/api/rewards/my-redemptions");
  return res.data;
};

// 🛠️ ADMIN: Create a new reward
export const createReward = async (rewardData) => {
  const res = await api.post("/api/admin/rewards", rewardData);
  return res.data;
};

// 🔄 ADMIN: Update an existing reward
export const updateReward = async (id, updatedData) => {
  const res = await api.put(`/api/admin/rewards/${id}`, updatedData);
  return res.data;
};

// ❌ ADMIN: Delete a reward
export const deleteReward = async (id) => {
  const res = await api.delete(`/api/admin/rewards/${id}`);
  return res.data;
};

// ✅ ADMIN: Approve a redemption request
export const approveRedemption = async (id) => {
  const res = await api.post(`/api/admin/redemptions/approve/${id}`);
  return res.data;
};

// ❌ ADMIN: Reject a redemption request
export const rejectRedemption = async (id) => {
  const res = await api.post(`/api/admin/redemptions/reject/${id}`);
  return res.data;
};

// 📥 ADMIN: Fetch all pending redemption requests
export const fetchPendingRedemptions = async () => {
  const res = await api.get("/api/admin/redemptions");
  return res.data;
};
