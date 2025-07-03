import express from "express";
import {
  getWallet,
  addCoins,
  spendCoins,
  getTransactions,
  postRedemptionRequest,
} from "../controllers/walletController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// 🛡️ All wallet routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/wallet
 * @desc    Get current user wallet
 */
router.get("/", getWallet);

/**
 * @route   POST /api/wallet/add
 * @desc    Add HealCoins to user wallet
 */
router.post("/add", addCoins);

/**
 * @route   POST /api/wallet/spend
 * @desc    Spend HealCoins from user wallet
 */
router.post("/spend", spendCoins);

/**
 * @route   GET /api/wallet/transactions
 * @desc    Get all transactions for current user
 */
router.get("/transactions", getTransactions);

/**
 * @route   POST /api/wallet/redeem
 * @desc    Submit redemption request
 */
router.post("/redeem", postRedemptionRequest);

export default router;
