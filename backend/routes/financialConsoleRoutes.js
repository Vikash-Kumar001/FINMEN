import express from 'express';
import {
  getRevenueDashboard,
  getSchoolMetrics,
  generateInvoice,
  getPaymentRetries,
  processRefund,
  getCouponsAndPromotions,
  getTaxCompliance,
  getAllFinancialConsole
} from '../controllers/financialConsoleController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get all financial console data (dashboard summary)
router.get('/', getAllFinancialConsole);

// Individual endpoints
router.get('/revenue', getRevenueDashboard);
router.get('/school-metrics', getSchoolMetrics);
router.get('/payment-retries', getPaymentRetries);
router.get('/coupons', getCouponsAndPromotions);
router.get('/tax-compliance', getTaxCompliance);

// Actions
router.post('/invoice/generate', generateInvoice);
router.post('/refund', processRefund);

export default router;

