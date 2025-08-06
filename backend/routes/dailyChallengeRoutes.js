import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  getDailyChallenge,
  getDailyChallenges,  // Add this import
  getWeeklyChallenge,
  updateChallengeProgress,
  getActiveChallenges
} from '../controllers/dailyChallengeController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all daily challenges (10 challenges)
router.get('/', getDailyChallenges);  // Add this route

// Get the current daily challenge
router.get('/daily', getDailyChallenge);

// Get the current weekly challenge
router.get('/weekly', getWeeklyChallenge);

// Get all active challenges (daily and weekly)
router.get('/active', getActiveChallenges);

// Update progress for a challenge
router.post('/progress/:challengeId', updateChallengeProgress);

export default router;