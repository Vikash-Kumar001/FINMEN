import express from 'express';
import {
  getAllPaymentTransactions,
  getPaymentStatistics,
  getTransactionsByOrganization,
  getRefundStatistics,
  processRefund,
  getTransactionDetails
} from '../controllers/adminPaymentTrackerController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Payment tracking routes
router.get('/transactions', getAllPaymentTransactions);
router.get('/statistics', getPaymentStatistics);
router.get('/organizations/:organizationId', getTransactionsByOrganization);
router.get('/refunds/stats', getRefundStatistics);
router.get('/transaction/:transactionId', getTransactionDetails);
router.post('/refund/:transactionId', processRefund);

export default router;

