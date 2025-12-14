import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Game from "../models/Game.js";
import UnifiedGameProgress from "../models/UnifiedGameProgress.js";
import GameProgress from "../models/GameProgress.js";
import UserProgress from "../models/UserProgress.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { getGameTitle, getGameType, getPillarLabel } from "../utils/gameIdToTitleMap.js";

// 🔍 GET /api/wallet → Returns wallet info, creates one if not exists
export const getWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
        balance: 0,
      });
    }

    // Fetch user XP from UserProgress
    let userProgress = await UserProgress.findOne({ userId: req.user._id });
    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId: req.user._id,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    }
    const totalXP = userProgress.xp || 0;

    // Calculate rank (users with higher balance rank higher)
    const walletsWithHigherBalance = await Wallet.countDocuments({
      balance: { $gt: wallet.balance }
    });
    const rank = walletsWithHigherBalance + 1;

    // Calculate next milestone (next 100, 500, 1000, 5000, etc.)
    const milestones = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];
    const nextMilestone = milestones.find(m => m > wallet.balance) || milestones[milestones.length - 1];

    // Fetch achievements from game progress
    const unifiedProgress = await UnifiedGameProgress.find({ userId: req.user._id });
    const gameProgress = await GameProgress.find({ userId: req.user._id });
    
    // Collect all achievements
    const allAchievements = [];
    
    // From UnifiedGameProgress
    unifiedProgress.forEach(progress => {
      if (progress.achievements && progress.achievements.length > 0) {
        progress.achievements.forEach(achievement => {
          allAchievements.push({
            icon: getAchievementIcon(achievement.badge),
            title: achievement.name || "Achievement",
            description: achievement.description || "Great job!"
          });
        });
      }
    });
    
    // From GameProgress
    gameProgress.forEach(progress => {
      if (progress.achievements && progress.achievements.length > 0) {
        progress.achievements.forEach(achievement => {
          allAchievements.push({
            icon: getAchievementIcon(achievement.badge),
            title: achievement.name || "Achievement",
            description: achievement.description || "Great job!"
          });
        });
      }
    });

    // Remove duplicates based on title
    const uniqueAchievements = Array.from(
      new Map(allAchievements.map(ach => [ach.title, ach])).values()
    ).slice(0, 8); // Limit to 8 most recent

    // Return enhanced wallet data
    res.status(200).json({
      ...wallet.toObject(),
      totalXP,
      rank,
      nextMilestone,
      achievements: uniqueAchievements.length > 0 ? uniqueAchievements : [
        {
          icon: "🎯",
          title: "Get Started",
          description: "Complete your first game to earn an achievement!"
        }
      ]
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to get achievement icon based on badge
const getAchievementIcon = (badge) => {
  const iconMap = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
    diamond: "💠"
  };
  return iconMap[badge] || "🏆";
};

// ➕ POST /api/wallet/add → Add coins to wallet
export const addCoins = async (req, res, next) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id, balance: 0 });
    }

    wallet.balance += amount;
    wallet.lastUpdated = Date.now();
    await wallet.save();

    await Transaction.create({
      userId: req.user._id,
      type: "credit",
      amount,
      description: description || "HealCoins added",
    });

    res.status(200).json({ message: "Coins added", newBalance: wallet.balance });
  } catch (err) {
    next(err);
  }
};

// ➖ POST /api/wallet/spend → Spend coins
export const spendCoins = async (req, res, next) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.lastUpdated = Date.now();
    await wallet.save();

    await Transaction.create({
      userId: req.user._id,
      type: "debit",
      amount,
      description: description || "HealCoins spent",
    });

    res.status(200).json({ message: "Coins spent", newBalance: wallet.balance });
  } catch (err) {
    next(err);
  }
};

// 📜 GET /api/wallet/transactions → List all user transactions (last 7 days) with pagination
export const getTransactions = async (req, res, next) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Calculate date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Build query for transactions from the last 7 days
    const query = { 
      userId: req.user._id,
      createdAt: { $gte: oneWeekAgo }
    };
    
    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(query);
    
    // Fetch paginated transactions
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Fetch all games and create a map of category -> title for efficient lookup
    const games = await Game.find({}, 'category title');
    const gameTitleMap = new Map();
    games.forEach(game => {
      if (game.category && game.title) {
        gameTitleMap.set(game.category, game.title);
      }
    });
    
    // Enhance transaction descriptions by replacing gameId with game title
    const enhancedTransactions = transactions.map((txn) => {
      // Check if description matches pattern: "Reward for {gameId} game (...)"
      const rewardPattern = /Reward for ([^ ]+) game \((.+)\)/;
      const match = txn.description?.match(rewardPattern);
      
      if (match && match[1]) {
        const gameId = match[1];
        // We will replace the parentheses entirely with pillar label
        
        // Try multiple lookup methods:
        // 1. Database Game model (by category)
        // 2. Frontend game mapping (by gameId)
        let gameTitle = gameTitleMap.get(gameId);
        
        if (!gameTitle) {
          // Try the gameId to title mapping for frontend-defined games
          gameTitle = getGameTitle(gameId);
        }
        // Determine pillar label
        let pillarLabel = null;
        const dbGame = games.find(g => g.category === gameId);
        const type = dbGame?.type || getGameType(gameId);
        pillarLabel = getPillarLabel(type);
        
        if (gameTitle) {
          // Replace gameId with game title
          return {
            ...txn.toObject(),
            description: `Reward for ${gameTitle} game (${pillarLabel || 'Game'})`
          };
        }
      }
      
      return txn.toObject();
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      transactions: enhancedTransactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (err) {
    next(err);
  }
};

// 💸 POST /api/wallet/redeem → Request redemption to UPI
export const postRedemptionRequest = async (req, res, next) => {
  try {
    const { amount, upiId } = req.body;

    if (!amount || !upiId) {
      throw new ErrorResponse("Amount and UPI ID are required", 400);
    }

    if (amount <= 0) {
      throw new ErrorResponse("Amount must be greater than zero", 400);
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet || wallet.balance < amount) {
      throw new ErrorResponse("Insufficient wallet balance", 400);
    }

    wallet.balance -= amount;
    wallet.lastUpdated = Date.now();
    await wallet.save();

    const txn = await Transaction.create({
      userId: req.user._id,
      amount,
      type: "redeem",
      description: `Redemption request to UPI: ${upiId}`,
      status: "pending",
      upiId,
    });

    res.status(200).json({
      message: "Redemption request submitted",
      wallet,
      transaction: txn,
    });
  } catch (err) {
    next(err);
  }
};
