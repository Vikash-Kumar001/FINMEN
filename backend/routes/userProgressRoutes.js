import express from 'express';
import {
  getUserProgress,
  addXP,
  updateStreak
} from '../controllers/userProgressController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// 🛡️ All progress routes require authentication
router.use(requireAuth);

router.get('/', getUserProgress);

router.post('/add-xp', addXP);

router.post('/update-streak', updateStreak);

export default router;