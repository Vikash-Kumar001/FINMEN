import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createNotification,
  getMyNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  getUnreadCount,
  getApprovalQueue,
  createApprovalNotification,
  notifyPolicyChange,
  getPolicyChangeNotifications,
  acknowledgePolicyChange,
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

// ============= APPROVAL QUEUE =============
// GET approval queue (pending assignments)
router.get("/approval-queue", getApprovalQueue);

// POST create approval notification
router.post("/approval-queue/notify", createApprovalNotification);

// ============= POLICY CHANGES =============
// POST notify policy change
router.post("/policy-change/notify", notifyPolicyChange);

// GET policy change notifications
router.get("/policy-changes", getPolicyChangeNotifications);

// PATCH acknowledge policy change (for parents)
router.patch("/policy-change/:notificationId/acknowledge", acknowledgePolicyChange);

export default router;
