import express from 'express';
import {
  getAuditTimeline,
  getActionDetails,
  getAuditStats,
  exportAuditLogs,
  getTargetHistory,
  getUserActivitySummary
} from '../controllers/auditTimelineController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get audit statistics
router.get('/stats', getAuditStats);

// Export audit logs
router.get('/export', exportAuditLogs);

// Get audit timeline
router.get('/', getAuditTimeline);

// Get action details (drill-down)
router.get('/:logId', getActionDetails);

// Get target history
router.get('/target/:targetType/:targetId', getTargetHistory);

// Get user activity summary
router.get('/user/:userId/summary', getUserActivitySummary);

export default router;

