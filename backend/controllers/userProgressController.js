import UserProgress from '../models/UserProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// 📊 GET /api/progress - Get user progress
export const getUserProgress = async (req, res, next) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    }

    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
};

// ⬆️ POST /api/progress/add-xp - Add XP to user
export const addXP = async (req, res, next) => {
  const { amount, source } = req.body;

  if (!amount || amount <= 0) {
    return next(new ErrorResponse('Invalid XP amount', 400));
  }

  try {
    let progress = await UserProgress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        xp: amount,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    } else {
      progress.xp += amount;
      
      // Check if user should level up
      const newLevel = calculateLevel(progress.xp);
      
      if (newLevel > progress.level) {
        // User leveled up!
        const oldLevel = progress.level;
        progress.level = newLevel;
        
        // Award coins for leveling up
        const levelUpCoins = (newLevel - oldLevel) * 50; // 50 coins per level
        
        // Update wallet
        let wallet = await Wallet.findOne({ userId: req.user._id });
        
        if (!wallet) {
          wallet = await Wallet.create({
            userId: req.user._id,
            balance: levelUpCoins
          });
        } else {
          wallet.balance += levelUpCoins;
          wallet.lastUpdated = Date.now();
          await wallet.save();
        }
        
        // Create transaction record
        await Transaction.create({
          userId: req.user._id,
          type: 'credit',
          amount: levelUpCoins,
          description: `Level up reward (Level ${newLevel})`
        });
      }
      
      await progress.save();
    }

    res.status(200).json({
      message: 'XP added successfully',
      progress,
      levelUp: progress.level > 1 && calculateLevel(progress.xp - amount) < progress.level
    });
  } catch (err) {
    next(err);
  }
};

// 📅 POST /api/progress/update-streak - Update user streak
export const updateStreak = async (req, res, next) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 1,
        lastCheckIn: new Date()
      });
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastCheckIn = progress.lastCheckIn ? new Date(progress.lastCheckIn) : null;
      let lastCheckInDay = null;
      
      if (lastCheckIn) {
        lastCheckInDay = new Date(lastCheckIn);
        lastCheckInDay.setHours(0, 0, 0, 0);
      }
      
      // Check if this is a new day check-in
      if (!lastCheckInDay || today.getTime() > lastCheckInDay.getTime()) {
        // Check if this is consecutive day
        if (lastCheckInDay) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastCheckInDay.getTime() === yesterday.getTime()) {
            // Consecutive day, increase streak
            progress.streak += 1;
          } else {
            // Not consecutive, reset streak
            progress.streak = 1;
          }
        } else {
          // First check-in
          progress.streak = 1;
        }
        
        progress.lastCheckIn = today;
        await progress.save();
      }
    }

    res.status(200).json({
      message: 'Streak updated successfully',
      streak: progress.streak
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to calculate level based on XP
const calculateLevel = (xp) => {
  // Simple level calculation: level = 1 + floor(xp / 100)
  // This means 100 XP per level
  return Math.floor(xp / 100) + 1;
};