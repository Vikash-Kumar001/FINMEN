import MoodLog from "../models/MoodLog.js";
import XPLog from "../models/XPLog.js";
import UserProgress from "../models/UserProgress.js";
import Wallet from "../models/Wallet.js";


// Student Stats Overview

export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user progress (primary source of XP and level)
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    }

    // Get wallet information
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        totalEarned: 0
      });
    }

    // Calculate next level XP (100 XP per level)
    const nextLevelXp = userProgress.level * 100;

    // Mood logs for check-ins and today's mood
    const moodLogs = await MoodLog.find({ userId }).sort({ date: -1 });
    const moodCheckins = moodLogs.length;

    const today = new Date().toISOString().split("T")[0];
    const todayMood =
      moodLogs.find(
        (log) => new Date(log.date).toISOString().split("T")[0] === today
      )?.emoji || "🙂";

    // Calculate weekly XP from recent XP logs (if available)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyXpLogs = await XPLog.find({ 
      userId, 
      date: { $gte: oneWeekAgo } 
    });
    const weeklyXP = weeklyXpLogs.reduce((sum, log) => sum + log.amount, 0);

    res.status(200).json({
      xp: userProgress.xp,
      level: userProgress.level,
      nextLevelXp,
      moodCheckins,
      todayMood,
      streak: userProgress.streak,
      weeklyXP,
      healCoins: wallet.balance,
      totalEarned: wallet.totalEarned || 0
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
