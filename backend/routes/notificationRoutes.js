import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createNotification,
  getMyNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require login
router.use(requireAuth);

// GET all notifications
router.get("/", getMyNotifications);

// POST create notification
router.post("/", createNotification);

// PATCH mark all as read
router.patch("/read-all", markAllAsRead);

// PATCH mark single notification as read
router.patch("/:id/read", markAsRead);

// DELETE single notification
router.delete("/:id", deleteNotification);

// GET unread notification count
router.get("/unread-count", getUnreadCount);

export default router;
