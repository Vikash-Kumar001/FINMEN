import api from "../utils/api";

// 🔄 Get all pending redemption requests
export const fetchRedemptions = async () => {
  const res = await api.get("/api/admin/redemptions");
  return res.data;
};

// ✅ Approve a redemption request
export const approveRedemption = async (id) => {
  const res = await api.post(`/api/admin/redemptions/approve/${id}`);
  return res.data;
};

// ❌ Reject a redemption request
export const rejectRedemption = async (id) => {
  const res = await api.post(`/api/admin/redemptions/reject/${id}`);
  return res.data;
};
