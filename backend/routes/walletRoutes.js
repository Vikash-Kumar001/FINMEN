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

router.get("/", getWallet);

router.post("/add", addCoins);

router.post("/spend", spendCoins);

router.get("/transactions", getTransactions);

router.post("/redeem", postRedemptionRequest);

export default router;
