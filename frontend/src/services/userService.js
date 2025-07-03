import api from "../utils/api";

// ==========================
// 🌟 Self Profile (All roles)
// ==========================

export const getMyProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data;
};

export const updateMyProfile = async (data) => {
  const res = await api.put("/profile/me", data);
  return res.data;
};

export const updateMyAvatar = async (formData) => {
  const res = await api.put("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateMyPassword = async ({ current, newPass }) => {
  const res = await api.put("/profile/password", {
    currentPassword: current,
    newPassword: newPass,
  });
  return res.data;
};

// ==========================
// 📊 Stats by Role
// ==========================

export const fetchStudentStats = async () => {
  const res = await api.get("/stats/student");
  return res.data;
};

export const fetchEducatorStats = async () => {
  const res = await api.get("/stats/educator");
  return res.data;
};

export const fetchAdminStats = async () => {
  const res = await api.get("/stats/admin");
  return res.data;
};

// ==========================
// 👑 Admin - User Management
// ==========================

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
};

export const updateUserByAdmin = async (userId, data) => {
  const res = await api.put(`/admin/users/${userId}`, data);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};
