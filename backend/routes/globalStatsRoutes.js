import express from 'express';
import { getGlobalStats, getCachedGlobalStats } from '../controllers/globalStatsController.js';

const router = express.Router();

// Get global platform statistics
router.get('/stats', getGlobalStats);

// Get cached global statistics (for better performance)
router.get('/stats/cached', getCachedGlobalStats);

export default router;
