import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Timer, Trophy, Sparkles, Coins, Award, Tag, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

// Game data
const shopItems = [
  // Needs
  { id: 1, name: 'Sandwich', category: 'Food', price: 5, type: 'need', image: '🥪' },
  { id: 2, name: 'Notebook', category: 'School', price: 3, type: 'need', image: '📓' },
  { id: 3, name: 'Water Bottle', category: 'Food', price: 2, type: 'need', image: '💧' },
  { id: 4, name: 'Pencils', category: 'School', price: 2, type: 'need', image: '✏️' },
  { id: 5, name: 'Fruit', category: 'Food', price: 3, type: 'need', image: '🍎' },
  { id: 6, name: 'Toothbrush', category: 'Health', price: 4, type: 'need', image: '🪥' },
  { id: 7, name: 'Socks', category: 'Clothing', price: 4, type: 'need', image: '🧦' },
  { id: 8, name: 'Umbrella', category: 'Weather', price: 6, type: 'need', image: '☂️' },
  { id: 9, name: 'Milk', category: 'Food', price: 3, type: 'need', image: '🥛' },
  { id: 10, name: 'Soap', category: 'Health', price: 2, type: 'need', image: '🧼' },
  
  // Wants
  { id: 11, name: 'Toy Car', category: 'Toys', price: 8, type: 'want', image: '🚗' },
  { id: 12, name: 'Video Game', category: 'Entertainment', price: 15, type: 'want', image: '🎮' },
  { id: 13, name: 'Candy', category: 'Snacks', price: 2, type: 'want', image: '🍬' },
  { id: 14, name: 'Comic Book', category: 'Entertainment', price: 5, type: 'want', image: '📚' },
  { id: 15, name: 'Stickers', category: 'Fun', price: 3, type: 'want', image: '🏷️' },
  { id: 16, name: 'Fancy Pen', category: 'School', price: 6, type: 'want', image: '🖊️' },
  { id: 17, name: 'Ice Cream', category: 'Snacks', price: 4, type: 'want', image: '🍦' },
  { id: 18, name: 'Sunglasses', category: 'Accessories', price: 7, type: 'want', image: '🕶️' },
  { id: 19, name: 'Toy Robot', category: 'Toys', price: 12, type: 'want', image: '🤖' },
  { id: 20, name: 'Bracelet', category: 'Accessories', price: 5, type: 'want', image: '💎' },
];

const scenarios = [
  {
    id: 1,
    title: 'School Shopping',
    description: 'You need to buy supplies for school. You have 15 coins to spend.',
    budget: 15,
    requiredCategories: ['School'],
    minItems: 3,
  },
  {
    id: 2,
    title: 'Lunch Break',
    description: 'You need to buy food for lunch. You have 10 coins to spend.',
    budget: 10,
    requiredCategories: ['Food'],
    minItems: 2,
  },
  {
    id: 3,
    title: 'Weekend Fun',
    description: 'You can buy some fun items, but make sure to save some money. You have 20 coins to spend.',
    budget: 20,
    requiredCategories: [],
    minItems: 2,
    maxSpend: 15, // Should save at least 5 coins
  },
  {
    id: 4,
    title: 'Health First',
    description: 'You need to buy health items. You have 12 coins to spend.',
    budget: 12,
    requiredCategories: ['Health'],
    minItems: 2,
  },
  {
    id: 5,
    title: 'Rainy Day',
    description: 'It\'s raining and you need appropriate items. You have 18 coins to spend.',
    budget: 18,
    requiredCategories: ['Weather', 'Clothing'],
    minItems: 2,
  },
];

export default function ShopSmart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [availableItems, setAvailableItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [budget, setBudget] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);
  
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
      startScenario(0);
    }
  }, [gameStarted, gameCompleted]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startScenario = (index) => {
    if (index >= scenarios.length) {
      handleGameComplete();
      return;
    }
    
    const scenario = scenarios[index];
    setCurrentScenario(scenario);
    setScenarioIndex(index);
    setBudget(scenario.budget);
    setCart([]);
    
    // Randomly select items for the scenario
    // Ensure we have some required category items and a mix of needs/wants
    let requiredItems = [];
    let otherItems = [];
    
    if (scenario.requiredCategories && scenario.requiredCategories.length > 0) {
      // Get items from required categories
      requiredItems = shopItems.filter(item => 
        scenario.requiredCategories.includes(item.category)
      );
    }
    
    // Get other random items
    otherItems = shopItems.filter(item => 
      !requiredItems.some(reqItem => reqItem.id === item.id)
    );
    
    // Shuffle and select items
    const shuffledRequired = [...requiredItems].sort(() => 0.5 - Math.random());
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random());
    
    // Take at least 3 required items if available, or all if less than 3
    const selectedRequired = shuffledRequired.slice(0, Math.min(3, shuffledRequired.length));
    
    // Fill the rest with other items, up to 12 total items
    const selectedOthers = shuffledOthers.slice(0, 12 - selectedRequired.length);
    
    // Combine and shuffle again for display
    const selectedItems = [...selectedRequired, ...selectedOthers].sort(() => 0.5 - Math.random());
    
    setAvailableItems(selectedItems);
    setShowFeedback(false);
    setScenarioResult(null);
  };
  
  const addToCart = (item) => {
    // Check if adding this item would exceed the budget
    const currentTotal = cart.reduce((sum, cartItem) => sum + cartItem.price, 0);
    if (currentTotal + item.price > budget) {
      // Show warning modal
      setModalContent({
        type: 'warning',
        title: 'Budget Exceeded',
        message: `Adding ${item.name} would exceed your budget of ${budget} coins.`,
        icon: <XCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    // Add item to cart
    setCart(prev => [...prev, item]);
    
    // Remove item from available items
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
  };
  
  const removeFromCart = (item) => {
    // Remove item from cart
    setCart(prev => prev.filter(i => i.id !== item.id));
    
    // Add item back to available items
    setAvailableItems(prev => [...prev, item].sort((a, b) => a.id - b.id));
  };
  
  const checkoutScenario = () => {
    const scenario = currentScenario;
    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Check if minimum items requirement is met
    if (cart.length < scenario.minItems) {
      setModalContent({
        type: 'warning',
        title: 'Not Enough Items',
        message: `You need to buy at least ${scenario.minItems} items for this scenario.`,
        icon: <XCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    // Check if required categories are included
    if (scenario.requiredCategories && scenario.requiredCategories.length > 0) {
      const cartCategories = cart.map(item => item.category);
      const missingCategories = scenario.requiredCategories.filter(
        category => !cartCategories.includes(category)
      );
      
      if (missingCategories.length > 0) {
        setModalContent({
          type: 'warning',
          title: 'Missing Required Items',
          message: `You need to buy items from these categories: ${missingCategories.join(', ')}.`,
          icon: <XCircle className="w-12 h-12 text-red-500" />
        });
        setShowModal(true);
        return;
      }
    }
    
    // Check if max spend limit is respected
    if (scenario.maxSpend && cartTotal > scenario.maxSpend) {
      setModalContent({
        type: 'warning',
        title: 'Spent Too Much',
        message: `You should spend no more than ${scenario.maxSpend} coins for this scenario.`,
        icon: <XCircle className="w-12 h-12 text-red-500" />
      });
      setShowModal(true);
      return;
    }
    
    // Calculate score for this scenario
    let scenarioScore = 0;
    
    // Base points for completing the scenario
    scenarioScore += 10;
    
    // Points for staying under budget
    const savedAmount = budget - cartTotal;
    scenarioScore += savedAmount > 0 ? Math.min(savedAmount * 2, 10) : 0;
    
    // Points for buying needs vs wants
    const needsCount = cart.filter(item => item.type === 'need').length;
    const wantsCount = cart.filter(item => item.type === 'want').length;
    
    // Bonus points if needs > wants
    if (needsCount > wantsCount) {
      scenarioScore += 5;
    }
    
    // Calculate needs vs wants ratio for feedback
    const needsPercentage = Math.round((needsCount / cart.length) * 100);
    
    // Prepare result for feedback
    const result = {
      success: true,
      score: scenarioScore,
      spent: cartTotal,
      saved: savedAmount,
      needsCount,
      wantsCount,
      needsPercentage,
      feedback: needsPercentage >= 70 ? 
        'Great job prioritizing needs over wants!' : 
        needsPercentage >= 50 ? 
          'Good balance of needs and wants.' : 
          'Try to prioritize needs over wants next time.'
    };
    
    setScenarioResult(result);
    setScore(prev => prev + scenarioScore);
    setShowFeedback(true);
  };
  
  const nextScenario = () => {
    startScenario(scenarioIndex + 1);
  };
  
  const startGame = () => {
    setScore(0);
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setScore(0);
    setTimeLeft(300);
    setGameCompleted(false);
    setGameStarted(true);
  };
  
  const handleGameComplete = async () => {
    if (gameCompleted) return;
    
    setGameCompleted(true);
    setLoading(true);
    
    try {
      // Calculate time played in seconds
      const timePlayed = 300 - timeLeft;
      
      // Send game completion data to backend
      const response = await api.post(`/api/game/complete-game/shop-smart`, {
        score,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-100 p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/student/games')} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Games</span>
        </button>
      </div>
      
      {/* Game container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Game header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart size={32} />
              <h1 className="text-2xl font-bold">Shop Smart!</h1>
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
                <ShoppingCart size={80} className="mx-auto text-blue-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Shop Smart!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Learn how to budget and make smart shopping decisions by distinguishing between needs and wants!
                </p>
              </motion.div>
              
              <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">How to Play:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Complete shopping scenarios with a limited budget</li>
                  <li>• Choose between needs (essential items) and wants (nice-to-have items)</li>
                  <li>• Meet the requirements for each scenario</li>
                  <li>• Try to save money while getting everything you need</li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <ShoppingCart size={80} className="mx-auto text-blue-500 mb-4" />
                  <Sparkles size={24} className="absolute top-0 right-1/3 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Shopping Complete!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Great job making smart shopping decisions! You've learned valuable lessons about budgeting and prioritizing needs vs. wants.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Trophy size={24} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Final Score</p>
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Tag size={24} className="mx-auto text-green-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Scenarios</p>
                  <p className="text-2xl font-bold text-green-600">{scenarios.length}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Coins size={24} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">+35 HC</p>
                </div>
              </div>
              
              {score >= 75 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3"
                >
                  <Award size={30} className="text-blue-500" />
                  <div className="text-left">
                    <p className="font-semibold text-blue-800">Achievement Unlocked!</p>
                    <p className="text-gray-700">Smart Shopper: Score 75+ points in Shop Smart!</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="bg-blue-100 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-200 transition-all"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/student/games')}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Back to Games
                </motion.button>
              </div>
            </div>
          ) : showFeedback && scenarioResult ? (
            // Scenario feedback screen
            <div className="py-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Scenario Complete!</h2>
                <p className="text-gray-600">
                  {scenarioResult.feedback}
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Trophy size={20} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-sm text-gray-700 font-semibold">Points Earned</p>
                  <p className="text-xl font-bold text-blue-600">+{scenarioResult.score}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <DollarSign size={20} className="mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-gray-700 font-semibold">Money Saved</p>
                  <p className="text-xl font-bold text-green-600">{scenarioResult.saved} coins</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <CheckCircle size={20} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-sm text-gray-700 font-semibold">Needs Bought</p>
                  <p className="text-xl font-bold text-yellow-600">{scenarioResult.needsCount}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Tag size={20} className="mx-auto text-purple-500 mb-2" />
                  <p className="text-sm text-gray-700 font-semibold">Wants Bought</p>
                  <p className="text-xl font-bold text-purple-600">{scenarioResult.wantsCount}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Needs vs. Wants Balance</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${scenarioResult.needsPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Needs: {scenarioResult.needsPercentage}%</span>
                  <span>Wants: {100 - scenarioResult.needsPercentage}%</span>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-1">Shopping Tip:</h3>
                <p className="text-sm text-gray-700">
                  {scenarioResult.needsPercentage >= 70 ?
                    "Great job prioritizing needs! Needs are essential items that help us live and function, while wants are things that make life more enjoyable but aren't necessary." :
                    "Remember to prioritize needs over wants when shopping with a limited budget. Needs are essential items that help us live and function, while wants are things that make life more enjoyable but aren't necessary."}
                </p>
              </div>
              
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextScenario}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {scenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Complete Game'}
                </motion.button>
              </div>
            </div>
          ) : (
            // Active game screen - Shopping scenario
            <div>
              {currentScenario && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{currentScenario.title}</h2>
                      <p className="text-gray-600">{currentScenario.description}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-bold text-gray-800">
                        {budget - cart.reduce((sum, item) => sum + item.price, 0)} / {budget}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${((scenarioIndex + 1) / scenarios.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Scenario {scenarioIndex + 1}</span>
                    <span>of {scenarios.length}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Shopping Items */}
                <div className="md:col-span-2 bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Available Items
                  </h3>
                  
                  {availableItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No more items available in this store!</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableItems.map(item => (
                        <motion.div 
                          key={item.id}
                          whileHover={{ scale: 1.03 }}
                          className="bg-white rounded-lg p-3 shadow-sm cursor-pointer"
                          onClick={() => addToCart(item)}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{item.image}</div>
                            <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {item.category}
                              </span>
                              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                                <DollarSign className="w-3 h-3" />
                                {item.price}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Shopping Cart */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Cart
                  </h3>
                  
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Your cart is empty!</p>
                      <p className="text-sm text-gray-600">Click on items to add them to your cart.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
                        {cart.map(item => (
                          <motion.div 
                            key={item.id}
                            className="bg-white rounded-lg p-2 flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.image}</span>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                    {item.category}
                                  </span>
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
                                    {item.type === 'need' ? 'Need' : 'Want'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-semibold">${item.price}</span>
                              <button 
                                onClick={() => removeFromCart(item)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="border-t border-green-200 pt-3 mb-4">
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                          <span>Subtotal:</span>
                          <span>${cart.reduce((sum, item) => sum + item.price, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center font-semibold">
                          <span>Remaining Budget:</span>
                          <span className="text-green-600">
                            ${budget - cart.reduce((sum, item) => sum + item.price, 0)}
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkoutScenario}
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                      >
                        Checkout
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Learning tip */}
              <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                <h3 className="font-medium text-yellow-800 mb-1">Shopping Tip:</h3>
                <p className="text-sm text-gray-700">
                  When shopping with a limited budget, always prioritize your needs (essential items) before your wants (nice-to-have items). This helps you make sure you have everything you need before spending on things you just want.
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
    </div>
  );
}