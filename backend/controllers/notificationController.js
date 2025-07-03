import Notification from "../models/Notification.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

// 📥 Create a new notification and emit real-time via Socket.IO
export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      throw new ErrorResponse("Missing required fields", 400);
    }

    const notification = await Notification.create({
      userId,
      type,
      message,
    });

    // Real-time emit to user's private room
    const io = req.app.get("io");
    if (io) {
      io.to(userId.toString()).emit("notification", notification);
    }

    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    next(err);
  }
};

// 📤 Get all notifications for the logged-in user
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

// 🧹 Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// ❌ Delete a specific notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      throw new ErrorResponse("Notification not found", 404);
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};
