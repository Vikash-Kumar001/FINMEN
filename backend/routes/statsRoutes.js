import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { 
  getStudentStats, 
  getXPLogs, 
  getPillarMastery,
  getEmotionalScore,
  getEngagementMinutes,
  getActivityHeatmap,
  getMoodTimeline,
  getRecommendations,
  getLeaderboardSnippet,
  getAchievementTimeline,
  getDailyActionsStatus
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/student", requireAuth, getStudentStats);
router.get("/xp-logs", requireAuth, getXPLogs);
router.get("/pillar-mastery", requireAuth, getPillarMastery);
router.get("/emotional-score", requireAuth, getEmotionalScore);
router.get("/engagement-minutes", requireAuth, getEngagementMinutes);
router.get("/activity-heatmap", requireAuth, getActivityHeatmap);
router.get("/mood-timeline", requireAuth, getMoodTimeline);
router.get("/recommendations", requireAuth, getRecommendations);
router.get("/leaderboard-snippet", requireAuth, getLeaderboardSnippet);
router.get("/achievement-timeline", requireAuth, getAchievementTimeline);
router.get("/daily-actions", requireAuth, getDailyActionsStatus);

export default router;
