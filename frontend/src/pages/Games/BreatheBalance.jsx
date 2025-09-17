import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, ArrowLeft, Timer, Trophy, Sparkles, Coins, Award, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

export default function BreatheBalance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [breathCount, setBreathCount] = useState(0);
  const [focusScore, setFocusScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 }); // % of container
  const [userPosition, setUserPosition] = useState({ x: 50, y: 50 }); // % of container
  const [isFollowing, setIsFollowing] = useState(true);
  const containerRef = useRef(null);
  
  // Timer for the game
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
  
  // Breathing cycle
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    
    let breathTimer;
    
    if (breathPhase === 'inhale') {
      breathTimer = setTimeout(() => {
        setBreathPhase('hold');
      }, 4000); // 4 seconds inhale
    } else if (breathPhase === 'hold') {
      breathTimer = setTimeout(() => {
        setBreathPhase('exhale');
      }, 2000); // 2 seconds hold
    } else if (breathPhase === 'exhale') {
      breathTimer = setTimeout(() => {
        setBreathPhase('rest');
      }, 4000); // 4 seconds exhale
    } else if (breathPhase === 'rest') {
      breathTimer = setTimeout(() => {
        setBreathPhase('inhale');
        setBreathCount(prev => prev + 1);
        // Add points for completing a breath cycle
        setFocusScore(prev => prev + 5);
      }, 1000); // 1 second rest
    }
    
    return () => clearTimeout(breathTimer);
  }, [breathPhase, gameStarted, gameCompleted]);
  
  // Circle movement
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    
    const moveInterval = setInterval(() => {
      // Random new position for the circle
      const newX = Math.random() * 80 + 10; // Keep within 10-90% of container
      const newY = Math.random() * 80 + 10;
      setCirclePosition({ x: newX, y: newY });
      
      // Every 5 seconds, check if user is following and update score
      const distance = Math.sqrt(
        Math.pow(userPosition.x - circlePosition.x, 2) + 
        Math.pow(userPosition.y - circlePosition.y, 2)
      );
      
      if (distance < 15) { // If user is close to the circle
        setFocusScore(prev => prev + 2);
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    }, 3000); // Move every 3 seconds
    
    return () => clearInterval(moveInterval);
  }, [gameStarted, gameCompleted, userPosition, circlePosition]);
  
  const handleMouseMove = (e) => {
    if (!containerRef.current || !gameStarted || gameCompleted) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setUserPosition({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  };
  
  const handleTouchMove = (e) => {
    if (!containerRef.current || !gameStarted || gameCompleted) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setUserPosition({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setBreathPhase('inhale');
    setBreathCount(0);
    setFocusScore(0);
    setTimeLeft(180);
    setGameCompleted(false);
    setGameStarted(true);
    setCirclePosition({ x: 50, y: 50 });
    setUserPosition({ x: 50, y: 50 });
  };
  
  const handleGameComplete = async () => {
    if (gameCompleted) return;
    
    setGameCompleted(true);
    setLoading(true);
    
    try {
      // Calculate time played in seconds
      const timePlayed = 180 - timeLeft;
      
      // Send game completion data to backend
      const response = await api.post(`/api/game/complete-game/breathe-balance`, {
        score: focusScore,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100 p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/student/games')} 
          className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Games</span>
        </button>
      </div>
      
      {/* Game container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Game header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Wind size={32} />
              <h1 className="text-2xl font-bold">Breathe & Balance</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Trophy size={18} />
                <span>{focusScore} pts</span>
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
                <Wind size={80} className="mx-auto text-teal-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Breathe & Balance</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  An interactive breathing and focus game to encourage mindfulness and reduce stress.
                </p>
              </motion.div>
              
              <div className="bg-teal-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-teal-800 mb-2">How to Play:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>• Follow the breathing pattern (inhale, hold, exhale, rest)</li>
                  <li>• Move your cursor to follow the floating circle</li>
                  <li>• Earn points for each breath cycle and for maintaining focus</li>
                  <li>• Complete the 3-minute session to earn HealCoins</li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Session Complete!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Great job with your mindful breathing! You've earned rewards for your wellness journey.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-teal-50 rounded-xl p-4 text-center">
                  <Trophy size={24} className="mx-auto text-teal-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Focus Score</p>
                  <p className="text-2xl font-bold text-teal-600">{focusScore}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Wind size={24} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Breath Cycles</p>
                  <p className="text-2xl font-bold text-blue-600">{breathCount}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Coins size={24} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-700 font-semibold">Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">+30 HC</p>
                </div>
              </div>
              
              {focusScore >= 60 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3"
                >
                  <Award size={30} className="text-teal-500" />
                  <div className="text-left">
                    <p className="font-semibold text-teal-800">Achievement Unlocked!</p>
                    <p className="text-gray-700">Zen Master: Complete Breathe & Balance with 60+ focus points</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="bg-teal-100 text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-200 transition-all"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/student/games')}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <span>Breath cycles: {breathCount}</span>
                  <span>{formatTime(timeLeft)} remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${(timeLeft / 180) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Breathing visualization */}
              <div className="mb-8 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={breathPhase}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <p className="text-xl font-medium text-teal-700 mb-2">
                      {breathPhase === 'inhale' && 'Inhale deeply...'}
                      {breathPhase === 'hold' && 'Hold your breath...'}
                      {breathPhase === 'exhale' && 'Exhale slowly...'}
                      {breathPhase === 'rest' && 'Rest...'}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <motion.div
                  animate={{
                    scale: breathPhase === 'inhale' ? 1.5 : 
                           breathPhase === 'hold' ? 1.5 : 
                           breathPhase === 'exhale' ? 1 : 1
                  }}
                  transition={{ duration: breathPhase === 'inhale' || breathPhase === 'exhale' ? 4 : 1 }}
                  className="w-32 h-32 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mx-auto flex items-center justify-center text-white"
                >
                  <Wind size={40} />
                </motion.div>
              </div>
              
              {/* Focus game */}
              <div 
                ref={containerRef}
                className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-6"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                <p className="absolute top-2 left-2 text-sm font-medium text-gray-500">
                  Follow the circle with your cursor to maintain focus
                </p>
                
                {/* Target circle */}
                <motion.div
                  animate={{ 
                    x: `${circlePosition.x}%`, 
                    y: `${circlePosition.y}%`,
                    backgroundColor: isFollowing ? '#4ade80' : '#f87171'
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    left: '-24px', 
                    top: '-24px',
                  }}
                >
                  <Circle size={24} className="text-white" />
                </motion.div>
                
                {/* User cursor visualization */}
                <motion.div
                  animate={{ 
                    x: `${userPosition.x}%`, 
                    y: `${userPosition.y}%` 
                  }}
                  className="absolute w-8 h-8 bg-blue-500 rounded-full opacity-70"
                  style={{ 
                    left: '-16px', 
                    top: '-16px',
                  }}
                />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Focus Score: <span className="font-semibold text-teal-600">{focusScore}</span>
                </p>
                <button
                  onClick={handleGameComplete}
                  className="bg-teal-100 text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-200 transition-all"
                >
                  End Session Early
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}