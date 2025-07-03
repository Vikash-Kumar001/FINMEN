import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createNotification,
  getMyNotifications,
  markAllAsRead,
  deleteNotification,
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

// DELETE single notification
router.delete("/:id", deleteNotification);

export default router;
