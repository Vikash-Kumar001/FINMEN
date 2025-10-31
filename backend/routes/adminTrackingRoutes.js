import express from 'express';
import {
  getPlatformOverview,
  getUserCommunicationFlow,
  getStudentDistribution,
  getParentLinkageStats,
  getRealTimeActivity,
  getActivityByType,
  getDashboardAnalytics,
  exportActivityReport,
  getUsersByRole,
  getUserDetails,
  getActivityFeed
} from '../controllers/adminTrackingController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Admin tracking routes
router.get('/overview', getPlatformOverview);
router.get('/communication-flow', getUserCommunicationFlow);
router.get('/student-distribution', getStudentDistribution);
router.get('/parent-linkage', getParentLinkageStats);
router.get('/realtime-activity', getRealTimeActivity);
router.get('/activities', getActivityByType);
router.get('/analytics', getDashboardAnalytics);
router.get('/export', exportActivityReport);
router.get('/activity-feed', getActivityFeed);
router.get('/users/:role', getUsersByRole);
router.get('/user/:userId', getUserDetails);

export default router;

