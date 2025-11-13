import express from 'express';
import { handleRazorpayWebhook } from '../controllers/userSubscriptionController.js';

const router = express.Router();

// Razorpay webhook endpoint
// This endpoint receives webhook notifications from Razorpay
// Must use express.json() middleware to parse the webhook payload
// Note: Razorpay sends webhooks as JSON, not raw body
router.post('/webhook', express.json(), handleRazorpayWebhook);

export default router;

