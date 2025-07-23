import MoodLog from "../models/MoodLog.js";

export const logMood = async (req, res) => {
  const { emoji, journal } = req.body;

  try {
    const newMood = await MoodLog.create({
      userId: req.user._id,
      emoji,
      journal,
      date: new Date(),
    });

    res.status(201).json({ message: "Mood logged successfully", mood: newMood });
  } catch (err) {
    console.error("❌ Error logging mood:", err);
    res.status(500).json({ error: "Failed to log mood" });
  }
};

export const getUserMoodLogs = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(moods);
  } catch (err) {
    console.error("❌ Failed to fetch mood logs:", err);
    res.status(500).json({ error: "Failed to fetch mood logs" });
  }
};

export const getMoodAnalytics = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user._id });

    const moodCounts = {};
    const moodByWeek = {};

    moods.forEach((entry) => {
      const emoji = entry.emoji;
      const week = new Date(entry.date);
      week.setDate(week.getDate() - week.getDay()); // Sunday start
      const weekKey = week.toISOString().split("T")[0];

      moodCounts[emoji] = (moodCounts[emoji] || 0) + 1;

      if (!moodByWeek[weekKey]) moodByWeek[weekKey] = {};
      moodByWeek[weekKey][emoji] = (moodByWeek[weekKey][emoji] || 0) + 1;
    });

    res.status(200).json({ total: moodCounts, weekly: moodByWeek });
  } catch (err) {
    console.error("❌ Mood analytics error:", err);
    res.status(500).json({ error: "Failed to analyze mood data" });
  }
};

export const getWeeklyMoodStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const moods = await MoodLog.find({
      userId: req.user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const moodByDay = {};

    moods.forEach((entry) => {
      const date = new Date(entry.date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!moodByDay[day]) moodByDay[day] = { total: 0, count: 0 };

      let score = 5;
      if (entry.emoji === "😊") score = 8;
      else if (entry.emoji === "😐") score = 5;
      else if (entry.emoji === "😢") score = 2;

      moodByDay[day].total += score;
      moodByDay[day].count += 1;
    });

    const response = Object.entries(moodByDay).map(([day, { total, count }]) => ({
      day,
      score: Math.round(total / count),
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Weekly mood stats error:", err);
    res.status(500).json({ error: "Failed to compute mood stats" });
  }
};

export const getMoodHistory = async (req, res) => {
  const { filter } = req.query;

  try {
    let startDate;
    const today = new Date();

    if (filter === "week") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (filter === "month") {
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 1);
    } else {
      return res.status(400).json({ error: "Invalid filter value" });
    }

    const moods = await MoodLog.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: -1 });

    res.status(200).json(moods);
  } catch (err) {
    console.error("❌ Mood history error:", err);
    res.status(500).json({ error: "Failed to fetch mood history" });
  }
};
