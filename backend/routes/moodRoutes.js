import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  logMood,
  getUserMoodLogs,
  getMoodAnalytics,
  getMoodHistory,         // ✅ For week/month filter
  getWeeklyMoodStats,     // ✅ For MoodChart (weekly score)
} from "../controllers/moodController.js";

const router = express.Router();

// 🌟 Mood Log
router.post("/log", requireAuth, logMood);

// 📋 All logs of the authenticated user
router.get("/my-logs", requireAuth, getUserMoodLogs);

// 📊 Mood analytics (total + grouped weekly)
router.get("/analytics", requireAuth, getMoodAnalytics);

// 📅 Mood history (filter=week or filter=month)
router.get("/history", requireAuth, getMoodHistory);

// 📈 Weekly mood scores for MoodChart.jsx
router.get("/week", requireAuth, getWeeklyMoodStats);  // ✅ NEW

export default router;
