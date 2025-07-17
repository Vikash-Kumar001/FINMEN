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

// Admin and educator routes
router.get('/user/:userId', checkRole(['admin', 'educator']), getUserActivities);
router.get('/summary', checkRole(['admin']), getActivitySummary);
router.get('/stream', checkRole(['admin', 'educator']), getActivityStream);

export default router;