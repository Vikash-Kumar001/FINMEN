import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Coffee, Heart, Zap, Book, Gamepad2, Users, Moon } from 'lucide-react';

const ReflexMindCheck = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentAction, setCurrentAction] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track total correct answers

  const actions = [
    { id: 1, text: 'Meditate', type: 'good', icon: <Brain className="w-6 h-6" />, explanation: 'Reduces stress and improves emotional regulation' },
    { id: 2, text: 'Chronic Stress', type: 'bad', icon: <Coffee className="w-6 h-6" />, explanation: 'Prolonged stress damages brain cells and impairs memory' },
    { id: 3, text: 'Express Gratitude', type: 'good', icon: <Heart className="w-6 h-6" />, explanation: 'Boosts mood and strengthens neural pathways for positivity' },
    { id: 4, text: 'Ruminate on Negatives', type: 'bad', icon: <Zap className="w-6 h-6" />, explanation: 'Excessive negative thinking increases anxiety and depression risk' },
    { id: 5, text: 'Read for Pleasure', type: 'good', icon: <Book className="w-6 h-6" />, explanation: 'Enhances vocabulary, empathy, and cognitive flexibility' },
    { id: 6, text: 'Social Media Comparison', type: 'bad', icon: <Users className="w-6 h-6" />, explanation: 'Comparing yourself to others reduces self-esteem and happiness' },
    { id: 7, text: 'Get Adequate Sleep', type: 'good', icon: <Moon className="w-6 h-6" />, explanation: 'Essential for memory consolidation and emotional processing' },
    { id: 8, text: 'Play Violent Video Games', type: 'bad', icon: <Gamepad2 className="w-6 h-6" />, explanation: 'Excessive violent gaming can increase aggression and reduce empathy' }
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
      }, 800); // Slightly faster pace for more decisions
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
      // Cap the total coins at 15 (0.5 coins per correct answer, max 30 correct answers)
      if (totalCorrect < 30) {
        const points = 1 + Math.min(streak, 4); // More points for longer streaks (max 5)
        setScore(score + points);
        setStreak(streak + 1);
        setTotalCorrect(totalCorrect + 1); // Track correct answers
        setFeedbackMessage(`+${points} coins! ${currentAction.explanation}`);
        setShowFeedback(true);
      }
    } else {
      setStreak(0);
      setFeedbackMessage(`Not ideal! ${currentAction.explanation}`);
      setShowFeedback(true);
    }

    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 1200);

    // Generate next action
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setCurrentAction(randomAction);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  // Calculate coins based on correct answers (max 15 coins)
  const calculateTotalCoins = () => {
    return Math.min(totalCorrect * 0.5, 15); // 0.5 coins per correct answer, max 15
  };

  return (
    <GameShell
      title="Reflex Mind Check"
      score={score}
      currentLevel={1}
      totalLevels={1}
      gameId="reflex-mind-check"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/teens"
    >
      <GameCard>
        {gameState === 'waiting' && (
          <div 
            className="text-center cursor-pointer hover:opacity-90 transition duration-200"
            onClick={startGame}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Mind Check Reflex!</h3>
            <p className="text-white/80 mb-6">Tap quickly for mind-boosting actions, avoid harmful ones</p>
            <div className="text-3xl font-bold text-yellow-300 mb-4">Tap to Start</div>
            <p className="text-white/60">You'll have 30 seconds to get as many coins as possible</p>
            <p className="text-white/60 mt-2">More points for longer streaks!</p>
          </div>
        )}
        
        {gameState === 'active' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold text-white">Score: <span className="text-yellow-300">{score}</span></div>
              <div className="text-xl font-bold text-red-400">{timeLeft}s</div>
              <div className="text-xl font-bold text-green-400">Streak: {streak}</div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-white/80 mb-4">Tap if it's good for your mind!</p>
              {currentAction ? (
                <div className="inline-block p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
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
                className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Brain className="w-8 h-8 mb-2" />
                <span className="font-bold">Good for Mind!</span>
              </button>
              
              <button
                onClick={() => handleActionTap('bad')}
                className="p-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Coffee className="w-8 h-8 mb-2" />
                <span className="font-bold">Bad for Mind!</span>
              </button>
            </div>
            
            {showFeedback && (
              <FeedbackBubble 
                message={feedbackMessage}
                type={feedbackMessage.includes('coins') ? "correct" : "wrong"}
              />
            )}
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Game Complete!</h3>
            <div className="text-5xl font-bold text-yellow-300 mb-6">{score} Coins</div>
            <p className="text-white/80 mb-6 text-lg">
              {score >= 25 ? 'Excellent! Your mind reflexes are sharp!' : 
               score >= 15 ? 'Great job! Your mental wellness knowledge is solid!' : 
               score >= 8 ? 'Good effort! Keep practicing to improve!' : 
               'Keep practicing to boost your mind reflexes!'}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:opacity-90 transition"
              >
                Play Again
              </button>
              
              <button
                onClick={handleGameComplete}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full font-semibold shadow-md hover:opacity-90 transition"
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

export default ReflexMindCheck;