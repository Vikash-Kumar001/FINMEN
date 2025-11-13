import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  createSubscriptionPayment,
  verifySubscriptionPayment,
  getCurrentSubscription,
  getSubscriptionHistory,
  getSubscriptionTransactions,
  updateAutoRenewSettings,
  cancelSubscription,
  handleRazorpayWebhook,
} from '../controllers/userSubscriptionController.js';

const router = express.Router();

// Webhook endpoint (must be before requireAuth middleware)
router.post('/webhook', express.json(), handleRazorpayWebhook);

// Protected routes
router.post('/create-payment', requireAuth, createSubscriptionPayment);
router.post('/verify-payment', requireAuth, verifySubscriptionPayment);
router.get('/current', requireAuth, getCurrentSubscription);
router.get('/history', requireAuth, getSubscriptionHistory);
router.get('/transactions', requireAuth, getSubscriptionTransactions);
router.patch('/auto-renew', requireAuth, updateAutoRenewSettings);
router.post('/cancel', requireAuth, cancelSubscription);

export default router;

