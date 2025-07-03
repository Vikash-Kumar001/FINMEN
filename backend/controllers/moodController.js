import MoodLog from '../models/MoodLog.js';

// 📥 POST /api/mood/log
export const logMood = async (req, res) => {
  const { emoji, journal } = req.body;

  try {
    const newMood = await MoodLog.create({
      userId: req.user._id,
      emoji,
      journal,
      date: new Date(),
    });

    res.status(201).json({ message: 'Mood logged successfully', mood: newMood });
  } catch (err) {
    console.error('❌ Error logging mood:', err);
    res.status(500).json({ error: 'Failed to log mood' });
  }
};

// 📤 GET /api/mood/my-logs
export const getUserMoodLogs = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(moods);
  } catch (err) {
    console.error('❌ Failed to fetch mood logs:', err);
    res.status(500).json({ error: 'Failed to fetch mood logs' });
  }
};

// 📊 GET /api/mood/analytics
export const getMoodAnalytics = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user._id });

    const moodCounts = {};
    const moodByWeek = {};

    moods.forEach((entry) => {
      const emoji = entry.emoji;
      const week = new Date(entry.date);
      week.setDate(week.getDate() - week.getDay()); // start of week

      const weekKey = week.toISOString().split('T')[0];

      // Total count
      moodCounts[emoji] = (moodCounts[emoji] || 0) + 1;

      // Weekly grouping
      if (!moodByWeek[weekKey]) moodByWeek[weekKey] = {};
      moodByWeek[weekKey][emoji] = (moodByWeek[weekKey][emoji] || 0) + 1;
    });

    res.status(200).json({ total: moodCounts, weekly: moodByWeek });
  } catch (err) {
    console.error('❌ Mood analytics error:', err);
    res.status(500).json({ error: 'Failed to analyze mood data' });
  }
};
