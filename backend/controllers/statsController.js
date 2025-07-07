import MoodLog from "../models/MoodLog.js";
import XPLog from "../models/XPLog.js";


// Student Stats Overview

export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch XP logs if XP is tracked separately
    const xpLogs = await XPLog.find({ userId });
    const totalXp = xpLogs.reduce((sum, log) => sum + log.amount, 0);
    const level = Math.floor(totalXp / 100) + 1;
    const nextLevelXp = level * 100;

    // Mood logs for check-ins and today’s mood
    const moodLogs = await MoodLog.find({ userId }).sort({ date: -1 });
    const moodCheckins = moodLogs.length;

    const today = new Date().toISOString().split("T")[0];
    const todayMood =
      moodLogs.find(
        (log) => new Date(log.date).toISOString().split("T")[0] === today
      )?.emoji || "🙂";

    res.status(200).json({
      xp: totalXp,
      level,
      nextLevelXp,
      moodCheckins,
      todayMood,
    });
  } catch (err) {
    console.error("❌ Failed to get student stats:", err);
    res.status(500).json({ error: "Failed to fetch student stats" });
  }
};


// XP Log Data for XP Graph

export const getXPLogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const logs = await XPLog.find({ userId }).sort({ date: 1 });

    const formatted = logs.map((log) => ({
      date: log.date.toISOString().split("T")[0],
      amount: log.amount,
      source: log.source,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Failed to fetch XP logs:", err);
    res.status(500).json({ error: "Failed to fetch XP logs" });
  }
};
