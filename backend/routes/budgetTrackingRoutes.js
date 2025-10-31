import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getLiveBudgetTracking,
  getBudgetAlerts,
  acknowledgeAlert,
  resolveAlert,
  createBudgetAlert,
  checkThresholdAlerts,
  getBudgetAnalytics
} from '../controllers/budgetTrackingController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Budget Tracking
router.get('/budget-tracking', getLiveBudgetTracking);
router.get('/budget-alerts', getBudgetAlerts);
router.post('/budget-alerts', createBudgetAlert);
router.put('/budget-alerts/:alertId/acknowledge', acknowledgeAlert);
router.put('/budget-alerts/:alertId/resolve', resolveAlert);
router.post('/budget-alerts/check-thresholds', checkThresholdAlerts);
router.get('/budget-analytics', getBudgetAnalytics);

export default router;
