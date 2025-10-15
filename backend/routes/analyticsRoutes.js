import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { extractTenant } from '../middlewares/tenantMiddleware.js';
import {
  logEvent,
  logBatchEvents,
  logOverviewView,
  logApprovalAction,
  logTemplateCreate,
  getEvents,
  getEventStats,
  getAnalyticsDashboard,
  getEventFunnel,
  exportEvents,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);

// All routes require authentication
router.use(requireAuth);

// ============= EVENT LOGGING =============
// Generic event logging
router.post('/events', logEvent);
router.post('/events/batch', logBatchEvents);

// Specific event loggers
router.post('/events/overview-view', logOverviewView);
router.post('/events/approval-action', logApprovalAction);
router.post('/events/template-create', logTemplateCreate);

// ============= ANALYTICS RETRIEVAL =============
// Get events with filters
router.get('/events', getEvents);

// Get event statistics
router.get('/stats', getEventStats);

// Get analytics dashboard
router.get('/dashboard', getAnalyticsDashboard);

// Get funnel analysis
router.get('/funnel', getEventFunnel);

// Export events as CSV
router.get('/export', exportEvents);

export default router;
