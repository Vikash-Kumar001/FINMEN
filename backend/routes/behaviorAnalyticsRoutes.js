import express from 'express';
import {
  getBehaviorFlow,
  getParentEngagement,
  getTeacherWorkload,
  getDropOffDetection,
  getChurnPredictions,
  getAllBehaviorAnalytics
} from '../controllers/behaviorAnalyticsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get all analytics summary
router.get('/', getAllBehaviorAnalytics);

// Individual analytics endpoints
router.get('/behavior-flow', getBehaviorFlow);
router.get('/parent-engagement', getParentEngagement);
router.get('/teacher-workload', getTeacherWorkload);
router.get('/drop-off', getDropOffDetection);
router.get('/churn-predictions', getChurnPredictions);

export default router;

