import express from 'express';
import {
  getMissionsByLevel,
  completeMission,
  getUserProgress,
  getAllGames,
  getGamesByCategory,
  getGamesByType,
  getGamesByAgeGroup,
  completeGame,
  getUserAchievements,
  getUserGameStats,
  getLeaderboard
} from '../controllers/gameController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// ✅ GET /api/game/missions/:level — Fetch missions for a specific level
router.get('/missions/:level', requireAuth, getMissionsByLevel);

// ✅ POST /api/game/complete/:missionId — Mark a mission as complete
router.post('/complete/:missionId', requireAuth, completeMission);

// ✅ GET /api/game/progress — Get user progress
router.get('/progress', requireAuth, getUserProgress);

// 🎮 GET /api/game/games — Get all games
router.get('/games', requireAuth, getAllGames);

// 🎮 GET /api/game/games/:category — Get games by category
router.get('/games/:category', requireAuth, getGamesByCategory);

// 🎮 GET /api/game/games/type/:type — Get games by type (financial or mental)
router.get('/games/type/:type', requireAuth, getGamesByType);

// 🎮 GET /api/game/games/age/:ageGroup — Get games by age group
router.get('/games/age/:ageGroup', requireAuth, getGamesByAgeGroup);

// 🎮 POST /api/game/complete-game/:gameId — Mark a game as complete
router.post('/complete-game/:gameId', requireAuth, completeGame);

// 🏆 GET /api/game/achievements — Get user achievements
router.get('/achievements', requireAuth, getUserAchievements);

// 📊 GET /api/game/user-stats — Get user game stats
router.get('/user-stats', requireAuth, getUserGameStats);

// 🏆 GET /api/game/leaderboard — Get leaderboard
router.get('/leaderboard', requireAuth, getLeaderboard);

export default router;
