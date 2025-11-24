import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Apple, Coffee, Fish, Candy, Carrot, Menu, Leaf, Zap } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const ReflexBrainBoost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-9";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentFood, setCurrentFood] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track total correct answers

  const foods = [
    { id: 1, text: 'Fish (Omega-3)', type: 'good', icon: <Fish className="w-6 h-6" />, explanation: 'Supports brain function and development' },
    { id: 2, text: 'Candy', type: 'bad', icon: <Candy className="w-6 h-6" />, explanation: 'Causes energy crashes and poor concentration' },
    { id: 3, text: 'Carrots (Vitamins)', type: 'good', icon: <Carrot className="w-6 h-6" />, explanation: 'Rich in antioxidants for brain health' },
    { id: 4, text: 'Fast Food Burger', type: 'bad', icon: <Menu className="w-6 h-6" />, explanation: 'High in unhealthy fats that slow brain function' },
    { id: 5, text: 'Leafy Greens', type: 'good', icon: <Leaf className="w-6 h-6" />, explanation: 'Contains folate which improves cognitive function' },
    { id: 6, text: 'Energy Drink', type: 'bad', icon: <Zap className="w-6 h-6" />, explanation: 'Leads to crashes and disrupts sleep patterns' },
    { id: 7, text: 'Apples (Fiber)', type: 'good', icon: <Apple className="w-6 h-6" />, explanation: 'Steady energy source for sustained focus' },
    { id: 8, text: 'Coffee (Too much)', type: 'bad', icon: <Coffee className="w-6 h-6" />, explanation: 'Excess caffeine causes jitters and anxiety' }
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

  // Generate new food
  useEffect(() => {
    if (gameState === 'active') {
      const foodTimer = setTimeout(() => {
        if (timeLeft > 0) {
          const randomFood = foods[Math.floor(Math.random() * foods.length)];
          setCurrentFood(randomFood);
        }
      }, 800); // Slightly faster pace for more decisions
      return () => clearTimeout(foodTimer);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('active');
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setTotalCorrect(0);
    setLevelCompleted(false);
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
  };

  const handleFoodTap = (foodType) => {
    if (!currentFood || gameState !== 'active') return;

    const isCorrect = foodType === 'good';
    
    if (isCorrect) {
      setScore(score + 1); // 1 coin per correct answer
      setStreak(streak + 1);
      setTotalCorrect(totalCorrect + 1); // Track correct answers
      setFeedbackMessage(`+1 coin! ${currentFood.explanation}`);
      setShowFeedback(true);
    } else {
      setStreak(0);
      setFeedbackMessage(`Not ideal! ${currentFood.explanation}`);
      setShowFeedback(true);
    }

    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 1200);

    // Generate next food
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  // Calculate coins based on correct answers (1 coin per correct answer)
  const calculateTotalCoins = () => {
    return totalCorrect * 1;
  };

  return (
    <GameShell
      title="Reflex Brain Boost"
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/teens"
    >
      <GameCard>
        {gameState === 'waiting' && (
          <div 
            className="text-center cursor-pointer hover:opacity-90 transition duration-200"
            onClick={startGame}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Brain Boost Reflex!</h3>
            <p className="text-white/80 mb-6">Tap quickly for brain-boosting foods, avoid harmful ones</p>
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
              <p className="text-white/80 mb-4">Tap if it's good for your brain!</p>
              {currentFood ? (
                <div className="inline-block p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <div className="text-white">
                    {currentFood.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{currentFood.text}</div>
                </div>
              ) : (
                <div className="text-white/60">Get ready...</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleFoodTap('good')}
                className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Apple className="w-8 h-8 mb-2" />
                <span className="font-bold">Good for Brain!</span>
              </button>
              
              <button
                onClick={() => handleFoodTap('bad')}
                className="p-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Coffee className="w-8 h-8 mb-2" />
                <span className="font-bold">Bad for Brain!</span>
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
              {score >= 25 ? 'Excellent! Your brain reflexes are sharp!' : 
               score >= 15 ? 'Great job! Your brain knowledge is solid!' : 
               score >= 8 ? 'Good effort! Keep practicing to improve!' : 
               'Keep practicing to boost your brain reflexes!'}
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

export default ReflexBrainBoost;