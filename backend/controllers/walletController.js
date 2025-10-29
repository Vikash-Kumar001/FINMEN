import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Game from "../models/Game.js";
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

    res.status(200).json(wallet);
  } catch (err) {
    next(err);
  }
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

// 📜 GET /api/wallet/transactions → List all user transactions
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
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
    
    res.status(200).json(enhancedTransactions);
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
