import api from "../utils/api";

// Log a student activity
export const logActivity = async (activityData) => {
  try {
    const res = await api.post("/activities/log", activityData);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to log activity:", err);
    // Don't throw the error to prevent disrupting the user experience
    return { success: false, error: err.message };
  }
};

// Get my activities (for students)
export const getMyActivities = async (params = {}) => {
  try {
    const res = await api.get("/activities/my-activities", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch my activities:", err);
    throw err;
  }
};

// Get user activities (for admin and educators)
export const getUserActivities = async (userId, params = {}) => {
  try {
    const res = await api.get(`/activities/user/${userId}`, { params });
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to fetch activities for user ${userId}:`, err);
    throw err;
  }
};

// Get activity summary (for admin dashboard)
export const getActivitySummary = async (params = {}) => {
  try {
    const res = await api.get("/activities/summary", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch activity summary:", err);
    throw err;
  }
};

// Get real-time activity stream (for admin dashboard)
export const getActivityStream = async (params = {}) => {
  try {
    const res = await api.get("/activities/stream", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch activity stream:", err);
    throw err;
  }
};