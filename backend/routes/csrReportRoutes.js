import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  generateCSRReport,
  getCSRReports,
  getCSRReportById,
  downloadCSRReportPDF,
  getReportStatus,
  shareReport
} from '../controllers/csrReportController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// CSR Report Management
router.post('/reports', generateCSRReport);
router.get('/reports', getCSRReports);
router.get('/reports/:reportId', getCSRReportById);
router.get('/reports/:reportId/status', getReportStatus);
router.get('/reports/:reportId/download', downloadCSRReportPDF);
router.post('/reports/:reportId/share', shareReport);

export default router;
