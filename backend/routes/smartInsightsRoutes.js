import express from 'express';
import {
  getSmartInsights,
  getAnomalies,
  getRecommendations,
  getAllSmartInsights
} from '../controllers/smartInsightsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get all insights (combined)
router.get('/', getAllSmartInsights);

// Individual endpoints
router.get('/insights', getSmartInsights);
router.get('/anomalies', getAnomalies);
router.get('/recommendations', getRecommendations);

export default router;

