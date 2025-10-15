import express from 'express';
import {
  logActivity,
  getUserActivities,
  getMyActivities,
  getActivitySummary,
  getActivityStream,
} from '../controllers/activityController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Protect all routes
router.use(requireAuth);

// Student routes
router.post('/log', logActivity);
router.get('/my-activities', getMyActivities);
router.get('/recent', getMyActivities); // Alias for recent activities

// Admin and  routes
router.get('/user/:userId', checkRole(['admin', '']), getUserActivities);
router.get('/summary', checkRole(['admin']), getActivitySummary);
router.get('/stream', checkRole(['admin', '']), getActivityStream);

export default router;