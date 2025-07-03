import express from 'express';
import {
  getMissionsByLevel,
  completeMission,
  getUserProgress,
} from '../controllers/gameController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.get('/missions/:level', requireAuth, getMissionsByLevel);
router.post('/complete/:missionId', requireAuth, completeMission);
router.get('/progress', requireAuth, getUserProgress);

export default router;
