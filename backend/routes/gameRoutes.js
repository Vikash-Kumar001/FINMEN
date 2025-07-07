import express from 'express';
import {
  getMissionsByLevel,
  completeMission,
  getUserProgress,
} from '../controllers/gameController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// ✅ GET /api/game/missions/:level — Fetch missions for a specific level
router.get('/missions/:level', requireAuth, getMissionsByLevel);

// ✅ POST /api/game/complete/:missionId — Mark a mission as complete
router.post('/complete/:missionId', requireAuth, completeMission);

// ✅ GET /api/game/progress — Get user progress
router.get('/progress', requireAuth, getUserProgress);

export default router;
