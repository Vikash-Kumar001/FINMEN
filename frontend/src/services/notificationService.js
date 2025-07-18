import api from "../utils/api";

// 📬 Fetch all notifications for the logged-in user
export const fetchMyNotifications = async () => {
  try {
    const res = await api.get("/api/notifications", {
      withCredentials: true, // Ensures cookies like finmen_token are sent
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Return empty array instead of throwing error
    return [];
  }
};

// ✅ Mark all notifications as read
export const markAllAsRead = async () => {
  const res = await api.patch("/api/notifications/read-all", {}, {
    withCredentials: true,
  });
  return res.data;
};

// ✅ Mark a specific notification as read
export const markNotificationRead = async (id) => {
  const res = await api.patch(`/api/notifications/${id}/read`, {}, {
    withCredentials: true,
  });
  return res.data;
};

// ❌ Delete a specific notification
export const deleteNotification = async (id) => {
  const res = await api.delete(`/api/notifications/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
