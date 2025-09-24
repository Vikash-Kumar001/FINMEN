import FinancialMission from '../models/FinancialMission.js';
import MissionProgress from '../models/MissionProgress.js';
import Game from '../models/Game.js';
import GameProgress from '../models/GameProgress.js';
import GameAchievement from '../models/GameAchievement.js';
import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// 📥 GET /api/game/missions/:level
export const getMissionsByLevel = async (req, res) => {
  const { level } = req.params;

  try {
    const missions = await FinancialMission.find({ level });
    res.status(200).json(missions);
  } catch (err) {
    console.error('❌ Failed to fetch missions:', err);
    res.status(500).json({ error: 'Server error while fetching missions' });
  }
};

// ✅ POST /api/game/complete/:missionId
export const completeMission = async (req, res) => {
  const userId = req.user?._id;
  const { missionId } = req.params;

  try {
    const mission = await FinancialMission.findById(missionId);
    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    let progress = await MissionProgress.findOne({ userId });

    if (!progress) {
      progress = await MissionProgress.create({
        userId,
        completedMissions: [],
        xp: 0,
        healCoins: 0,
        badges: [],
      });
    }

    const alreadyCompleted = progress.completedMissions.some(
      (m) => m.missionId.toString() === missionId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Mission already completed' });
    }

    // Update progress
    progress.completedMissions.push({ missionId });
    progress.xp += mission.xp;
    progress.healCoins += mission.rewardCoins;

    if (mission.badge && !progress.badges.includes(mission.badge)) {
      progress.badges.push(mission.badge);
    }

    await progress.save();

    res.status(200).json({
      message: '🎉 Mission completed!',
      newXP: progress.xp,
      newCoins: progress.healCoins,
      badges: progress.badges,
    });
  } catch (err) {
    console.error('❌ Mission completion error:', err);
    res.status(500).json({ error: 'Failed to complete mission' });
  }
};

// 📊 GET /api/game/progress
export const getUserProgress = async (req, res) => {
  try {
    const progress = await MissionProgress.findOne({ userId: req.user._id })
      .populate('completedMissions.missionId');

    res.status(200).json(progress || {});
  } catch (err) {
    console.error('❌ Progress fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

// 🎮 GET /api/game/games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json(games);
  } catch (err) {
    console.error('❌ Failed to fetch games:', err);
    res.status(500).json({ error: 'Server error while fetching games' });
  }
};

// 🎮 GET /api/game/games/:category
export const getGamesByCategory = async (req, res) => {
  const { category } = req.params;
  
  try {
    const games = await Game.find({ category });
    res.status(200).json(games);
  } catch (err) {
    console.error('❌ Failed to fetch games by category:', err);
    res.status(500).json({ error: 'Server error while fetching games' });
  }
};

// 🎮 GET /api/game/games/type/:type
export const getGamesByType = async (req, res) => {
  const { type } = req.params;
  
  try {
    const games = await Game.find({ type });
    res.status(200).json(games);
  } catch (err) {
    console.error('❌ Failed to fetch games by type:', err);
    res.status(500).json({ error: 'Server error while fetching games' });
  }
};

// 🎮 GET /api/game/games/age/:ageGroup
export const getGamesByAgeGroup = async (req, res) => {
  const { ageGroup } = req.params;
  
  try {
    const games = await Game.find({ 
      $or: [
        { ageGroup },
        { ageGroup: 'all' }
      ] 
    });
    res.status(200).json(games);
  } catch (err) {
    console.error('❌ Failed to fetch games by age group:', err);
    res.status(500).json({ error: 'Server error while fetching games' });
  }
};

// 🎮 POST /api/game/complete-game/:gameId
export const completeGame = async (req, res) => {
  const userId = req.user?._id;
  const { gameId } = req.params;
  const { score, timePlayed, achievements } = req.body;

  try {
    // Change from findById to findOne with category filter
    const game = await Game.findOne({ category: gameId });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Find or create game progress
    let gameProgress = await GameProgress.findOne({ userId, gameId: game._id });
    
    if (!gameProgress) {
      gameProgress = new GameProgress({
        userId,
        gameId: game._id,
        score: score || 0,
        timePlayed: timePlayed || 0,
        achievements: [],
        coinsEarned: 0,
        streak: 1
      });
    } else {
      // Update existing progress
      if (score && score > gameProgress.score) {
        gameProgress.score = score;
      }
      
      if (timePlayed) {
        gameProgress.timePlayed += timePlayed;
      }
      
      // Check if played on consecutive days for streak
      const lastPlayed = new Date(gameProgress.lastPlayed);
      const today = new Date();
      const diffTime = Math.abs(today - lastPlayed);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        gameProgress.streak += 1;
      } else if (diffDays > 1) {
        gameProgress.streak = 1;
      }
      
      gameProgress.lastPlayed = today;
    }
    
    // Add new achievements if any
    if (achievements && achievements.length > 0) {
      for (const achievement of achievements) {
        // Check if achievement already exists
        const existingAchievement = gameProgress.achievements.find(
          a => a.name === achievement.name
        );
        
        if (!existingAchievement) {
          gameProgress.achievements.push({
            name: achievement.name,
            description: achievement.description,
            earnedAt: new Date(),
            badge: achievement.badge || 'bronze'
          });
        }
      }
    }
    
    // Calculate coins earned (base + streak bonus)
    const streakBonus = Math.min(Math.floor(gameProgress.streak / 3), 3); // Max 3x bonus
    const coinsEarned = game.rewardCoins * (1 + (streakBonus * 0.25)); // 25% bonus per streak level
    
    // Update wallet
    let wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0
      });
    }
    
    wallet.balance += coinsEarned;
    await wallet.save();
    
    // Record transaction
    await Transaction.create({
      userId,
      type: 'credit',
      amount: coinsEarned,
      description: `Reward for completing ${game.title} game`,
    });
    
    // Update total coins earned in game progress
    gameProgress.coinsEarned += coinsEarned;
    
    // Save game progress
    await gameProgress.save();
    
    // After saving game progress and wallet
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.to(userId.toString()).emit('game-completed', {
      gameId,
      coinsEarned,
      newBalance: wallet.balance,
      streak: gameProgress.streak,
      achievements: gameProgress.achievements,
      message: 'Game completed and rewards granted!'
    });
    
    res.status(200).json({
      message: '🎉 Game completed successfully!',
      gameProgress,
      coinsEarned,
      newBalance: wallet.balance,
      streak: gameProgress.streak
    });
  } catch (err) {
    console.error('❌ Game completion error:', err);
    res.status(500).json({ error: 'Failed to complete game' });
  }
};

// 🏆 GET /api/game/achievements
export const getUserAchievements = async (req, res) => {
  const userId = req.user?._id;
  
  try {
    const gameProgress = await GameProgress.find({ userId })
      .populate('gameId')
      .select('achievements gameId');
    
    // Format achievements by game
    const achievements = gameProgress.map(progress => ({
      game: progress.gameId.title,
      gameType: progress.gameId.type,
      gameCategory: progress.gameId.category,
      achievements: progress.achievements
    }));
    
    res.status(200).json(achievements);
  } catch (err) {
    console.error('❌ Failed to fetch achievements:', err);
    res.status(500).json({ error: 'Server error while fetching achievements' });
  }
};

// 📊 GET /api/game/user-stats
export const getUserGameStats = async (req, res) => {
  const userId = req.user?._id;
  
  try {
    // Get all game progress for user
    const gameProgress = await GameProgress.find({ userId })
      .populate('gameId');
    
    // Calculate stats
    const totalGamesPlayed = gameProgress.length;
    const totalTimePlayed = gameProgress.reduce((sum, game) => sum + game.timePlayed, 0);
    const totalCoinsEarned = gameProgress.reduce((sum, game) => sum + game.coinsEarned, 0);
    const totalAchievements = gameProgress.reduce((sum, game) => sum + game.achievements.length, 0);
    
    // Get highest streak
    const highestStreak = gameProgress.reduce(
      (max, game) => Math.max(max, game.streak), 0
    );
    
    // Get games by type
    const financialGames = gameProgress.filter(game => game.gameId.type === 'financial').length;
    const mentalGames = gameProgress.filter(game => game.gameId.type === 'mental').length;
    
    // Get current wallet balance
    const wallet = await Wallet.findOne({ userId });
    
    res.status(200).json({
      totalGamesPlayed,
      totalTimePlayed,
      totalCoinsEarned,
      totalAchievements,
      highestStreak,
      financialGames,
      mentalGames,
      currentBalance: wallet ? wallet.balance : 0
    });
  } catch (err) {
    console.error('❌ Failed to fetch user game stats:', err);
    res.status(500).json({ error: 'Server error while fetching user game stats' });
  }
};

// 🏆 GET /api/game/leaderboard
export const getLeaderboard = async (req, res) => {
  const { period = 'daily' } = req.query;
  
  try {
    // Validate period
    if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period' });
    }
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch(period) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'allTime':
        startDate = new Date(0); // Beginning of time
        break;
    }
    
    // Aggregate game progress data to get top players
    const leaderboard = await GameProgress.aggregate([
      {
        $match: {
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          totalTimePlayed: { $sum: '$timePlayed' },
          lastPlayed: { $max: '$completedAt' }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          totalScore: 1,
          gamesPlayed: 1,
          totalTimePlayed: 1,
          lastPlayed: 1,
          user: {
            name: 1,
            avatar: 1
          }
        }
      }
    ]);
    
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error('❌ Failed to fetch leaderboard:', err);
    res.status(500).json({ error: 'Server error while fetching leaderboard' });
  }
};

// 🎮 POST /api/game/complete-unified/:gameId - Unified game completion with heal coins
export const completeUnifiedGame = async (req, res) => {
  const userId = req.user?._id;
  const { gameId } = req.params;
  const {
    gameType = 'ai',
    score = 0,
    maxScore = 100,
    levelsCompleted = 1,
    totalLevels = 1,
    newLevelsCompleted = 1,
    timePlayed = 0,
    achievements = [],
    isFullCompletion = true,
    coinsPerLevel = null,
    previousProgress = {}
  } = req.body;

  try {
    // Find or create unified game progress
    let gameProgress = await UnifiedGameProgress.findOne({ userId, gameId });
    
    if (!gameProgress) {
      gameProgress = new UnifiedGameProgress({
        userId,
        gameId,
        gameType,
        totalLevels,
        maxScore
      });
    }

    // Calculate coins to award based on new levels completed
    let coinsToAward = 0;
    
    // Get game definition for default coin values
    const gameDefinition = await Game.findOne({ category: gameId });
    const defaultCoinsPerLevel = coinsPerLevel || (gameDefinition?.coinsPerLevel) || 5;
    const defaultTotalCoins = gameDefinition?.rewardCoins || (defaultCoinsPerLevel * totalLevels);

    if (coinsPerLevel) {
      // Award coins per level
      coinsToAward = newLevelsCompleted * coinsPerLevel;
    } else if (isFullCompletion && !gameProgress.fullyCompleted) {
      // Award full completion bonus only once
      coinsToAward = defaultTotalCoins;
    } else if (newLevelsCompleted > 0) {
      // Award coins for new levels completed
      coinsToAward = newLevelsCompleted * defaultCoinsPerLevel;
    }

    // Update progress
    gameProgress.levelsCompleted = Math.max(gameProgress.levelsCompleted, levelsCompleted);
    gameProgress.totalLevels = Math.max(gameProgress.totalLevels, totalLevels);
    gameProgress.highestScore = Math.max(gameProgress.highestScore, score);
    gameProgress.maxScore = Math.max(gameProgress.maxScore, maxScore);
    gameProgress.totalTimePlayed += timePlayed;
    gameProgress.lastPlayedAt = new Date();

    // Mark as fully completed if applicable
    if (isFullCompletion && !gameProgress.fullyCompleted) {
      gameProgress.fullyCompleted = true;
      gameProgress.firstCompletedAt = new Date();
    }

    // Update streak
    const today = new Date();
    const lastPlayed = new Date(gameProgress.lastStreakDate);
    const diffDays = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      gameProgress.currentStreak += 1;
    } else if (diffDays > 1) {
      gameProgress.currentStreak = 1;
    }
    gameProgress.lastStreakDate = today;

    // Add achievements
    if (achievements && achievements.length > 0) {
      for (const achievement of achievements) {
        const existingAchievement = gameProgress.achievements.find(
          a => a.name === achievement.name
        );
        
        if (!existingAchievement) {
          gameProgress.achievements.push({
            name: achievement.name,
            description: achievement.description,
            badge: achievement.badge || 'bronze'
          });
        }
      }
    }

    // Award coins if any
    let newBalance = 0;
    if (coinsToAward > 0) {
      // Update wallet
      let wallet = await Wallet.findOne({ userId });
      
      if (!wallet) {
        wallet = new Wallet({
          userId,
          balance: coinsToAward
        });
      } else {
        wallet.balance += coinsToAward;
      }
      
      await wallet.save();
      newBalance = wallet.balance;
      
      // Record transaction
      await Transaction.create({
        userId,
        type: 'credit',
        amount: coinsToAward,
        description: `Reward for ${gameId} game (${newLevelsCompleted} new levels)`
      });
      
      // Track coins in game progress
      gameProgress.totalCoinsEarned += coinsToAward;
      gameProgress.coinsEarnedHistory.push({
        amount: coinsToAward,
        reason: isFullCompletion ? 'full-completion' : 'level-completion'
      });
    }

    // Update level progress tracking
    for (let i = gameProgress.levelProgress.length + 1; i <= levelsCompleted; i++) {
      gameProgress.levelProgress.push({
        levelNumber: i,
        completed: true,
        score: i === levelsCompleted ? score : 0,
        coinsEarned: i <= gameProgress.levelProgress.length + newLevelsCompleted ? (coinsPerLevel || defaultCoinsPerLevel) : 0,
        completedAt: new Date()
      });
    }

    await gameProgress.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && coinsToAward > 0) {
      io.to(userId.toString()).emit('game-completed', {
        gameId,
        coinsEarned: coinsToAward,
        newBalance,
        streak: gameProgress.currentStreak,
        achievements: gameProgress.achievements,
        message: 'Game completed and rewards granted!'
      });
    }

    res.status(200).json({
      message: coinsToAward > 0 ? '🎉 Game completed successfully!' : 'Game completed! Thanks for playing again!',
      coinsEarned: coinsToAward,
      totalCoinsEarned: gameProgress.totalCoinsEarned,
      newLevelsCompleted,
      totalLevelsCompleted: gameProgress.levelsCompleted,
      fullyCompleted: gameProgress.fullyCompleted,
      newBalance,
      streak: gameProgress.currentStreak,
      achievements: gameProgress.achievements
    });
  } catch (err) {
    console.error('❌ Unified game completion error:', err);
    res.status(500).json({ error: 'Failed to complete game' });
  }
};

// 📊 GET /api/game/progress/:gameId - Get specific game progress
export const getUnifiedGameProgress = async (req, res) => {
  const userId = req.user?._id;
  const { gameId } = req.params;
  
  try {
    const progress = await UnifiedGameProgress.findOne({ userId, gameId });
    
    if (!progress) {
      return res.status(200).json({
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        totalLevels: 1,
        maxScore: 100
      });
    }
    
    res.status(200).json(progress);
  } catch (err) {
    console.error('❌ Failed to fetch game progress:', err);
    res.status(500).json({ error: 'Failed to fetch game progress' });
  }
};

// 📊 PUT /api/game/progress/:gameId - Update game progress
export const updateUnifiedGameProgress = async (req, res) => {
  const userId = req.user?._id;
  const { gameId } = req.params;
  const updateData = req.body;
  
  try {
    const progress = await UnifiedGameProgress.findOneAndUpdate(
      { userId, gameId },
      { 
        ...updateData,
        lastPlayedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json(progress);
  } catch (err) {
    console.error('❌ Failed to update game progress:', err);
    res.status(500).json({ error: 'Failed to update game progress' });
  }
};

// 📊 GET /api/game/completed-games - Get all completed games for user
export const getCompletedGames = async (req, res) => {
  const userId = req.user?._id;
  
  try {
    const completedGames = await UnifiedGameProgress.find({ 
      userId,
      $or: [
        { fullyCompleted: true },
        { levelsCompleted: { $gt: 0 } }
      ]
    }).select('gameId gameType levelsCompleted totalLevels fullyCompleted totalCoinsEarned firstCompletedAt');
    
    res.status(200).json(completedGames);
  } catch (err) {
    console.error('❌ Failed to fetch completed games:', err);
    res.status(500).json({ error: 'Failed to fetch completed games' });
  }
};
