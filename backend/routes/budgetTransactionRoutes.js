import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getBudgetSummary,
  getTransactions,
  createTransaction,
  fundHealCoins,
  recordHealCoinsSpend,
  getHealCoinsBalance,
  updateTransactionStatus,
  exportTransactions
} from '../controllers/budgetTransactionController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Budget and transaction management
router.get('/budget/summary', getBudgetSummary);
router.get('/budget/transactions', getTransactions);
router.post('/budget/transactions', createTransaction);
router.put('/budget/transactions/:transactionId/status', updateTransactionStatus);
router.get('/budget/transactions/export', exportTransactions);

// HealCoins management
router.post('/budget/healcoins/fund', fundHealCoins);
router.post('/budget/healcoins/spend', recordHealCoinsSpend);
router.get('/budget/healcoins/balance', getHealCoinsBalance);

export default router;
