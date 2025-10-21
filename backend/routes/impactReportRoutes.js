import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getImpactReports,
  getImpactReport,
  generateImpactReport,
  generateAutomatedReport,
  updateImpactReport,
  publishImpactReport,
  exportImpactReport,
  deleteImpactReport
} from '../controllers/impactReportController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
router.use(requireAuth);
router.use(requireCSR);

// Impact report management
router.get('/reports', getImpactReports);
router.get('/reports/:reportId', getImpactReport);
router.post('/reports/generate', generateImpactReport);
router.post('/reports/automated', generateAutomatedReport);
router.put('/reports/:reportId', updateImpactReport);
router.put('/reports/:reportId/publish', publishImpactReport);
router.get('/reports/:reportId/export', exportImpactReport);
router.delete('/reports/:reportId', deleteImpactReport);

export default router;
