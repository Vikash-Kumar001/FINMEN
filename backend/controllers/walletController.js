import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

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
    res.status(200).json(transactions);
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
