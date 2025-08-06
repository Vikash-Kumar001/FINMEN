import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowLeft, Timer, Trophy, Sparkles, Coins, Award, Calendar, DollarSign, CreditCard, AlertCircle, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// Game data
const monthlyIncome = 12000; // Base income
const monthlyExpenses = [
  { id: 1, name: 'Rent', amount: 5000, category: 'Housing', essential: true, icon: '🏠' },
  { id: 2, name: 'Groceries', amount: 2000, category: 'Food', essential: true, icon: '🛒' },
  { id: 3, name: 'Utilities', amount: 1000, category: 'Housing', essential: true, icon: '💡' },
  { id: 4, name: 'Phone Plan', amount: 500, category: 'Communication', essential: true, icon: '📱' },
  { id: 5, name: 'Transportation', amount: 800, category: 'Transport', essential: true, icon: '🚌' },
];

const discretionaryExpenses = [
  { id: 6, name: 'Eating Out', amount: 1500, category: 'Food', essential: false, icon: '🍔' },
  { id: 7, name: 'Entertainment', amount: 1200, category: 'Leisure', essential: false, icon: '🎬' },
  { id: 8, name: 'Shopping', amount: 1800, category: 'Personal', essential: false, icon: '👕' },
  { id: 9, name: 'Subscriptions', amount: 600, category: 'Entertainment', essential: false, icon: '📺' },
  { id: 10, name: 'Coffee', amount: 800, category: 'Food', essential: false, icon: '☕' },
];

const partTimeJobs = [
  { id: 1, name: 'Tutoring', income: 2000, hoursPerWeek: 5, icon: '📚' },
  { id: 2, name: 'Food Delivery', income: 3000, hoursPerWeek: 8, icon: '🛵' },
  { id: 3, name: 'Retail Work', income: 4000, hoursPerWeek: 10, icon: '🏪' },
  { id: 4, name: 'Content Creation', income: 1500, hoursPerWeek: 4, icon: '📱' },
  { id: 5, name: 'Virtual Assistant', income: 2500, hoursPerWeek: 6, icon: '💻' },
];

const emergencyEvents = [
  {
    id: 1,
    title: 'Medical Emergency',
    description: 'You had to visit the hospital for a sudden illness.',
    cost: 3000,
    icon: '🏥',
    choices: [
      { id: 'a', text: 'Pay from savings', impact: { savings: -3000 } },
      { id: 'b', text: 'Use credit card', impact: { debt: 3000 } },
      { id: 'c', text: 'Ask family for help', impact: { moodPenalty: 10 } },
    ]
  },
  {
    id: 2,
    title: 'Laptop Repair',
    description: 'Your laptop stopped working and needs repairs for your studies.',
    cost: 2000,
    icon: '💻',
    choices: [
      { id: 'a', text: 'Pay from savings', impact: { savings: -2000 } },
      { id: 'b', text: 'Use credit card', impact: { debt: 2000 } },
      { id: 'c', text: 'Borrow a laptop temporarily', impact: { productivityPenalty: 15 } },
    ]
  },
  {
    id: 3,
    title: 'Unexpected Travel',
    description: 'You need to travel home for a family emergency.',
    cost: 1500,
    icon: '✈️',
    choices: [
      { id: 'a', text: 'Pay from savings', impact: { savings: -1500 } },
      { id: 'b', text: 'Use credit card', impact: { debt: 1500 } },
      { id: 'c', text: 'Skip the trip', impact: { moodPenalty: 20 } },
    ]
  },
  {
    id: 4,
    title: 'Phone Damage',
    description: 'Your phone screen cracked and needs replacement.',
    cost: 1000,
    icon: '📱',
    choices: [
      { id: 'a', text: 'Pay from savings', impact: { savings: -1000 } },
      { id: 'b', text: 'Use credit card', impact: { debt: 1000 } },
      { id: 'c', text: 'Live with a cracked screen', impact: { moodPenalty: 5 } },
    ]
  },
  {
    id: 5,
    title: 'Surprise Bill',
    description: 'You received an unexpected bill for a subscription you forgot to cancel.',
    cost: 800,
    icon: '📄',
    choices: [
      { id: 'a', text: 'Pay from savings', impact: { savings: -800 } },
      { id: 'b', text: 'Use credit card', impact: { debt: 800 } },
      { id: 'c', text: 'Contest the charge', impact: { productivityPenalty: 5 } },
    ]
  },
];

export default function BudgetHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [balance, setBalance] = useState(5000); // Starting balance
  const [savings, setSavings] = useState(0);
  const [debt, setDebt] = useState(0);
  const [mood, setMood] = useState(100); // 0-100 scale
  const [productivity, setProductivity] = useState(100); // 0-100 scale
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState({
    income: monthlyIncome,
    expenses: 0,
    savings: 0,
  });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [score, setScore] = useState(0);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(1000); // Default monthly savings goal
  
  // Start timer when game starts
  useEffect(() => {
    let timer;
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleGameComplete();
    }
    
    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, timeLeft]);
  
  // Initialize game
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      // Add all essential expenses by default
      setSelectedExpenses(monthlyExpenses.map(expense => expense.id));
      updateBudget();
    }
  }, [gameStarted, gameCompleted]);
  
  // Update budget calculations when expenses or income change
  useEffect(() => {
    if (gameStarted) {
      updateBudget();
    }
  }, [selectedExpenses, selectedJob]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const updateBudget = () => {
    // Calculate total expenses
    const totalExpenses = [...monthlyExpenses, ...discretionaryExpenses]
      .filter(expense => selectedExpenses.includes(expense.id))
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate total income (base + part-time job if any)
    const totalIncome = monthlyIncome + (selectedJob ? partTimeJobs.find(job => job.id === selectedJob).income : 0);
    
    // Update budget state
    setMonthlyBudget({
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalIncome - totalExpenses,
    });
  };
  
  const toggleExpense = (expenseId) => {
    // Cannot remove essential expenses
    const expense = [...monthlyExpenses, ...discretionaryExpenses].find(e => e.id === expenseId);
    if (expense.essential) return;
    
    setSelectedExpenses(prev => {
      if (prev.includes(expenseId)) {
        return prev.filter(id => id !== expenseId);
      } else {
        return [...prev, expenseId];
      }
    });
  };
  
  const selectJob = (jobId) => {
    setSelectedJob(jobId === selectedJob ? null : jobId);
  };
  
  const handleEmergencyChoice = (choice) => {
    const { impact } = choice;
    
    // Apply impacts
    if (impact.savings) {
      setSavings(prev => Math.max(0, prev + impact.savings));
    }
    
    if (impact.debt) {
      setDebt(prev => prev + impact.debt);
    }
    
    if (impact.moodPenalty) {
      setMood(prev => Math.max(0, prev - impact.moodPenalty));
    }
    
    if (impact.productivityPenalty) {
      setProductivity(prev => Math.max(0, prev - impact.productivityPenalty));
    }
    
    // Clear emergency
    setCurrentEmergency(null);
    
    // Show feedback modal
    setModalContent({
      type: 'info',
      title: 'Decision Made',
      message: `You chose to ${choice.text.toLowerCase()}. Life goes on!`,
      icon: <CheckCircle className="w-12 h-12 text-blue-500" />
    });
    setShowModal(true);
  };
  
  const advanceMonth = () => {
    // Check if budget is balanced
    if (monthlyBudget.savings < 0) {
      setModalContent({
        type: 'warning',
        title: 'Budget Deficit',
        message: 'Your expenses exceed your income. You need to reduce expenses or increase income before proceeding.',
        icon: <AlertCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    // Process month-end finances
    const newBalance = balance + monthlyBudget.savings - savingsGoal;
    const newSavings = savings + savingsGoal;
    
    // Apply interest on debt (2% monthly)
    const interestOnDebt = debt * 0.02;
    const newDebt = debt + interestOnDebt;
    
    // Update financial state
    setBalance(newBalance);
    setSavings(newSavings);
    setDebt(newDebt);
    
    // Calculate score for the month
    let monthScore = 0;
    
    // Points for saving money
    if (savingsGoal > 0 && newBalance >= 0) {
      monthScore += 10; // Base points for meeting savings goal
      monthScore += Math.min(Math.floor(savingsGoal / 500), 10); // Up to 10 bonus points based on savings amount
    }
    
    // Points for maintaining good mood and productivity
    monthScore += Math.floor(mood / 20); // Up to 5 points for mood
    monthScore += Math.floor(productivity / 20); // Up to 5 points for productivity
    
    // Penalty for debt
    if (newDebt > 0) {
      monthScore -= Math.min(Math.floor(newDebt / 1000), 10); // Up to -10 points for debt
    }
    
    // Update total score
    setScore(prev => prev + Math.max(monthScore, 0)); // Ensure score doesn't go negative
    
    // Random chance for emergency event (30% chance)
    if (Math.random() < 0.3 && currentMonth < 6) {
      const randomEmergency = emergencyEvents[Math.floor(Math.random() * emergencyEvents.length)];
      setCurrentEmergency(randomEmergency);
    }
    
    // Advance to next month or complete game
    if (currentMonth < 6) {
      setCurrentMonth(prev => prev + 1);
      
      // Mood and productivity recovery (if below 100)
      if (mood < 100) {
        setMood(prev => Math.min(100, prev + 10));
      }
      
      if (productivity < 100) {
        setProductivity(prev => Math.min(100, prev + 10));
      }
    } else {
      handleGameComplete();
    }
  };
  
  const openBudgetModal = () => {
    setShowBudgetModal(true);
  };
  
  const startGame = () => {
    setScore(0);
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setScore(0);
    setTimeLeft(600);
    setBalance(5000);
    setSavings(0);
    setDebt(0);
    setMood(100);
    setProductivity(100);
    setCurrentMonth(1);
    setGameCompleted(false);
    setGameStarted(true);
  };
  
  const handleGameComplete = async () => {
    if (gameCompleted) return;
    
    setGameCompleted(true);
    setLoading(true);
    
    try {
      // Calculate time played in seconds
      const timePlayed = 600 - timeLeft;
      
      // Calculate final financial health score
      const totalAssets = balance + savings;
      const netWorth = totalAssets - debt;
      const finalBonus = Math.max(0, Math.floor(netWorth / 1000)); // Bonus points based on net worth
      
      // Update final score
      setScore(prev => prev + finalBonus);
      
      // Send game completion data to backend
      const response = await api.post(`/api/game/complete-game/budget-hero`, {
        score: score + finalBonus, // Include the final bonus
        timePlayed
      });
      
      toast.success(response.data.message || 'Game completed successfully!');
    } catch (error) {
      console.error('Error completing game:', error);
      toast.error('Failed to save game progress');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100 p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-5xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/student/games')} 
          className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Games</span>
        </button>
      </div>
      
      {/* Game container */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Game header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Wallet size={32} />
              <h1 className="text-2xl font-bold">Budget Hero</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Trophy size={18} />
                <span>{score} pts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Timer size={18} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game content */}
        <div className="p-6 md:p-8">
          {!gameStarted ? (
            // Game intro screen
            <div className="text-center py-8">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Wallet size={80} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Budget Hero</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Learn how to manage your monthly budget as a college student, balancing expenses, savings, and unexpected events!
                </p>
              </motion.div>
              
              <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-green-800 mb-2">How to Play:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Manage your monthly budget over 6 months</li>
                  <li>• Balance essential expenses with discretionary spending</li>
                  <li>• Take on part-time jobs to increase your income</li>
                  <li>• Save money for future goals</li>
                  <li>• Handle unexpected emergencies</li>
                  <li>• Maintain your mood and productivity</li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Game
              </motion.button>
            </div>
          ) : gameCompleted ? (
            // Game completion screen
            <div className="text-center py-8">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="relative">
                  <Wallet size={80} className="mx-auto text-green-500 mb-4" />
                  <Sparkles size={24} className="absolute top-0 right-1/3 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Budget Mastery Complete!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Congratulations on completing your 6-month budgeting journey! Let's see how your finances turned out.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Trophy size={24} className="mx-auto text-green-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Final Score</p>
                  <p className="text-2xl font-bold text-green-600">{score}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <DollarSign size={24} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Net Worth</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(balance + savings - debt)}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Coins size={24} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">+40 HC</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cash Balance:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(balance)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Savings:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(savings)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Debt:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(debt)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Net Worth:</span>
                        <span className="font-bold text-gray-800">{formatCurrency(balance + savings - debt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Life Balance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Mood</span>
                        <span className="text-sm font-medium text-gray-700">{mood}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${mood > 70 ? 'bg-green-500' : mood > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${mood}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Productivity</span>
                        <span className="text-sm font-medium text-gray-700">{productivity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${productivity > 70 ? 'bg-green-500' : productivity > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${productivity}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {score >= 100 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3"
                >
                  <Award size={30} className="text-green-500" />
                  <div className="text-left">
                    <p className="font-semibold text-green-800">Achievement Unlocked!</p>
                    <p className="text-gray-700">Budget Wizard: Score 100+ points in Budget Hero</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="bg-green-100 text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-200 transition-all"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/student/games')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Back to Games
                </motion.button>
              </div>
            </div>
          ) : currentEmergency ? (
            // Emergency event screen
            <div className="py-4">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{currentEmergency.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Emergency: {currentEmergency.title}</h2>
                    <p className="text-gray-700 mb-4">{currentEmergency.description}</p>
                    <p className="font-medium text-red-700 mb-6">Cost: {formatCurrency(currentEmergency.cost)}</p>
                    
                    <h3 className="font-semibold text-gray-800 mb-3">How will you handle this?</h3>
                    <div className="space-y-3">
                      {currentEmergency.choices.map(choice => (
                        <motion.button
                          key={choice.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEmergencyChoice(choice)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium text-gray-800">{choice.text}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {choice.impact.savings ? `Impact: ${formatCurrency(choice.impact.savings)} from savings` : ''}
                            {choice.impact.debt ? `Impact: ${formatCurrency(choice.impact.debt)} added to debt` : ''}
                            {choice.impact.moodPenalty ? `Impact: -${choice.impact.moodPenalty} mood` : ''}
                            {choice.impact.productivityPenalty ? `Impact: -${choice.impact.productivityPenalty} productivity` : ''}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="bg-yellow-50 rounded-xl p-4 max-w-2xl mx-auto">
                <h3 className="font-medium text-yellow-800 mb-1">Financial Tip:</h3>
                <p className="text-sm text-gray-700">
                  Emergencies happen to everyone. Having an emergency fund (3-6 months of expenses) can help you avoid going into debt when unexpected costs arise.
                </p>
              </div>
            </div>
          ) : (
            // Active game screen - Budget management
            <div>
              {/* Game progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span className="text-xl font-bold text-gray-800">Month {currentMonth}/6</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-gray-800">{formatCurrency(balance)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-gray-800">{formatCurrency(savings)}</span>
                    </div>
                    {debt > 0 && (
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-red-600">-{formatCurrency(debt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(currentMonth / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Life balance indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-500">Mood</span>
                    <span className="text-sm font-medium text-gray-700">{mood}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${mood > 70 ? 'bg-green-500' : mood > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${mood}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-500">Productivity</span>
                    <span className="text-sm font-medium text-gray-700">{productivity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${productivity > 70 ? 'bg-green-500' : productivity > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${productivity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Monthly budget summary */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-green-800">Monthly Budget</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openBudgetModal}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Set Savings Goal
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-700">Income</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(monthlyBudget.income)}</p>
                    {selectedJob && (
                      <p className="text-xs text-gray-500 mt-1">
                        Includes {formatCurrency(partTimeJobs.find(job => job.id === selectedJob).income)} from part-time job
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-gray-700">Expenses</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(monthlyBudget.expenses)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedExpenses.length} items selected
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Coins className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-700">Monthly Savings</span>
                    </div>
                    <p className={`text-xl font-bold ${monthlyBudget.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyBudget.savings)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Goal: {formatCurrency(savingsGoal)} per month
                    </p>
                  </div>
                </div>
                
                {monthlyBudget.savings < 0 && (
                  <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Your expenses exceed your income. Reduce expenses or increase income to balance your budget.</span>
                  </div>
                )}
                
                {monthlyBudget.savings < savingsGoal && monthlyBudget.savings >= 0 && (
                  <div className="mt-4 bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Your current savings ({formatCurrency(monthlyBudget.savings)}) are below your monthly goal ({formatCurrency(savingsGoal)}).</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Expenses */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Essential Expenses */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Essential Expenses</h3>
                    <div className="space-y-2">
                      {monthlyExpenses.map(expense => (
                        <div 
                          key={expense.id}
                          className="bg-white rounded-lg p-3 shadow-sm flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{expense.icon}</span>
                            <div>
                              <p className="font-medium text-gray-800">{expense.name}</p>
                              <p className="text-xs text-gray-500">{expense.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-800">{formatCurrency(expense.amount)}</span>
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Discretionary Expenses */}
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">Discretionary Expenses</h3>
                    <div className="space-y-2">
                      {discretionaryExpenses.map(expense => (
                        <motion.div 
                          key={expense.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => toggleExpense(expense.id)}
                          className="bg-white rounded-lg p-3 shadow-sm flex justify-between items-center cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{expense.icon}</span>
                            <div>
                              <p className="font-medium text-gray-800">{expense.name}</p>
                              <p className="text-xs text-gray-500">{expense.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-800">{formatCurrency(expense.amount)}</span>
                            <div className={`w-5 h-5 ${selectedExpenses.includes(expense.id) ? 'bg-purple-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                              {selectedExpenses.includes(expense.id) ? (
                                <CheckCircle className="w-4 h-4 text-purple-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Part-time Jobs */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Part-Time Jobs
                  </h3>
                  
                  <div className="space-y-3">
                    {partTimeJobs.map(job => (
                      <motion.div 
                        key={job.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => selectJob(job.id)}
                        className={`${selectedJob === job.id ? 'bg-green-100 border-green-300' : 'bg-white'} border rounded-lg p-3 shadow-sm cursor-pointer transition-colors`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{job.icon}</span>
                            <span className="font-medium text-gray-800">{job.name}</span>
                          </div>
                          {selectedJob === job.id && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-gray-600">{job.hoursPerWeek} hrs/week</span>
                          <span className="font-semibold text-green-600">+{formatCurrency(job.income)}/month</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">
                      {selectedJob ? (
                        <span>Working {partTimeJobs.find(job => job.id === selectedJob).hoursPerWeek} hours per week may affect your mood and productivity.</span>
                      ) : (
                        <span>Select a part-time job to increase your monthly income.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={advanceMonth}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {currentMonth < 6 ? 'Advance to Next Month' : 'Complete Budget Journey'}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {showModal && modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  {modalContent.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  modalContent.type === 'success' ? 'text-green-600' :
                  modalContent.type === 'warning' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {modalContent.title}
                </h3>
                <p className="text-gray-700 mb-6">{modalContent.message}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Budget Modal */}
      <AnimatePresence>
        {showBudgetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBudgetModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Set Monthly Savings Goal</h3>
              
              <p className="text-gray-600 mb-4">
                How much would you like to save each month? Your current monthly surplus is {formatCurrency(monthlyBudget.savings)}.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Savings Goal</label>
                <input 
                  type="number" 
                  min="0"
                  step="100"
                  defaultValue={savingsGoal}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  id="savings-goal-input"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBudgetModal(false)}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const input = document.getElementById('savings-goal-input');
                    const amount = parseInt(input.value, 10);
                    if (!isNaN(amount) && amount >= 0) {
                      setSavingsGoal(amount);
                      setShowBudgetModal(false);
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}