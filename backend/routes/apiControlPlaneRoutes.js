import express from 'express';
import {
  getAPIControlPlaneStats,
  getAPIKeys,
  createAPIKey,
  revokeAPIKey,
  getAPIUsageMetrics,
  getWebhookLogs,
  getIntegrationHealth,
  checkIntegrationHealth,
  createIntegrationHealth
} from '../controllers/apiControlPlaneController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Statistics
router.get('/stats', getAPIControlPlaneStats);

// API Keys
router.get('/keys', getAPIKeys);
router.post('/keys', createAPIKey);
router.post('/keys/:keyId/revoke', revokeAPIKey);

// API Usage Metrics
router.get('/usage', getAPIUsageMetrics);

// Webhook Logs
router.get('/webhooks', getWebhookLogs);

// Integration Health
router.get('/integrations', getIntegrationHealth);
router.post('/integrations', createIntegrationHealth);
router.post('/integrations/:integrationId/check', checkIntegrationHealth);

export default router;

