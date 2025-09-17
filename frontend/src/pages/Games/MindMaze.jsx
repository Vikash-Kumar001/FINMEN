import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Trophy, Timer, ArrowLeft, Sparkles, Coins, Award, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

// Puzzle data
const puzzles = [
  {
    id: 1,
    question: 'When you feel stressed, what helps you calm down?',
    options: [
      { id: 'a', text: 'Taking deep breaths', isCorrect: true },
      { id: 'b', text: 'Scrolling social media', isCorrect: false },
      { id: 'c', text: 'Eating junk food', isCorrect: false },
      { id: 'd', text: 'Ignoring the feeling', isCorrect: false },
    ],
    explanation: 'Deep breathing activates your parasympathetic nervous system, which helps reduce stress hormones.'
  },
  {
    id: 2,
    question: 'Which of these is a healthy way to express sadness?',
    options: [
      { id: 'a', text: 'Keeping it to yourself', isCorrect: false },
      { id: 'b', text: 'Talking to someone you trust', isCorrect: true },
      { id: 'c', text: 'Pretending to be happy', isCorrect: false },
      { id: 'd', text: 'Avoiding people', isCorrect: false },
    ],
    explanation: 'Sharing your feelings with trusted people helps process emotions and gain support.'
  },
  {
    id: 3,
    question: 'What is mindfulness?',
    options: [
      { id: 'a', text: 'Thinking about the future', isCorrect: false },
      { id: 'b', text: 'Multitasking efficiently', isCorrect: false },
      { id: 'c', text: 'Being aware of the present moment', isCorrect: true },
      { id: 'd', text: 'Avoiding difficult thoughts', isCorrect: false },
    ],
    explanation: 'Mindfulness is the practice of paying attention to the present moment without judgment.'
  },
  {
    id: 4,
    question: 'Which activity can help improve your mood?',
    options: [
      { id: 'a', text: 'Physical exercise', isCorrect: true },
      { id: 'b', text: 'Staying indoors all day', isCorrect: false },
      { id: 'c', text: 'Skipping meals', isCorrect: false },
      { id: 'd', text: 'Staying up late', isCorrect: false },
    ],
    explanation: 'Exercise releases endorphins, which are natural mood boosters.'
  },
  {
    id: 5,
    question: 'What is emotional intelligence?',
    options: [
      { id: 'a', text: 'Never showing emotions', isCorrect: false },
      { id: 'b', text: 'Being able to recognize and manage emotions', isCorrect: true },
      { id: 'c', text: 'Always being happy', isCorrect: false },
      { id: 'd', text: 'Avoiding emotional situations', isCorrect: false },
    ],
    explanation: 'Emotional intelligence involves recognizing, understanding, and managing your emotions and empathizing with others.'
  },
];

export default function MindMaze() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(option.id);
    setIsCorrect(option.isCorrect);
    
    if (option.isCorrect) {
      setScore(prev => prev + 20); // 20 points per correct answer
    }
    
    setShowExplanation(true);
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowExplanation(false);
      } else {
        handleGameComplete();
      }
    }, 2000);
  };
  
  // Add a state to store the earned coins
  const [earnedCoins, setEarnedCoins] = useState(0);
  
  const handleGameComplete = async () => {
    if (gameCompleted) return;
    
    setGameCompleted(true);
    setLoading(true);
    
    try {
      // Calculate time played in seconds
      const timePlayed = 300 - timeLeft;
      
      // Send game completion data to backend
      const response = await api.post(`/api/game/complete-game/mind-maze`, {
        score,
        timePlayed
      });
      
      // Store the actual earned coins from the response
      setEarnedCoins(response.data.coinsEarned);
      
      toast.success(response.data.message || 'Game completed successfully!');
    } catch (error) {
      console.error('Error completing game:', error);
      toast.error('Failed to save game progress');
    } finally {
      setLoading(false);
    }
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setCurrentPuzzleIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setScore(0);
    setTimeLeft(300);
    setGameCompleted(false);
    setGameStarted(true);
  };
  
  const currentPuzzle = puzzles[currentPuzzleIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/student/games')} 
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Games</span>
        </button>
      </div>
      
      {/* Game container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Game header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Brain size={32} />
              <h1 className="text-2xl font-bold">Mind Maze</h1>
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
                <Brain size={80} className="mx-auto text-indigo-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Mind Maze</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Solve emotion-based riddles and self-reflection challenges to reduce stress and improve your mental wellness.
                </p>
              </motion.div>
              
              <div className="bg-indigo-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-indigo-800 mb-2">How to Play:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Answer 5 mindfulness and emotional intelligence questions</li>
                  <li>• Each correct answer earns you 20 points</li>
                  <li>• Complete the game within 5 minutes</li>
                  <li>• Earn HealCoins and achievements based on your performance</li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <Trophy size={80} className="mx-auto text-yellow-500 mb-4" />
                  <Sparkles size={24} className="absolute top-0 right-1/3 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Completed!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Great job navigating the Mind Maze! You've earned rewards for your mental wellness journey.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <Trophy size={24} className="mx-auto text-indigo-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Score</p>
                  <p className="text-2xl font-bold text-indigo-600">{score}/100</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Timer size={24} className="mx-auto text-green-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Time</p>
                  <p className="text-2xl font-bold text-green-600">{formatTime(300 - timeLeft)}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Coins size={24} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">+{earnedCoins} HC</p>
                </div>
              </div>
              
              {score >= 80 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3"
                >
                  <Award size={30} className="text-purple-500" />
                  <div className="text-left">
                    <p className="font-semibold text-purple-800">Achievement Unlocked!</p>
                    <p className="text-gray-700">Mind Explorer: Complete Mind Maze with 80+ points</p>
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
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Back to Games
                </motion.button>
              </div>
            </div>
          ) : (
            // Active game screen
            <div>
              {/* Progress indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Question {currentPuzzleIndex + 1} of {puzzles.length}</span>
                  <span>{formatTime(timeLeft)} remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${((currentPuzzleIndex) / puzzles.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentPuzzle.question}</h3>
                
                {/* Options */}
                <div className="grid grid-cols-1 gap-3">
                  {currentPuzzle.options.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-xl text-left transition-all ${selectedOption === option.id
                        ? option.isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-red-100 border-2 border-red-500'
                        : 'bg-white border-2 border-gray-200 hover:border-indigo-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.text}</span>
                        {selectedOption === option.id && (
                          option.isCorrect ? 
                            <Check size={20} className="text-green-500" /> : 
                            <X size={20} className="text-red-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Explanation */}
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                >
                  <p className="font-medium">{currentPuzzle.explanation}</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}