import express from 'express';
import {
  getPlatformSummary,
  getMoodTrends,
  getLeaderboard,
} from '../controllers/analyticsController.js';
import { requireAuth } from '../middlewares/requireAuth.js'; // If protected

const router = express.Router();

// Only accessible by logged-in admins/educators
router.get('/summary', requireAuth, getPlatformSummary);
router.get('/mood-trends', requireAuth, getMoodTrends);
router.get('/leaderboard', requireAuth, getLeaderboard);

export default router;
