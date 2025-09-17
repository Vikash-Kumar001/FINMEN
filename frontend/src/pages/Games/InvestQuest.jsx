import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowLeft, Timer, Trophy, Sparkles, Coins, Award, BarChart4, DollarSign, LineChart, PieChart, Info, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

// Game data
const investmentOptions = [
  {
    id: 'savings',
    name: 'Savings Account',
    description: 'A safe place to keep your money with a small amount of interest.',
    risk: 'Very Low',
    returnRange: '2-4%',
    liquidityPeriod: 'Immediate',
    minInvestment: 100,
    icon: '🏦',
    color: 'blue',
    scenarios: [
      { year: 1, returnRate: 0.03, event: null },
      { year: 2, returnRate: 0.035, event: null },
      { year: 3, returnRate: 0.04, event: null },
      { year: 4, returnRate: 0.035, event: null },
      { year: 5, returnRate: 0.03, event: null },
    ]
  },
  {
    id: 'fixedDeposit',
    name: 'Fixed Deposit',
    description: 'Lock your money for a fixed period to earn higher interest.',
    risk: 'Low',
    returnRange: '5-7%',
    liquidityPeriod: '1-5 years',
    minInvestment: 500,
    icon: '🔒',
    color: 'green',
    scenarios: [
      { year: 1, returnRate: 0.06, event: null },
      { year: 2, returnRate: 0.065, event: null },
      { year: 3, returnRate: 0.07, event: null },
      { year: 4, returnRate: 0.065, event: null },
      { year: 5, returnRate: 0.06, event: null },
    ]
  },
  {
    id: 'mutualFund',
    name: 'Mutual Fund',
    description: 'A professionally managed investment fund that pools money from many investors.',
    risk: 'Medium',
    returnRange: '8-12%',
    liquidityPeriod: 'Variable',
    minInvestment: 1000,
    icon: '📊',
    color: 'purple',
    scenarios: [
      { year: 1, returnRate: 0.10, event: null },
      { year: 2, returnRate: 0.12, event: 'Market growth boosted returns!' },
      { year: 3, returnRate: 0.09, event: 'Market volatility reduced returns.' },
      { year: 4, returnRate: 0.11, event: null },
      { year: 5, returnRate: 0.10, event: null },
    ]
  },
  {
    id: 'stocks',
    name: 'Stocks',
    description: 'Buy shares of individual companies to own a piece of the business.',
    risk: 'High',
    returnRange: '10-15%',
    liquidityPeriod: 'Immediate (volatile)',
    minInvestment: 2000,
    icon: '📈',
    color: 'red',
    scenarios: [
      { year: 1, returnRate: 0.15, event: null },
      { year: 2, returnRate: -0.05, event: 'Market crash! Your investment lost value.' },
      { year: 3, returnRate: 0.20, event: 'Market recovery! Strong gains this year.' },
      { year: 4, returnRate: 0.12, event: null },
      { year: 5, returnRate: 0.10, event: null },
    ]
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Digital or virtual currency that uses cryptography for security.',
    risk: 'Very High',
    returnRange: '-20% to +50%',
    liquidityPeriod: 'Immediate (highly volatile)',
    minInvestment: 500,
    icon: '₿',
    color: 'orange',
    scenarios: [
      { year: 1, returnRate: 0.40, event: 'Crypto boom! Your investment grew significantly.' },
      { year: 2, returnRate: -0.30, event: 'Crypto crash! Your investment lost significant value.' },
      { year: 3, returnRate: 0.25, event: 'Partial recovery in the crypto market.' },
      { year: 4, returnRate: 0.15, event: null },
      { year: 5, returnRate: -0.10, event: 'Regulatory concerns impacted crypto values.' },
    ]
  },
  {
    id: 'sip',
    name: 'Systematic Investment Plan (SIP)',
    description: 'Invest a fixed amount regularly in mutual funds, benefiting from rupee cost averaging.',
    risk: 'Medium',
    returnRange: '10-14%',
    liquidityPeriod: 'After 3-5 years',
    minInvestment: 500,
    icon: '🔄',
    color: 'teal',
    scenarios: [
      { year: 1, returnRate: 0.11, event: null },
      { year: 2, returnRate: 0.12, event: null },
      { year: 3, returnRate: 0.13, event: 'Consistent investments paying off!' },
      { year: 4, returnRate: 0.14, event: null },
      { year: 5, returnRate: 0.12, event: null },
    ]
  },
];

const marketEvents = [
  {
    id: 1,
    title: 'Economic Recession',
    description: 'A significant decline in economic activity that lasts for months or years.',
    impact: {
      savings: -0.01,
      fixedDeposit: -0.02,
      mutualFund: -0.15,
      stocks: -0.25,
      crypto: -0.40,
      sip: -0.10,
    },
    advice: 'During recessions, safer investments like savings accounts and fixed deposits are less affected. High-risk investments may see significant losses.'
  },
  {
    id: 2,
    title: 'Interest Rate Hike',
    description: 'Central bank increases interest rates to control inflation.',
    impact: {
      savings: 0.01,
      fixedDeposit: 0.02,
      mutualFund: -0.05,
      stocks: -0.08,
      crypto: -0.10,
      sip: -0.03,
    },
    advice: 'When interest rates rise, savings accounts and fixed deposits benefit, while stocks and other investments may initially decline.'
  },
  {
    id: 3,
    title: 'Tech Boom',
    description: 'Rapid growth in the technology sector drives market gains.',
    impact: {
      savings: 0,
      fixedDeposit: 0,
      mutualFund: 0.10,
      stocks: 0.20,
      crypto: 0.30,
      sip: 0.08,
    },
    advice: 'During sector-specific booms, related stocks and funds can see significant gains, but remember that booms can be followed by corrections.'
  },
  {
    id: 4,
    title: 'Global Pandemic',
    description: 'Worldwide health crisis affecting markets and economies.',
    impact: {
      savings: 0,
      fixedDeposit: -0.01,
      mutualFund: -0.20,
      stocks: -0.30,
      crypto: -0.25,
      sip: -0.15,
    },
    advice: 'Major global events can cause market panic. Diversification helps protect your portfolio during unexpected crises.'
  },
  {
    id: 5,
    title: 'Economic Recovery',
    description: 'Economy rebounds after a period of decline.',
    impact: {
      savings: 0,
      fixedDeposit: 0.01,
      mutualFund: 0.15,
      stocks: 0.25,
      crypto: 0.20,
      sip: 0.12,
    },
    advice: 'Economic recoveries often benefit growth-oriented investments like stocks and mutual funds more than conservative options.'
  },
];

export default function InvestQuest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentYear, setCurrentYear] = useState(1);
  const [initialInvestment, setInitialInvestment] = useState(5000);
  const [portfolio, setPortfolio] = useState({});
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(5000);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [score, setScore] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState(null);
  
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
      setPortfolio({});
      setPortfolioHistory([{ year: 0, totalValue: initialInvestment, allocation: {} }]);
      setAvailableFunds(initialInvestment);
      setCurrentYear(1);
      setCurrentEvent(null);
    }
  }, [gameStarted, gameCompleted, initialInvestment]);
  
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
  
  const calculatePortfolioValue = () => {
    let total = 0;
    Object.entries(portfolio).forEach(([id, amount]) => {
      total += amount;
    });
    return total + availableFunds;
  };
  
  const invest = (option, amount) => {
    if (amount <= 0) {
      setModalContent({
        type: 'warning',
        title: 'Invalid Amount',
        message: 'Please enter a positive investment amount.',
        icon: <AlertCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    if (amount > availableFunds) {
      setModalContent({
        type: 'warning',
        title: 'Insufficient Funds',
        message: `You only have ${formatCurrency(availableFunds)} available to invest.`,
        icon: <AlertCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    if (amount < option.minInvestment) {
      setModalContent({
        type: 'warning',
        title: 'Minimum Investment',
        message: `The minimum investment for ${option.name} is ${formatCurrency(option.minInvestment)}.`,
        icon: <AlertCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    // Update portfolio
    setPortfolio(prev => ({
      ...prev,
      [option.id]: (prev[option.id] || 0) + amount
    }));
    
    // Update available funds
    setAvailableFunds(prev => prev - amount);
    
    // Show success modal
    setModalContent({
      type: 'success',
      title: 'Investment Made',
      message: `You've invested ${formatCurrency(amount)} in ${option.name}.`,
      icon: <Trophy className="w-12 h-12 text-green-500" />
    });
    setShowModal(true);
  };
  
  const showInvestmentInfo = (option) => {
    setInfoContent(option);
    setShowInfoModal(true);
  };
  
  const advanceYear = () => {
    if (Object.keys(portfolio).length === 0) {
      setModalContent({
        type: 'warning',
        title: 'No Investments',
        message: 'You need to make at least one investment before advancing to the next year.',
        icon: <AlertCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    // Randomly decide if a market event occurs (30% chance)
    let event = null;
    if (Math.random() < 0.3) {
      event = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      setCurrentEvent(event);
    } else {
      setCurrentEvent(null);
    }
    
    // Calculate returns for each investment
    const newPortfolio = { ...portfolio };
    let yearlyReturns = 0;
    
    Object.entries(portfolio).forEach(([id, amount]) => {
      const option = investmentOptions.find(opt => opt.id === id);
      const scenarioData = option.scenarios[currentYear - 1];
      
      // Base return rate from scenario
      let returnRate = scenarioData.returnRate;
      
      // Apply market event impact if any
      if (event) {
        returnRate += event.impact[id] || 0;
      }
      
      // Calculate return amount
      const returnAmount = amount * returnRate;
      yearlyReturns += returnAmount;
      
      // Update portfolio value
      newPortfolio[id] = amount + returnAmount;
    });
    
    // Update portfolio
    setPortfolio(newPortfolio);
    
    // Add to portfolio history
    const totalValue = calculatePortfolioValue() + yearlyReturns;
    setPortfolioHistory(prev => [...prev, {
      year: currentYear,
      totalValue,
      allocation: { ...newPortfolio },
      returns: yearlyReturns,
      event: event ? event.title : null
    }]);
    
    // Update score based on returns
    const returnPercentage = yearlyReturns / calculatePortfolioValue();
    let yearScore = Math.round(returnPercentage * 100) * 2; // 2 points per percentage return
    
    // Bonus points for diversification
    const diversificationBonus = Math.min(Object.keys(portfolio).length * 5, 20); // Up to 20 points
    yearScore += diversificationBonus;
    
    setScore(prev => prev + Math.max(yearScore, 0)); // Ensure score doesn't go negative
    
    // Advance to next year or complete game
    if (currentYear < 5) {
      setCurrentYear(prev => prev + 1);
    } else {
      handleGameComplete();
    }
  };
  
  const startGame = () => {
    setScore(0);
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setScore(0);
    setTimeLeft(600);
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
      
      // Calculate final portfolio value
      const finalValue = calculatePortfolioValue();
      const growthPercentage = ((finalValue - initialInvestment) / initialInvestment) * 100;
      
      // Add bonus points for final portfolio value
      const finalBonus = Math.round(growthPercentage);
      setScore(prev => prev + finalBonus);
      
      // Send game completion data to backend
      const response = await api.post(`/api/game/complete-game/invest-quest`, {
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-5xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/student/games')} 
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Games</span>
        </button>
      </div>
      
      {/* Game container */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Game header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <TrendingUp size={32} />
              <h1 className="text-2xl font-bold">Invest Quest</h1>
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
                <TrendingUp size={80} className="mx-auto text-indigo-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Invest Quest</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Learn how to invest wisely by building a diversified portfolio and navigating market events!
                </p>
              </motion.div>
              
              <div className="bg-indigo-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-indigo-800 mb-2">How to Play:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Start with {formatCurrency(initialInvestment)} to invest</li>
                  <li>• Choose from different investment options</li>
                  <li>• Navigate through 5 years of market changes</li>
                  <li>• Respond to random market events</li>
                  <li>• Aim for the highest portfolio value and score</li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <TrendingUp size={80} className="mx-auto text-indigo-500 mb-4" />
                  <Sparkles size={24} className="absolute top-0 right-1/3 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Investment Journey Complete!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Congratulations on completing your 5-year investment journey! Let's see how your portfolio performed.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <Trophy size={24} className="mx-auto text-indigo-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Final Score</p>
                  <p className="text-2xl font-bold text-indigo-600">{score}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <BarChart4 size={24} className="mx-auto text-green-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Final Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculatePortfolioValue())}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Coins size={24} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">+40 HC</p>
                </div>
              </div>
              
              {/* Portfolio growth chart */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Investment Journey</h3>
                <div className="h-60 w-full">
                  {/* Simple chart visualization */}
                  <div className="h-full w-full flex items-end justify-between">
                    {portfolioHistory.map((data, index) => {
                      const height = `${Math.min((data.totalValue / (initialInvestment * 2)) * 100, 100)}%`;
                      const growth = index > 0 ? data.totalValue - portfolioHistory[index - 1].totalValue : 0;
                      const isPositive = growth >= 0;
                      
                      return (
                        <div key={index} className="flex flex-col items-center w-1/6">
                          <div className="relative w-full flex justify-center mb-2">
                            <div 
                              className={`w-10 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ height }}
                            ></div>
                            {data.event && (
                              <div className="absolute -top-2 right-0">
                                <AlertCircle size={16} className="text-red-500" />
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-medium">
                            Year {data.year}
                          </div>
                          <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{formatCurrency(growth)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {score >= 100 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3"
                >
                  <Award size={30} className="text-indigo-500" />
                  <div className="text-left">
                    <p className="font-semibold text-indigo-800">Achievement Unlocked!</p>
                    <p className="text-gray-700">Investment Guru: Score 100+ points in Invest Quest</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="bg-indigo-100 text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-200 transition-all"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/student/games')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Back to Games
                </motion.button>
              </div>
            </div>
          ) : (
            // Active game screen
            <div>
              {/* Game progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Year</span>
                    <span className="text-xl font-bold text-gray-800">{currentYear}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-xl font-bold text-gray-800">
                      {formatCurrency(calculatePortfolioValue())}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${(currentYear / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Market event alert */}
              {currentEvent && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-1">Market Event: {currentEvent.title}</h3>
                      <p className="text-sm text-gray-700 mb-2">{currentEvent.description}</p>
                      <p className="text-sm font-medium text-red-700">This event has affected your investments!</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Portfolio Summary */}
                <div className="lg:col-span-1 bg-indigo-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Your Portfolio
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-bold text-gray-800">{formatCurrency(calculatePortfolioValue())}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Initial Investment:</span>
                      <span className="text-gray-800">{formatCurrency(initialInvestment)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Available Cash:</span>
                      <span className="text-gray-800">{formatCurrency(availableFunds)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth:</span>
                      <span className={`font-semibold ${calculatePortfolioValue() >= initialInvestment ? 'text-green-600' : 'text-red-600'}`}>
                        {calculatePortfolioValue() >= initialInvestment ? '+' : ''}
                        {formatCurrency(calculatePortfolioValue() - initialInvestment)}
                        {' '}
                        ({Math.round(((calculatePortfolioValue() - initialInvestment) / initialInvestment) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-700 mb-2">Current Investments:</h4>
                  {Object.keys(portfolio).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No investments yet</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(portfolio).map(([id, amount]) => {
                        const option = investmentOptions.find(opt => opt.id === id);
                        return (
                          <div key={id} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{option.icon}</span>
                                <span className="font-medium text-gray-800">{option.name}</span>
                              </div>
                              <span className="font-semibold text-gray-800">{formatCurrency(amount)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={advanceYear}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Advance to Year {currentYear + 1}
                    </motion.button>
                  </div>
                </div>
                
                {/* Investment Options */}
                <div className="lg:col-span-2 bg-purple-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Investment Options
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investmentOptions.map(option => (
                      <motion.div 
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-white rounded-lg p-4 shadow-sm border-l-4 border-${option.color}-500`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-800">{option.name}</h4>
                              <div className="flex items-center gap-1 text-xs">
                                <span className={`px-2 py-0.5 rounded-full bg-${option.color === 'red' ? 'red' : option.color === 'orange' ? 'orange' : option.color}-100 text-${option.color === 'red' ? 'red' : option.color === 'orange' ? 'orange' : option.color}-600`}>
                                  {option.risk} Risk
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  Return: {option.returnRange}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => showInvestmentInfo(option)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Info size={18} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {option.description}
                        </p>
                        
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Amount ({formatCurrency(option.minInvestment)} min)</label>
                            <input 
                              type="number" 
                              min={option.minInvestment}
                              max={availableFunds}
                              step={100}
                              defaultValue={option.minInvestment}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              id={`amount-${option.id}`}
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const input = document.getElementById(`amount-${option.id}`);
                              const amount = parseInt(input.value, 10);
                              invest(option, amount);
                            }}
                            disabled={availableFunds < option.minInvestment}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${availableFunds >= option.minInvestment ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`}
                          >
                            Invest
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Learning tip */}
              <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                <h3 className="font-medium text-yellow-800 mb-1">Investment Tip:</h3>
                <p className="text-sm text-gray-700">
                  Diversification is key to managing risk. Spread your investments across different asset classes to protect against market volatility. Remember that higher returns typically come with higher risks.
                </p>
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
      
      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && infoContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <span className="text-3xl mb-2 block">{infoContent.icon}</span>
                <h3 className="text-xl font-bold text-gray-800">{infoContent.name}</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">{infoContent.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Risk Level</p>
                    <p className="font-semibold text-gray-800">{infoContent.risk}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Expected Returns</p>
                    <p className="font-semibold text-gray-800">{infoContent.returnRange}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Liquidity Period</p>
                    <p className="font-semibold text-gray-800">{infoContent.liquidityPeriod}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Minimum Investment</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(infoContent.minInvestment)}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Investment Strategy:</p>
                  <p className="text-sm text-gray-700">
                    {infoContent.id === 'savings' && 'Best for emergency funds and short-term goals. Very safe but offers minimal returns.'}
                    {infoContent.id === 'fixedDeposit' && 'Good for medium-term goals with guaranteed returns. Higher interest than savings but less liquidity.'}
                    {infoContent.id === 'mutualFund' && 'Professional management with diversification. Good balance of risk and return for medium to long-term goals.'}
                    {infoContent.id === 'stocks' && 'Higher potential returns but with significant risk. Best for long-term goals and investors comfortable with volatility.'}
                    {infoContent.id === 'crypto' && 'Extremely volatile with potential for high returns or significant losses. Only invest what you can afford to lose.'}
                    {infoContent.id === 'sip' && 'Disciplined approach to investing with rupee cost averaging. Good for long-term wealth creation with moderate risk.'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfoModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}