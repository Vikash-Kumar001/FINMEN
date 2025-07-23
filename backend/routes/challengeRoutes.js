import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  getAllChallenges,
  getActiveChallenges,
  getChallengeById,
  startChallenge,
  updateChallengeProgress,
  getUserChallengeProgress,
  getUserChallengeProgressById
} from '../controllers/challengeController.js';

const router = express.Router();

// Public routes
router.get('/', getAllChallenges);
router.get('/active', getActiveChallenges);
router.get('/:id', getChallengeById);

// Protected routes - require authentication
router.post('/start/:challengeId', requireAuth, startChallenge);
router.post('/progress/:challengeId', requireAuth, updateChallengeProgress);
router.get('/progress', requireAuth, getUserChallengeProgress);
router.get('/progress/:challengeId', requireAuth, getUserChallengeProgressById);

export default router;