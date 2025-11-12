import express from 'express';
import {
  getAdminReports,
  exportAdminReport
} from '../controllers/adminReportsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get reports
router.get('/', getAdminReports);

// Export reports
router.get('/export', exportAdminReport);

export default router;

