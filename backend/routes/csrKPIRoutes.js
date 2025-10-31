import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getCSRKPIs,
  getKPITrends,
  refreshKPIs,
  exportKPIs
} from '../controllers/csrKPIController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Get comprehensive CSR KPIs
// GET /api/csr/kpis?period=month&region=all&organizationId=xxx
router.get('/kpis', getCSRKPIs);

// Get KPI trends over time
// GET /api/csr/kpis/trends?metric=engagement&period=month&organizationId=xxx
router.get('/kpis/trends', getKPITrends);

// Refresh KPIs (recalculate from scratch)
// POST /api/csr/kpis/refresh
router.post('/kpis/refresh', refreshKPIs);

// Export KPIs data
// GET /api/csr/kpis/export?format=json&period=month&organizationId=xxx
router.get('/kpis/export', exportKPIs);

export default router;
