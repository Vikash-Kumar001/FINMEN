import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { Zap, Coffee, Brain, Target } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const ReflexQuickAttention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-19";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showTarget, setShowTarget] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track total correct answers
  const startTimeRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'active') {
      setGameState('finished');
      setLevelCompleted(true);
    }
  }, [gameState, timeLeft]);

  // Random target appearance
  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      const targetTimer = setTimeout(() => {
        if (!showTarget) {
          setShowTarget(true);
          startTimeRef.current = Date.now();
          
          // Hide target after random time if not tapped
          setTimeout(() => {
            if (showTarget) {
              setShowTarget(false);
              setStreak(0);
            }
          }, 2000);
        }
      }, Math.random() * 3000 + 1000);
      return () => clearTimeout(targetTimer);
    }
  }, [gameState, timeLeft, showTarget]);

  const startGame = () => {
    setGameState('active');
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setShowTarget(false);
    setReactionTime(null);
    setTotalCorrect(0);
    setLevelCompleted(false);
  };

  const handleTargetTap = () => {
    if (showTarget && gameState === 'active') {
      const reaction = Date.now() - startTimeRef.current;
      setReactionTime(reaction);
      
      // Points based on reaction time (faster = more points)
      const points = Math.max(1, Math.floor(2000 / reaction));
      setScore(Math.min(score + points, 100)); // Cap score at 100
      setStreak(streak + 1);
      setTotalCorrect(totalCorrect + 1); // Track correct answers
      
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
      
      setShowTarget(false);
    }
  };

  const handleMiss = () => {
    if (gameState === 'active' && !showTarget) {
      setStreak(0);
    }
  };

  const handleNext = () => {
    navigate('/games/brain-health/kids');
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  // Calculate coins based on correct answers (1 coin per correct answer)
  const calculateTotalCoins = () => {
    return Math.min(totalCorrect * 0.3, 15); // 0.3 coins per correct answer, max 15
  };

  return (
    <GameShell
      title="Quick Attention Reflex"
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-19"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={levelCompleted}
      nextLabel="Complete"
      backPath="/games/brain-health/kids"
    
      maxScore={1} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Attention Reflex</h3>
        
        {gameState === 'waiting' && (
          <div 
            className="text-center cursor-pointer p-8 rounded-xl bg-white/10 hover:bg-white/20 transition duration-200"
            onClick={startGame}
          >
            <h4 className="text-xl font-semibold mb-4 text-white">Test Your Attention!</h4>
            <p className="mb-6 text-white/80">Tap quickly when the target appears</p>
            <div className="text-2xl font-bold text-blue-400 mb-4">Tap to Start</div>
            <p className="text-sm text-white/60">You'll have 30 seconds to get as many points as possible</p>
          </div>
        )}
        
        {gameState === 'active' && (
          <div 
            className="p-6 h-96 flex flex-col cursor-pointer"
            onClick={handleMiss}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-bold text-white">Score: {score}</div>
              <div className="text-lg font-bold text-red-400">{timeLeft}s</div>
              <div className="text-lg font-bold text-green-400">Streak: {streak}</div>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              {showTarget ? (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTargetTap();
                  }}
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150"
                >
                  <Target className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="text-white/60 text-center">
                  <p>Wait for the target...</p>
                  <p className="text-sm mt-2">Tap when it appears!</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="text-center p-8">
            <h4 className="text-xl font-bold mb-4 text-white">Game Complete!</h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-sm text-white/70">Base Score</div>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{bestStreak}</div>
                <div className="text-sm text-white/70">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{Math.min(score + (bestStreak * 5), 100)}</div>
                <div className="text-sm text-white/70">Total Score</div>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              {score >= 70 ? 'Excellent attention skills! 🎉' : 
               score >= 40 ? 'Good job! Keep practicing! 💪' : 
               'Keep practicing to improve your attention! 🌱'}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-200"
              >
                Play Again
              </button>
              
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition duration-200"
              >
                Finish Game
              </button>
            </div>
          </div>
        )}
      </GameCard>
    </GameShell>
  );
};

export default ReflexQuickAttention;