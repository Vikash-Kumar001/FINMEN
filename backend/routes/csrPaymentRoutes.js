import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  approvePayment,
  processPayment,
  getSpendLedger,
  getFinancialSummary
} from '../controllers/csrPaymentController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Payment Management
router.post('/payments', createPayment);
router.get('/payments', getPayments);
router.get('/payments/:paymentId', getPaymentById);
router.put('/payments/:paymentId/status', updatePaymentStatus);
router.post('/payments/:paymentId/approve', approvePayment);
router.post('/payments/:paymentId/process', processPayment);

// Financial Tracking
router.get('/spend-ledger', getSpendLedger);
router.get('/financial-summary', getFinancialSummary);

export default router;
