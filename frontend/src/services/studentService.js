import api from "../utils/api";
import { mockFeatures } from "../data/mockFeatures";
import { mockAchievements } from "../data/mockAchievements";

export const fetchStudentProfile = () => api.get("/api/auth/me");
export const fetchMoodLogs = () => api.get("/api/mood/logs");
export const fetchUserProgress = () => api.get("/api/game/progress");

// Fetch student features
export const fetchStudentFeatures = async () => {
  try {
    // Try to fetch from API first
    const res = await api.get("/api/student/features");
    return res.data;
  } catch (error) {
    console.warn("Using mock features data due to API error:", error.message);
    // Return mock data if API fails
    return mockFeatures;
  }
};

// Fetch student achievements
export const fetchStudentAchievements = async () => {
  try {
    // Try to fetch from API first
    const res = await api.get("/api/student/achievements");
    return res.data;
  } catch (error) {
    console.warn("Using mock achievements data due to API error:", error.message);
    // Return mock data if API fails
    return mockAchievements;
  }
};

// Budget Planner Services
export const fetchBudgetData = async () => {
  try {
    const res = await api.get("/api/student/budget");
    return res.data;
  } catch (error) {
    console.warn("Error fetching budget data:", error.message);
    return { incomes: [], expenses: [] };
  }
};

export const saveBudgetData = async (budgetData) => {
  try {
    const res = await api.post("/api/student/budget", budgetData);
    return res.data;
  } catch (error) {
    console.error("Error saving budget data:", error.message);
    throw error;
  }
};

// Investment Simulator Services
export const fetchInvestmentData = async () => {
  try {
    const res = await api.get("/api/student/investment");
    return res.data;
  } catch (error) {
    console.warn("Error fetching investment data:", error.message);
    // Return default structure matching the frontend component's expectations
    return { 
      cash: 10000, 
      investments: [], 
      history: [],
      currentDay: 1
    };
  }
};

export const saveInvestmentData = async (investmentData) => {
  try {
    const res = await api.post("/api/student/investment", investmentData);
    return res.data;
  } catch (error) {
    console.error("Error saving investment data:", error.message);
    throw error;
  }
};

// Savings Goals Services
export const fetchSavingsGoals = async () => {
  try {
    const res = await api.get("/api/student/savings");
    return res.data;
  } catch (error) {
    console.warn("Error fetching savings goals:", error.message);
    return [];
  }
};

export const saveSavingsGoals = async (goals) => {
  try {
    const res = await api.post("/api/student/savings", { goals });
    return res.data;
  } catch (error) {
    console.error("Error saving savings goals:", error.message);
    throw error;
  }
};

export const addContribution = async (goalId, amount, note) => {
  try {
    const res = await api.post(`/api/student/savings/${goalId}/contribute`, { amount, note });
    return res.data;
  } catch (error) {
    console.error("Error adding contribution:", error.message);
    throw error;
  }
};

export const deleteSavingsGoal = async (goalId) => {
  try {
    const res = await api.delete(`/api/student/savings/${goalId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting savings goal:", error.message);
    throw error;
  }
};

// Financial Quiz Services
export const fetchQuizResults = async () => {
  try {
    const res = await api.get("/api/student/quiz");
    return res.data;
  } catch (error) {
    console.warn("Error fetching quiz results:", error.message);
    return [];
  }
};

export const saveQuizResults = async (quizData) => {
  try {
    const res = await api.post("/api/student/quiz", quizData);
    return res.data;
  } catch (error) {
    console.error("Error saving quiz results:", error.message);
    throw error;
  }
};

// Expense Tracker Services
export const fetchExpenses = async (filters = {}) => {
  try {
    const res = await api.get("/api/student/expenses", { params: filters });
    return res.data;
  } catch (error) {
    console.warn("Error fetching expenses:", error.message);
    return [];
  }
};

export const saveExpenses = async (expenses) => {
  try {
    const res = await api.post("/api/student/expenses", { expenses });
    return res.data;
  } catch (error) {
    console.error("Error saving expenses:", error.message);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const res = await api.delete(`/api/student/expenses/${expenseId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    throw error;
  }
};
