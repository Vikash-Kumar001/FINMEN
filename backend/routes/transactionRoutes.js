import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// 💰 Fetch user's transaction history
router.get('/my-transactions', requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Transaction fetch error:', err);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

export default router;
