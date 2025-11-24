// File: MemoryKidBadge.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Award, Check, X, Zap, Target, Star, Trophy, RotateCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameDataById } from '../../../../utils/getGameData';

const MemoryKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-50";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameState, setGameState] = useState('intro'); // intro, playing, task, completed
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = [
    { 
      id: 1, 
      title: "Memory Match Challenge", 
      description: "Match all pairs before time runs out!",
      icon: <Target className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    { 
      id: 2, 
      title: "Quick Quiz", 
      description: "Answer 3 brain questions correctly!",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-green-500"
    },
    { 
      id: 3, 
      title: "Sequence Recall", 
      description: "Remember the pattern sequence!",
      icon: <Star className="w-8 h-8" />,
      color: "bg-purple-500"
    },
    { 
      id: 4, 
      title: "Memory Journal", 
      description: "Write 3 things you remember!",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-yellow-500"
    },
    { 
      id: 5, 
      title: "Poster Creator", 
      description: "Design your memory poster!",
      icon: <Award className="w-8 h-8" />,
      color: "bg-pink-500"
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // Time's up
      setIsTimerActive(false);
      setFeedbackType("wrong");
      setFeedbackMessage("Time's up! Try again.");
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        resetTask();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  const startGame = () => {
    setGameState('playing');
    setProgress(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCurrentLevel(1);
  };

  const startTask = (task) => {
    setSelectedTask(task);
    setGameState('task');
    setIsSubmitted(false);
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  // Simulate mini-game completion
  const handleCompleteTask = () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    setIsTimerActive(false);
    setProgress(prev => prev + 1);
    
    const points = 10 + streak * 2;
    setScore(prev => prev + points);
    setStreak(streak + 1);
    setBestStreak(Math.max(bestStreak, streak + 1));
    
    setFeedbackType("correct");
    setFeedbackMessage(`Task completed! +${points} points`);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentLevel < 5) {
        setCurrentLevel(prev => prev + 1);
        setGameState('playing');
      } else {
        setGameState('completed');
        setLevelCompleted(true);
      }
    }, 2500);
  };

  const resetTask = () => {
    setGameState('playing');
    setIsSubmitted(false);
    setTimeLeft(30);
    setIsTimerActive(false);
    setStreak(0);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  const getProgressColor = () => {
    const percentage = (progress / 5) * 100;
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 60) return 'bg-yellow-500';
    if (percentage < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <GameShell
      title="Memory Kid Challenge"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-50"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Memory Kid Challenge</h3>
        
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Become a Memory Master!</h4>
            <p className="text-white/80 mb-6">Complete 5 exciting memory challenges to earn your badge</p>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Progress</span>
                <span className="text-white/80">{progress}/5</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${(progress/5) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-blue-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-300">{score}</div>
                <div className="text-xs text-white/70">Points</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-green-300">{bestStreak}x</div>
                <div className="text-xs text-white/70">Best Streak</div>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-full font-bold transition duration-200 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 shadow-lg flex items-center justify-center mx-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Challenge
            </button>
          </motion.div>
        )}
        
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4 mb-4 bg-white/10 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-white">Level {currentLevel}</h4>
              <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                <Award className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm font-bold text-yellow-300">{progress}/5</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mb-4">
              {tasks.slice(0, currentLevel).map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startTask(task)}
                  className={`${task.color} rounded-xl p-4 text-white cursor-pointer shadow-md hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">{task.icon}</div>
                    <div>
                      <h5 className="font-bold">{task.title}</h5>
                      <p className="text-sm opacity-90">{task.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="text-white/70">Points: {score}</div>
              <div className="text-white/70">Streak: {streak}x</div>
            </div>
          </motion.div>
        )}
        
        {gameState === 'task' && selectedTask && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl p-6 mb-4 bg-white/10 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className={`mr-3 ${selectedTask.color} p-2 rounded-lg`}>
                  {selectedTask.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedTask.title}</h4>
                  <p className="text-white/80 text-sm">{selectedTask.description}</p>
                </div>
              </div>
              <div className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                {timeLeft}s
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="text-center text-white mb-2">
                {currentLevel === 1 && "Match the pairs to improve your memory!"}
                {currentLevel === 2 && "Quick! Answer the brain questions correctly!"}
                {currentLevel === 3 && "Watch the pattern and repeat it!"}
                {currentLevel === 4 && "Write down 3 things you remember from today!"}
                {currentLevel === 5 && "Create your own memory poster with fun facts!"}
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full ${i < progress ? 'bg-green-500' : 'bg-white/20'}`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="text-center mb-4">
              <button
                onClick={handleCompleteTask}
                disabled={isSubmitted}
                className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg flex items-center justify-center mx-auto ${
                  !isSubmitted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                    : 'bg-white/20 text-white/50 cursor-not-allowed'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Completed!
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Complete Task
                  </>
                )}
              </button>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={resetTask}
                className="flex items-center text-white/70 hover:text-white text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Back
              </button>
              <div className="text-sm text-white/70">
                Streak: {streak}x
              </div>
            </div>
          </motion.div>
        )}
        
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold text-white mb-2">Memory Master!</h4>
            <p className="text-white/80 mb-4">You've earned the Memory Kid Badge!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-4 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{score} Points</div>
              <div className="text-xl font-bold text-white mb-4">Memory Kid Badge Earned!</div>
              <p className="text-white/90">
                {score >= 80 ? "🏆 Memory Champion!" : 
                 score >= 60 ? "🥇 Super Rememberer!" : 
                 score >= 40 ? "🥈 Good Memory!" : 
                 "🥉 Keep Practicing!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-300">{progress}</div>
                <div className="text-xs text-white/70">Tasks</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-green-300">{bestStreak}x</div>
                <div className="text-xs text-white/70">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-purple-300">{score}</div>
                <div className="text-xs text-white/70">Points</div>
              </div>
            </div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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

export default MemoryKidBadge;