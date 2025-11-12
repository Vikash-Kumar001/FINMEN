import express from 'express';
import {
  getMessages,
  sendBroadcast,
  createReminder,
  getTemplates,
  createTemplate,
  getDeliveryAnalytics,
  getCommunicationStats
} from '../controllers/communicationController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Statistics
router.get('/stats', getCommunicationStats);

// Analytics
router.get('/analytics', getDeliveryAnalytics);

// Messages
router.get('/messages', getMessages);
router.post('/broadcast', sendBroadcast);
router.post('/reminder', createReminder);

// Templates
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);

export default router;

