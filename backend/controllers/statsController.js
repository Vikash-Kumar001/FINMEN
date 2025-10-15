import MoodLog from "../models/MoodLog.js";
import XPLog from "../models/XPLog.js";
import UserProgress from "../models/UserProgress.js";
import Wallet from "../models/Wallet.js";
import UnifiedGameProgress from "../models/UnifiedGameProgress.js";
import ActivityLog from "../models/ActivityLog.js";
import Transaction from "../models/Transaction.js";


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

// Pillar Mastery - Overall and Weak Pillars with Week-on-Week Delta
export const getPillarMastery = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Define all pillars
    const pillars = [
      { key: 'finance', name: 'Financial Literacy', icon: '💰' },
      { key: 'mental', name: 'Mental Health', icon: '🧠' },
      { key: 'ai', name: 'AI for All', icon: '🤖' },
      { key: 'brain', name: 'Brain Health', icon: '🎯' },
      { key: 'uvls', name: 'Life Skills & Values', icon: '🌟' },
      { key: 'dcos', name: 'Digital Citizenship', icon: '🔒' },
      { key: 'moral', name: 'Moral Values', icon: '💫' },
      { key: 'ehe', name: 'Entrepreneurship', icon: '🚀' },
      { key: 'crgc', name: 'Global Citizenship', icon: '🌍' },
      { key: 'educational', name: 'Education', icon: '📚' }
    ];

    // Get all game progress for user
    const gameProgress = await UnifiedGameProgress.find({ userId });
    
    // Calculate mastery for each pillar
    const pillarMastery = pillars.map(pillar => {
      const pillarGames = gameProgress.filter(game => game.gameType === pillar.key);
      
      if (pillarGames.length === 0) {
        return {
          pillar: pillar.name,
          icon: pillar.icon,
          mastery: 0,
          gamesCompleted: 0,
          totalGames: 0
        };
      }

      // Calculate average completion percentage
      const totalMastery = pillarGames.reduce((sum, game) => {
        const completionPercent = game.totalLevels > 0 
          ? (game.levelsCompleted / game.totalLevels) * 100 
          : 0;
        return sum + completionPercent;
      }, 0);

      const avgMastery = totalMastery / pillarGames.length;
      const gamesCompleted = pillarGames.filter(g => g.fullyCompleted).length;

      return {
        pillar: pillar.name,
        icon: pillar.icon,
        mastery: Math.round(avgMastery),
        gamesCompleted,
        totalGames: pillarGames.length
      };
    }).filter(p => p.totalGames > 0); // Only include pillars with games

    // Calculate overall mastery
    const overallMastery = pillarMastery.length > 0
      ? Math.round(pillarMastery.reduce((sum, p) => sum + p.mastery, 0) / pillarMastery.length)
      : 0;

    // Get week-on-week delta
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Calculate previous week mastery
    const lastWeekProgress = await UnifiedGameProgress.find({
      userId,
      lastPlayedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    const lastWeekPillarMastery = pillars.map(pillar => {
      const pillarGames = lastWeekProgress.filter(game => game.gameType === pillar.key);
      if (pillarGames.length === 0) return { pillar: pillar.name, mastery: 0 };
      
      const totalMastery = pillarGames.reduce((sum, game) => {
        const completionPercent = game.totalLevels > 0 
          ? (game.levelsCompleted / game.totalLevels) * 100 
          : 0;
        return sum + completionPercent;
      }, 0);

      return {
        pillar: pillar.name,
        mastery: Math.round(totalMastery / pillarGames.length)
      };
    });

    // Add week-on-week delta
    const pillarMasteryWithDelta = pillarMastery.map(current => {
      const previous = lastWeekPillarMastery.find(p => p.pillar === current.pillar);
      const delta = previous ? current.mastery - previous.mastery : 0;
      
      return {
        ...current,
        deltaWoW: delta
      };
    });

    // Get top 3 weak pillars (lowest mastery, but with at least 1 game)
    const weakPillars = [...pillarMasteryWithDelta]
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 3);

    res.status(200).json({
      overallMastery,
      totalPillars: pillarMastery.length,
      pillars: pillarMasteryWithDelta,
      weakPillars
    });
  } catch (err) {
    console.error("❌ Failed to get pillar mastery:", err);
    res.status(500).json({ error: "Failed to fetch pillar mastery" });
  }
};

// Emotional Score - 7 Day Trend
export const getEmotionalScore = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get mood logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moodLogs = await MoodLog.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Map emojis to scores (1-5 scale)
    const emojiToScore = {
      '😢': 1, '😔': 1, '😞': 1, '😰': 1, '😨': 1,
      '😕': 2, '😟': 2, '🙁': 2,
      '😐': 3, '😑': 3, '🙂': 3,
      '😊': 4, '😌': 4, '🙃': 4,
      '😄': 5, '😁': 5, '😃': 5, '😍': 5, '🤩': 5, '🥳': 5, '😎': 5
    };

    // Create 7-day trend data
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayMoods = moodLogs.filter(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === dateStr;
      });

      if (dayMoods.length > 0) {
        const avgScore = dayMoods.reduce((sum, log) => {
          return sum + (emojiToScore[log.emoji] || 3);
        }, 0) / dayMoods.length;

        trendData.push({
          date: dateStr,
          score: Math.round(avgScore * 10) / 10, // Round to 1 decimal
          emoji: dayMoods[dayMoods.length - 1].emoji,
          entries: dayMoods.length
        });
      } else {
        trendData.push({
          date: dateStr,
          score: null,
          emoji: null,
          entries: 0
        });
      }
    }

    // Calculate average emotional score
    const validScores = trendData.filter(d => d.score !== null);
    const avgScore = validScores.length > 0
      ? validScores.reduce((sum, d) => sum + d.score, 0) / validScores.length
      : 3;

    // Calculate trend direction
    const recentScores = validScores.slice(-3).map(d => d.score);
    const olderScores = validScores.slice(0, -3).map(d => d.score);
    const recentAvg = recentScores.length > 0 
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length 
      : avgScore;
    const olderAvg = olderScores.length > 0 
      ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length 
      : avgScore;
    
    const trend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';

    res.status(200).json({
      averageScore: Math.round(avgScore * 10) / 10,
      trend,
      trendData,
      totalEntries: moodLogs.length,
      entriesThisWeek: validScores.length
    });
  } catch (err) {
    console.error("❌ Failed to get emotional score:", err);
    res.status(500).json({ error: "Failed to fetch emotional score" });
  }
};

// Engagement Minutes - Last 7 Days
export const getEngagementMinutes = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get activity logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityLogs = await ActivityLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: 1 });

    // Get game time from UnifiedGameProgress
    const gameProgress = await UnifiedGameProgress.find({ userId });
    const recentGameTime = gameProgress.reduce((sum, game) => {
      if (game.lastPlayedAt >= sevenDaysAgo) {
        return sum + (game.totalTimePlayed || 0);
      }
      return sum;
    }, 0);

    // Calculate engagement by day
    const dailyEngagement = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayActivities = activityLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= date && logDate < nextDate;
      });

      const dayGames = gameProgress.filter(game => {
        const playDate = new Date(game.lastPlayedAt);
        return playDate >= date && playDate < nextDate;
      });

      // Estimate: Each activity = ~2 minutes, game time is in seconds
      const activityMinutes = dayActivities.length * 2;
      const gameMinutes = Math.round(dayGames.reduce((sum, g) => sum + (g.totalTimePlayed || 0), 0) / 60);
      const totalMinutes = activityMinutes + gameMinutes;

      dailyEngagement.push({
        date: date.toISOString().split('T')[0],
        minutes: totalMinutes,
        activities: dayActivities.length,
        gamesPlayed: dayGames.length
      });
    }

    // Calculate totals
    const totalMinutes = dailyEngagement.reduce((sum, day) => sum + day.minutes, 0);
    const avgMinutesPerDay = Math.round(totalMinutes / 7);
    const daysActive = dailyEngagement.filter(day => day.minutes > 0).length;

    // Calculate streak
    let currentStreak = 0;
    for (let i = dailyEngagement.length - 1; i >= 0; i--) {
      if (dailyEngagement[i].minutes > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    res.status(200).json({
      totalMinutes,
      avgMinutesPerDay,
      daysActive,
      streak: currentStreak,
      dailyEngagement,
      goalMinutes: 30, // Daily goal
      goalProgress: Math.min(100, Math.round((avgMinutesPerDay / 30) * 100))
    });
  } catch (err) {
    console.error("❌ Failed to get engagement minutes:", err);
    res.status(500).json({ error: "Failed to fetch engagement minutes" });
  }
};

// Activity Heatmap - Week × Hours
export const getActivityHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get activity logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityLogs = await ActivityLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: 1 });

    // Create heatmap data: days × hours
    const heatmapData = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(0, 0, 0, 0);
      
      const dayName = daysOfWeek[date.getDay()];
      const hourlyData = Array(24).fill(0);
      
      // Count activities per hour
      activityLogs.forEach(log => {
        const logDate = new Date(log.timestamp);
        const logDay = new Date(logDate);
        logDay.setHours(0, 0, 0, 0);
        
        if (logDay.getTime() === date.getTime()) {
          const hour = logDate.getHours();
          hourlyData[hour]++;
        }
      });
      
      heatmapData.push({
        day: dayName,
        date: date.toISOString().split('T')[0],
        hours: hourlyData
      });
    }

    res.status(200).json({
      heatmapData,
      totalActivities: activityLogs.length
    });
  } catch (err) {
    console.error("❌ Failed to get activity heatmap:", err);
    res.status(500).json({ error: "Failed to fetch activity heatmap" });
  }
};

// Mood Timeline - Last 7 check-ins with notes
export const getMoodTimeline = async (req, res) => {
  try {
    const userId = req.user._id;

    const moodLogs = await MoodLog.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    const timeline = moodLogs.reverse().map(log => ({
      id: log._id,
      emoji: log.emoji,
      note: log.journal || "",
      date: log.date,
      timestamp: log.createdAt
    }));

    res.status(200).json({
      timeline,
      totalEntries: await MoodLog.countDocuments({ userId })
    });
  } catch (err) {
    console.error("❌ Failed to get mood timeline:", err);
    res.status(500).json({ error: "Failed to fetch mood timeline" });
  }
};

// AI Recommendations - Personalized suggestions
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's progress data
    const userProgress = await UserProgress.findOne({ userId });
    const gameProgress = await UnifiedGameProgress.find({ userId }).sort({ lastPlayedAt: -1 }).limit(5);
    const moodLogs = await MoodLog.find({ userId }).sort({ date: -1 }).limit(3);

    // Simple recommendation algorithm based on user data
    const recommendations = [];

    // Recommend based on level
    if (userProgress && userProgress.level < 5) {
      recommendations.push({
        type: 'mission',
        title: 'Welcome Quest',
        description: 'Complete your first financial literacy mission',
        icon: '🎯',
        path: '/learn/financial-literacy',
        reason: 'Perfect for beginners',
        xpReward: 50
      });
    }

    // Recommend based on recent games
    if (gameProgress.length > 0) {
      const recentGameType = gameProgress[0].gameType;
      recommendations.push({
        type: 'lesson',
        title: `Master ${recentGameType.toUpperCase()} Skills`,
        description: 'Continue your learning journey',
        icon: '📚',
        path: `/games/${recentGameType}`,
        reason: 'Based on your activity',
        xpReward: 30
      });
    }

    // Recommend based on mood
    if (moodLogs.length > 0) {
      recommendations.push({
        type: 'wellness',
        title: 'Mindfulness Break',
        description: 'Take a moment for yourself',
        icon: '🧘',
        path: '/student/mindfull-break',
        reason: 'Boost your wellbeing',
        xpReward: 20
      });
    }

    // Fill up to 3 recommendations
    while (recommendations.length < 3) {
      const defaults = [
        {
          type: 'quiz',
          title: 'Quick Financial Quiz',
          description: 'Test your money knowledge',
          icon: '💡',
          path: '/games/financial-quiz',
          reason: 'Popular choice',
          xpReward: 25
        },
        {
          type: 'mission',
          title: 'Daily Challenge',
          description: 'Complete today\'s special challenge',
          icon: '⭐',
          path: '/student/daily-challenges',
          reason: 'Trending now',
          xpReward: 40
        },
        {
          type: 'game',
          title: 'Brain Teaser',
          description: 'Sharpen your cognitive skills',
          icon: '🧠',
          path: '/games/brain-teaser',
          reason: 'Recommended for you',
          xpReward: 35
        }
      ];
      
      const randomRec = defaults[recommendations.length % defaults.length];
      recommendations.push(randomRec);
    }

    res.status(200).json({
      recommendations: recommendations.slice(0, 3)
    });
  } catch (err) {
    console.error("❌ Failed to get recommendations:", err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

// Leaderboard Snippet - Top users
export const getLeaderboardSnippet = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get top 5 users by XP
    const topUsers = await UserProgress.find()
      .sort({ xp: -1 })
      .limit(5)
      .populate('userId', 'name username');

    // Get current user's rank
    const userProgress = await UserProgress.findOne({ userId });
    const rank = await UserProgress.countDocuments({
      xp: { $gt: userProgress?.xp || 0 }
    }) + 1;

    const leaderboard = topUsers.map((progress, index) => ({
      rank: index + 1,
      name: progress.userId?.name || 'Anonymous',
      username: progress.userId?.username || 'user',
      xp: progress.xp,
      level: progress.level,
      isCurrentUser: progress.userId?._id.toString() === userId.toString()
    }));

    res.status(200).json({
      leaderboard,
      currentUserRank: rank,
      currentUserXP: userProgress?.xp || 0,
      totalUsers: await UserProgress.countDocuments()
    });
  } catch (err) {
    console.error("❌ Failed to get leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// Achievement Timeline - Chronological achievements
export const getAchievementTimeline = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get achievements from game progress
    const gameProgress = await UnifiedGameProgress.find({ userId });
    
    const achievements = [];
    gameProgress.forEach(game => {
      if (game.achievements && game.achievements.length > 0) {
        game.achievements.forEach(achievement => {
          achievements.push({
            id: achievement._id,
            name: achievement.name,
            description: achievement.description,
            badge: achievement.badge,
            earnedAt: achievement.earnedAt,
            gameId: game.gameId,
            gameType: game.gameType
          });
        });
      }
    });

    // Sort by date (most recent first)
    achievements.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    res.status(200).json({
      achievements: achievements.slice(0, 10), // Return last 10 achievements
      totalAchievements: achievements.length
    });
  } catch (err) {
    console.error("❌ Failed to get achievement timeline:", err);
    res.status(500).json({ error: "Failed to fetch achievement timeline" });
  }
};

// Daily Actions Status
export const getDailyActionsStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check daily check-in (from UserProgress)
    const userProgress = await UserProgress.findOne({ userId });
    const lastCheckIn = userProgress?.lastCheckIn ? new Date(userProgress.lastCheckIn) : null;
    const hasCheckedInToday = lastCheckIn && lastCheckIn >= today;

    // Check if mission completed today (from activity logs)
    const missionToday = await ActivityLog.findOne({
      userId,
      activityType: { $in: ['challenge_completed', 'quiz_completed'] },
      timestamp: { $gte: today }
    });

    // Check quiz completion today
    const quizToday = await ActivityLog.findOne({
      userId,
      activityType: 'quiz_completed',
      timestamp: { $gte: today }
    });

    // Check unread notifications (inbox)
    const Notification = (await import('../models/Notification.js')).default;
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false
    });

    res.status(200).json({
      dailyCheckIn: hasCheckedInToday,
      missionStarted: !!missionToday,
      quizCompleted: !!quizToday,
      inboxCount: unreadCount
    });
  } catch (err) {
    console.error("❌ Failed to get daily actions status:", err);
    res.status(500).json({ error: "Failed to fetch daily actions status" });
  }
};
