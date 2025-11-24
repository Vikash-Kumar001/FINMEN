// File: ExamStory.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, BookOpenCheck, Check, X, Mic, Trophy, Stethoscope, School, Timer, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameDataById } from '../../../../utils/getGameData';

const ExamStoryy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-65";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, completed

  const levels = [
    {
      id: 1,
      story: "Kid is nervous before test. What helps?",
      choices: ["Practice + calm breathing", "Worry more", "Skip test"],
      correct: "Practice + calm breathing",
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      story: "Before speech, feeling scared. Best?",
      choices: ["Rehearse and relax", "Avoid it", "Panic"],
      correct: "Rehearse and relax",
      icon: <Mic className="w-8 h-8" />,
      color: "bg-purple-500"
    },
    {
      id: 3,
      story: "Competition day, anxious. How to calm?",
      choices: ["Visualize success + breathe", "Think failure", "Quit"],
      correct: "Visualize success + breathe",
      icon: <Trophy className="w-8 h-8" />,
      color: "bg-yellow-500"
    },
    {
      id: 4,
      story: "Doctor visit, nervous. What to do?",
      choices: ["Talk about fears + breathe deep", "Hide", "Cry"],
      correct: "Talk about fears + breathe deep",
      icon: <Stethoscope className="w-8 h-8" />,
      color: "bg-green-500"
    },
    {
      id: 5,
      story: "New school, worried. Best action?",
      choices: ["Make friends + stay calm", "Stay alone", "Complain"],
      correct: "Make friends + stay calm",
      icon: <School className="w-8 h-8" />,
      color: "bg-pink-500"
    }
  ];

  const currentLevelData = levels[currentLevel - 1];

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0 && !isSubmitted && gameState === 'playing') {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive && !isSubmitted) {
      // Time's up
      setIsSubmitted(true);
      setFeedbackType("wrong");
      setFeedbackMessage("Time's up! Better luck next time.");
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          setSelectedChoice(null);
          setIsSubmitted(false);
          setTimeLeft(20);
        } else {
          setGameState('completed');
          setLevelCompleted(true);
        }
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive, isSubmitted, currentLevel, gameState]);

  const handleChoiceSelect = (choice) => {
    if (!isSubmitted) {
      setSelectedChoice(choice);
    }
  };

  const handleSubmit = () => {
    if (selectedChoice && !isSubmitted) {
      setIsSubmitted(true);
      setIsTimerActive(false);
      
      if (selectedChoice === currentLevelData.correct) {
        setFeedbackType("correct");
        setFeedbackMessage("Excellent! That helps. +10 points");
        setScore(prev => prev + 10 + streak * 2);
        setStreak(streak + 1);
        setBestStreak(Math.max(bestStreak, streak + 1));
        setShowFeedback(true);
        
        setTimeout(() => {
          setShowFeedback(false);
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setSelectedChoice(null);
            setIsSubmitted(false);
            setTimeLeft(20);
            setIsTimerActive(true);
          } else {
            setGameState('completed');
            setLevelCompleted(true);
          }
        }, 2500);
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("Not the best. Try again. Streak reset!");
        setStreak(0);
        setShowFeedback(true);
        
        setTimeout(() => {
          setShowFeedback(false);
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setSelectedChoice(null);
            setIsSubmitted(false);
            setTimeLeft(20);
            setIsTimerActive(true);
          } else {
            setGameState('completed');
            setLevelCompleted(true);
          }
        }, 2500);
      }
    } else if (!selectedChoice) {
      setFeedbackType("wrong");
      setFeedbackMessage("Select a choice!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setSelectedChoice(null);
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(20);
    setIsTimerActive(true);
    setGameState('playing');
    setLevelCompleted(false);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Exam Story Challenge"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-65"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Exam Story Challenge</h3>
        
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 mb-4 bg-white/10 backdrop-blur-sm"
          >
            {/* Timer and stats */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                <Timer className={`w-4 h-4 mr-1 ${timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} />
                <span className={`font-bold ${timeLeft < 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
              </div>
              <div className="flex space-x-2">
                <div className="bg-blue-500/20 rounded-full px-2 py-1">
                  <span className="text-xs text-blue-300">Streak: {streak}x</span>
                </div>
                <div className="bg-purple-500/20 rounded-full px-2 py-1">
                  <span className="text-xs text-purple-300">Best: {bestStreak}x</span>
                </div>
              </div>
            </div>
            
            {/* Story and icon */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <div className={`${currentLevelData.color} p-3 rounded-full inline-block`}>
                  {currentLevelData.icon}
                </div>
              </div>
              <p className="text-white/90 font-medium mb-2">Scenario {currentLevel}/5</p>
              <p className="text-white/80 mb-4">{currentLevelData.story}</p>
            </div>
            
            {/* Choices */}
            <div className="space-y-3 mb-6">
              {currentLevelData.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoiceSelect(choice)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedChoice === choice 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {selectedChoice === choice ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-white/50"></div>
                      )}
                    </div>
                    <span>{choice}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Submit button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!selectedChoice || isSubmitted}
                className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg flex items-center justify-center mx-auto ${
                  selectedChoice && !isSubmitted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                    : 'bg-white/20 text-white/50 cursor-not-allowed'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Submit Answer
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="mb-4">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Challenge Complete!</h3>
            <p className="text-white/80 mb-6">You've mastered exam confidence strategies!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-4xl font-bold text-yellow-300 mb-2">{score} Points</div>
              <div className="text-xl font-bold text-white mb-4">Exam Confidence Master</div>
              <p className="text-white/90">
                {score >= 80 ? "🏆 Exam Champion!" : 
                 score >= 60 ? "🥇 Confident Student!" : 
                 score >= 40 ? "🥈 Good Effort!" : 
                 "🥉 Keep Practicing!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-300">{5}</div>
                <div className="text-xs text-white/70">Scenarios</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-300">{bestStreak}x</div>
                <div className="text-xs text-white/70">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-300">{score}</div>
                <div className="text-xs text-white/70">Points</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Play Again
              </button>
              <button
                onClick={handleGameComplete}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <FeedbackBubble 
                message={feedbackMessage}
                type={feedbackType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </GameCard>
    </GameShell>
  );
};

export default ExamStoryy;