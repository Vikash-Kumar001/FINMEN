import User from '../models/User.js';
import MoodLog from '../models/MoodLog.js';
import UserProgress from '../models/UserProgress.js';

// 📊 GET /api/analytics/summary
export const getPlatformSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEducators = await User.countDocuments({ role: 'educator' });
    const approvedEducators = await User.countDocuments({ role: 'educator', isApproved: true });

    const allProgress = await UserProgress.find();
    const totalXP = allProgress.reduce((sum, p) => sum + p.xp, 0);
    const totalHealCoins = allProgress.reduce((sum, p) => sum + p.healCoins, 0);

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalEducators,
      approvedEducators,
      totalXP,
      totalHealCoins,
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ error: 'Failed to load analytics summary' });
  }
};

// 📈 GET /api/analytics/mood-trends
export const getMoodTrends = async (req, res) => {
  try {
    const logs = await MoodLog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          avgMood: { $avg: '$moodScore' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(logs);
  } catch (err) {
    console.error('Mood trends error:', err);
    res.status(500).json({ error: 'Failed to fetch mood trends' });
  }
};

// 🏆 GET /api/analytics/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const top = await UserProgress.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate('userId', 'name username');

    res.status(200).json(top);
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};
