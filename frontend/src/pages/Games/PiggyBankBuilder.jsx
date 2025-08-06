import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, ArrowLeft, Timer, Trophy, Sparkles, Coins, Award, Home, ShoppingBag, DollarSign, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// Game data
const householdTasks = [
  { id: 1, task: 'Clean your room', reward: 5, time: 10, difficulty: 'easy' },
  { id: 2, task: 'Help with dishes', reward: 3, time: 8, difficulty: 'easy' },
  { id: 3, task: 'Take out trash', reward: 2, time: 5, difficulty: 'easy' },
  { id: 4, task: 'Make your bed', reward: 1, time: 3, difficulty: 'easy' },
  { id: 5, task: 'Help with laundry', reward: 4, time: 12, difficulty: 'medium' },
  { id: 6, task: 'Water the plants', reward: 2, time: 6, difficulty: 'easy' },
  { id: 7, task: 'Vacuum the floor', reward: 5, time: 15, difficulty: 'medium' },
  { id: 8, task: 'Help with cooking', reward: 6, time: 20, difficulty: 'medium' },
  { id: 9, task: 'Organize bookshelf', reward: 4, time: 15, difficulty: 'medium' },
  { id: 10, task: 'Clean bathroom', reward: 7, time: 18, difficulty: 'hard' },
];

const spendingTraps = [
  { id: 1, item: 'Candy bar', cost: 2, necessity: false },
  { id: 2, item: 'Video game', cost: 15, necessity: false },
  { id: 3, item: 'Toy', cost: 10, necessity: false },
  { id: 4, item: 'School supplies', cost: 5, necessity: true },
  { id: 5, item: 'Movie ticket', cost: 8, necessity: false },
  { id: 6, item: 'Lunch', cost: 6, necessity: true },
  { id: 7, item: 'Comic book', cost: 4, necessity: false },
  { id: 8, item: 'Bus fare', cost: 2, necessity: true },
  { id: 9, item: 'Ice cream', cost: 3, necessity: false },
  { id: 10, item: 'New shoes', cost: 20, necessity: true },
];

export default function PiggyBankBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [piggyBank, setPiggyBank] = useState(0);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentSpendingTraps, setCurrentSpendingTraps] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [score, setScore] = useState(0);
  
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
      resetDay();
    }
  }, [gameStarted, gameCompleted]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const resetDay = () => {
    // Randomly select 4 tasks for the day
    const shuffledTasks = [...householdTasks].sort(() => 0.5 - Math.random());
    setAvailableTasks(shuffledTasks.slice(0, 4));
    
    // Randomly select 3 spending traps for the day
    const shuffledTraps = [...spendingTraps].sort(() => 0.5 - Math.random());
    setCurrentSpendingTraps(shuffledTraps.slice(0, 3));
    
    setCompletedTasks([]);
  };
  
  const completeTask = (task) => {
    // Add coins to piggy bank
    setPiggyBank(prev => prev + task.reward);
    setScore(prev => prev + task.reward * 2); // Score is double the coins
    
    // Move task from available to completed
    setAvailableTasks(prev => prev.filter(t => t.id !== task.id));
    setCompletedTasks(prev => [...prev, task]);
    
    // Show success modal
    setModalContent({
      type: 'success',
      title: 'Task Completed!',
      message: `You earned ${task.reward} coins for completing "${task.task}"!`,
      icon: <Trophy className="w-12 h-12 text-yellow-500" />
    });
    setShowModal(true);
  };
  
  const handleSpendingTrap = (trap, avoid) => {
    if (avoid) {
      // User avoided the trap
      setScore(prev => prev + 5); // Bonus points for avoiding traps
      
      // Show success modal
      setModalContent({
        type: 'success',
        title: 'Smart Choice!',
        message: `You saved your money by avoiding ${trap.item}. +5 bonus points!`,
        icon: <Award className="w-12 h-12 text-green-500" />
      });
    } else {
      // User fell for the trap
      const newBalance = Math.max(0, piggyBank - trap.cost);
      setPiggyBank(newBalance);
      
      // Show feedback modal
      if (trap.necessity) {
        setModalContent({
          type: 'info',
          title: 'Necessary Purchase',
          message: `You spent ${trap.cost} coins on ${trap.item}. This was a necessary expense.`,
          icon: <ShoppingBag className="w-12 h-12 text-blue-500" />
        });
      } else {
        setModalContent({
          type: 'warning',
          title: 'Spending Trap!',
          message: `You spent ${trap.cost} coins on ${trap.item}. Was this a need or a want?`,
          icon: <Trash2 className="w-12 h-12 text-red-500" />
        });
      }
    }
    
    // Remove the trap from current list
    setCurrentSpendingTraps(prev => prev.filter(t => t.id !== trap.id));
    setShowModal(true);
  };
  
  const advanceDay = () => {
    if (currentDay < 7) {
      setCurrentDay(prev => prev + 1);
      resetDay();
    } else {
      handleGameComplete();
    }
  };
  
  const startGame = () => {
    setPiggyBank(0);
    setCurrentDay(1);
    setScore(0);
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setPiggyBank(0);
    setCurrentDay(1);
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
      const response = await api.post(`/api/game/complete-game/piggy-bank-builder`, {
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/student/games')} 
          className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Games</span>
        </button>
      </div>
      
      {/* Game container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Game header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <PiggyBank size={32} />
              <h1 className="text-2xl font-bold">Piggy Bank Builder</h1>
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
                <PiggyBank size={80} className="mx-auto text-pink-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Piggy Bank Builder</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Learn how to save money by completing household tasks and avoiding spending traps!
                </p>
              </motion.div>
              
              <div className="bg-pink-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-pink-800 mb-2">How to Play:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Complete household tasks to earn coins</li>
                  <li>• Avoid unnecessary spending traps</li>
                  <li>• Save as many coins as possible over 7 days</li>
                  <li>• Learn the difference between needs and wants</li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <PiggyBank size={80} className="mx-auto text-pink-500 mb-4" />
                  <Sparkles size={24} className="absolute top-0 right-1/3 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Saving Complete!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Great job building your savings! You've learned valuable lessons about earning and saving money.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <Trophy size={24} className="mx-auto text-pink-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Final Score</p>
                  <p className="text-2xl font-bold text-pink-600">{score}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <PiggyBank size={24} className="mx-auto text-purple-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Saved</p>
                  <p className="text-2xl font-bold text-purple-600">{piggyBank} coins</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Coins size={24} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">+35 HC</p>
                </div>
              </div>
              
              {piggyBank >= 30 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3"
                >
                  <Award size={30} className="text-pink-500" />
                  <div className="text-left">
                    <p className="font-semibold text-pink-800">Achievement Unlocked!</p>
                    <p className="text-gray-700">Money Saver: Save 30+ coins in Piggy Bank Builder</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="bg-pink-100 text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-pink-200 transition-all"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/student/games')}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                    <span className="text-sm font-medium text-gray-500">Day</span>
                    <span className="text-xl font-bold text-gray-800">{currentDay}/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-pink-500" />
                    <span className="text-xl font-bold text-gray-800">{piggyBank} coins</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-pink-600 h-2.5 rounded-full" 
                    style={{ width: `${(currentDay / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Household Tasks */}
                <div className="bg-pink-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Household Tasks
                  </h3>
                  
                  {availableTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">All tasks completed for today!</p>
                  ) : (
                    <div className="space-y-3">
                      {availableTasks.map(task => (
                        <motion.div 
                          key={task.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">{task.task}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Timer className="w-3 h-3" />
                                  {task.time} mins
                                </span>
                                <span className="flex items-center gap-1">
                                  <Coins className="w-3 h-3" />
                                  {task.reward} coins
                                </span>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => completeTask(task)}
                              className="bg-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                            >
                              Complete
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {completedTasks.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Completed:</h4>
                      <div className="space-y-2">
                        {completedTasks.map(task => (
                          <div key={task.id} className="bg-white/50 rounded-lg p-2 text-sm text-gray-500 flex justify-between items-center">
                            <span>{task.task}</span>
                            <span className="flex items-center gap-1">
                              <Coins className="w-3 h-3 text-yellow-500" />
                              {task.reward}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Spending Traps */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Spending Decisions
                  </h3>
                  
                  {currentSpendingTraps.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No more spending decisions today!</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={advanceDay}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        Next Day
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentSpendingTraps.map(trap => (
                        <motion.div 
                          key={trap.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">{trap.item}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Cost: {trap.cost} coins
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSpendingTrap(trap, false)}
                                className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                              >
                                Buy
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSpendingTrap(trap, true)}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                              >
                                Skip
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Learning tip */}
              <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                <h3 className="font-medium text-yellow-800 mb-1">Saving Tip:</h3>
                <p className="text-sm text-gray-700">
                  Remember to think about needs vs. wants when spending money. Needs are things you must have to live, like food and shelter. Wants are things that are nice to have but not necessary.
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