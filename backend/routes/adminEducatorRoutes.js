// routes/adminEducatorRoutes.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middlewares/requireAuth.js';
import {
  getEducatorActivities,
  getEducatorStats,
  exportEducatorsCSV
} from '../controllers/adminEducatorController.js';

const router = express.Router();

// 🔒 Protect all admin educator routes
router.use(requireAuth, requireAdmin);

// 📊 Get educator statistics
router.get('/stats', getEducatorStats);

// 📋 Get activities for a specific educator
router.get('/:id/activities', getEducatorActivities);

// 📤 Export educators data as CSV
router.get('/export', exportEducatorsCSV);

export default router;