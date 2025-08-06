import api from "../utils/api";

// Log a student activity
export const logActivity = async (activityData) => {
  try {
    const res = await api.post("/api/activity/log", activityData);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to log activity:", err?.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

// Get my activities (for students)
export const getMyActivities = async (params = {}) => {
  try {
    const res = await api.get("/api/activity/my-activities", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch my activities:", err?.response?.data || err.message);
    throw err;
  }
};

// Get user activities (for admin and educators)
export const getUserActivities = async (userId, params = {}) => {
  try {
    const res = await api.get(`/api/activity/user/${userId}`, { params });
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to fetch activities for user ${userId}:`, err?.response?.data || err.message);
    throw err;
  }
};

// Get activity summary (for admin dashboard)
export const getActivitySummary = async (params = {}) => {
  try {
    const res = await api.get("/api/activity/summary", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch activity summary:", err?.response?.data || err.message);
    throw err;
  }
};

// Get real-time activity stream (for admin dashboard)
export const getActivityStream = async (params = {}) => {
  try {
    const res = await api.get("/api/activity/stream", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch activity stream:", err?.response?.data || err.message);
    throw err;
  }
};
