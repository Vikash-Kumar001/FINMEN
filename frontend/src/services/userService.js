import api from "../utils/api";

// Self Profile (All roles)
export const getMyProfile = async () => {
  try {
    const res = await api.get("/api/profile/me");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch profile:", err);
    throw err;
  }
};

export const updateMyProfile = async (data) => {
  try {
    const res = await api.put("/api/profile/me", data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    throw err;
  }
};

export const updateMyAvatar = async (formData) => {
  try {
    const res = await api.put("/api/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update avatar:", err);
    throw err;
  }
};

export const updateMyPassword = async ({ current, newPass }) => {
  try {
    const res = await api.put("/api/profile/password", {
      currentPassword: current,
      newPassword: newPass,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update password:", err);
    throw err;
  }
};


// Stats by Role
export const fetchStudentStats = async () => {
  try {
    const res = await api.get("/api/stats/student");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch student stats:", err);
    throw err;
  }
};

export const fetchEducatorStats = async () => {
  try {
    const res = await api.get("/stats/educator");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch educator stats:", err);
    throw err;
  }
};

export const fetchAdminStats = async () => {
  try {
    const res = await api.get("/stats/admin");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch admin stats:", err);
    throw err;
  }
};


// Admin - User Management
export const getAllUsers = async () => {
  try {
    const res = await api.get("/api/admin/users");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to get all users:", err);
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
    const res = await api.get(`/api/admin/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to get user ${userId}:`, err);
    throw err;
  }
};

export const updateUserByAdmin = async (userId, data) => {
  try {
    const res = await api.put(`/api/admin/users/${userId}`, data);
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to update user ${userId}:`, err);
    throw err;
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/api/admin/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to delete user ${userId}:`, err);
    throw err;
  }
};
