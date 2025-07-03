import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { generateUserReport } from '../controllers/reportController.js';

const router = express.Router();

// 📝 Generate full user report (mood, progress, etc.)
router.get('/user/:userId', requireAuth, generateUserReport);

export default router;
