import express from 'express';
import {
  getAvailableRewards,  // ✅ Corrected function name
  createReward,
  deleteReward,
} from '../controllers/rewardController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// ✅ Authenticated users (students/educators) can view rewards
router.get('/', requireAuth, getAvailableRewards);

// ✅ Admin-only routes for managing rewards
router.post('/', requireAuth, checkAdmin, createReward);
router.delete('/:id', requireAuth, checkAdmin, deleteReward);

export default router;
