import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { Ear, VolumeX, Brain, Coffee } from 'lucide-react';

const ReflexAttention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentAction, setCurrentAction] = useState(null);
  const [streak, setStreak] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track total correct answers

  const actions = [
    { id: 1, text: 'Listen', type: 'good', icon: <Ear className="w-6 h-6" /> },
    { id: 2, text: 'Distract', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 3, text: 'Focus', type: 'good', icon: <Brain className="w-6 h-6" /> },
    { id: 4, text: 'Daydream', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 5, text: 'Pay Attention', type: 'good', icon: <Ear className="w-6 h-6" /> },
    { id: 6, text: 'Chat with Friends', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 7, text: 'Concentrate', type: 'good', icon: <Brain className="w-6 h-6" /> },
    { id: 8, text: 'Fidget', type: 'bad', icon: <Coffee className="w-6 h-6" /> }
  ];

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

  // Generate new action
  useEffect(() => {
    if (gameState === 'active') {
      const actionTimer = setTimeout(() => {
        if (timeLeft > 0) {
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          setCurrentAction(randomAction);
        }
      }, 1000);
      return () => clearTimeout(actionTimer);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('active');
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setTotalCorrect(0);
    setLevelCompleted(false);
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setCurrentAction(randomAction);
  };

  const handleActionTap = (actionType) => {
    if (!currentAction || gameState !== 'active') return;

    const isCorrect = actionType === 'good';
    
    if (isCorrect) {
      const points = 1 + Math.min(streak, 5); // More points for longer streaks
      setScore(Math.min(score + points, 100)); // Cap score at 100
      setStreak(streak + 1);
      setTotalCorrect(totalCorrect + 1); // Track correct answers
    } else {
      setStreak(0);
    }

    // Generate next action
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setCurrentAction(randomAction);
  };

  const handleNext = () => {
    navigate('/games/brain-health/kids');
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  // Calculate coins based on correct answers (max 15 coins)
  const calculateTotalCoins = () => {
    return Math.min(totalCorrect * 0.5, 15); // 0.5 coins per correct answer, max 15
  };

  return (
    <GameShell
      title="Attention Reflex"
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-13"
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
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Attention Reflex</h3>
        
        {gameState === 'waiting' && (
          <div 
            className="text-center cursor-pointer p-8 rounded-xl bg-white/10 hover:bg-white/20 transition duration-200"
            onClick={startGame}
          >
            <h4 className="text-xl font-semibold mb-4 text-white">Boost Your Attention!</h4>
            <p className="mb-6 text-white/80">Tap quickly for attention-boosting actions, avoid distracting ones</p>
            <div className="text-2xl font-bold text-blue-400 mb-4">Tap to Start</div>
            <p className="text-sm text-white/60">You'll have 30 seconds to get as many points as possible</p>
          </div>
        )}
        
        {gameState === 'active' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-bold text-white">Score: {score}</div>
              <div className="text-lg font-bold text-red-400">{timeLeft}s</div>
              <div className="text-lg font-bold text-green-400">Streak: {streak}</div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-white/80 mb-4">Tap if it helps your attention!</p>
              {currentAction ? (
                <div className="inline-block p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <div className="text-white">
                    {currentAction.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{currentAction.text}</div>
                </div>
              ) : (
                <div className="text-white/60">Get ready...</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleActionTap('good')}
                className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition duration-200 flex flex-col items-center"
              >
                <Ear className="w-8 h-8 mb-2" />
                <span className="font-bold">Helps Attention!</span>
              </button>
              
              <button
                onClick={() => handleActionTap('bad')}
                className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-xl transition duration-200 flex flex-col items-center"
              >
                <VolumeX className="w-8 h-8 mb-2" />
                <span className="font-bold">Distracting!</span>
              </button>
            </div>
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="text-center p-8">
            <h4 className="text-xl font-bold mb-4 text-white">Game Complete!</h4>
            <div className="text-4xl font-bold text-blue-400 mb-6">{score} Points</div>
            <p className="text-white/80 mb-6">
              {score >= 70 ? 'Great job! Your attention reflexes are sharp! 🎉' : 
               score >= 40 ? 'Good effort! Keep practicing to improve! 💪' : 
               'Keep practicing to boost your attention skills! 🌱'}
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

export default ReflexAttention;