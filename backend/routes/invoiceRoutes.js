import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getInvoices,
  getInvoiceById,
  generateInvoice,
  sendInvoice,
  recordPayment,
  getInvoiceAnalytics,
  downloadInvoicePDF
} from '../controllers/invoiceController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Invoice Management
router.get('/invoices', getInvoices);
router.get('/invoices/:invoiceId', getInvoiceById);
router.post('/invoices/generate/:paymentId', generateInvoice);
router.post('/invoices/:invoiceId/send', sendInvoice);
router.post('/invoices/:invoiceId/payment', recordPayment);
router.get('/invoices/analytics', getInvoiceAnalytics);
router.get('/invoices/:invoiceId/download', downloadInvoicePDF);

export default router;
