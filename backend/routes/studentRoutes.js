import express from 'express';
import {
  getStudentFeatures,
  getStudentAchievements,
  saveBudgetData,
  getBudgetData,
  saveInvestmentData,
  getInvestmentData,
  saveSavingsGoals,
  getSavingsGoals,
  addContribution,
  deleteSavingsGoal,
  saveQuizResults,
  getQuizResults,
  saveExpenseData,
  getExpenseData,
  deleteExpense
} from '../controllers/studentController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get student features
router.get('/features', getStudentFeatures);

// Get student achievements
router.get('/achievements', getStudentAchievements);

// Budget routes
router.post('/budget', saveBudgetData);
router.get('/budget', getBudgetData);

// Investment routes
router.post('/investment', saveInvestmentData);
router.get('/investment', getInvestmentData);

// Savings goals routes
router.post('/savings', saveSavingsGoals);
router.get('/savings', getSavingsGoals);
router.post('/savings/:goalId/contribute', addContribution);
router.delete('/savings/:goalId', deleteSavingsGoal);

// Quiz routes
router.post('/quiz', saveQuizResults);
router.get('/quiz', getQuizResults);

// Expense routes
router.post('/expenses', saveExpenseData);
router.get('/expenses', getExpenseData);
router.delete('/expenses/:expenseId', deleteExpense);

export default router;