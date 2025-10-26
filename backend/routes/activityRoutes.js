import express from 'express';
import {
  logActivity,
  getUserActivities,
  getMyActivities,
  getActivitySummary,
  getActivityStream,
  getStudentActivity,
  getStudentActivityStats,
} from '../controllers/activityController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkRole } from '../middlewares/checkRole.js';
import { extractTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(requireAuth);
router.use(extractTenant);

// Student routes
router.post('/log', logActivity);
router.get('/my-activities', getMyActivities);
router.get('/recent', getMyActivities); // Alias for recent activities
router.get('/', getStudentActivity); // Get student activity with filtering
router.get('/stats', getStudentActivityStats); // Get student activity statistics

// Admin and  routes
router.get('/user/:userId', checkRole(['admin', '']), getUserActivities);
router.get('/summary', checkRole(['admin']), getActivitySummary);
router.get('/stream', checkRole(['admin', '']), getActivityStream);

export default router;