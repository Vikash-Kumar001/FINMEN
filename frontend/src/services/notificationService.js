import api from "../utils/api";

export const fetchMyNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await api.patch("/notifications/read");
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};
