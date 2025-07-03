import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  logMood,
  getUserMoodLogs,
  getMoodAnalytics,
} from '../controllers/moodController.js';

const router = express.Router();

router.post('/log', requireAuth, logMood);
router.get('/my-logs', requireAuth, getUserMoodLogs);
router.get('/analytics', requireAuth, getMoodAnalytics);

export default router;
