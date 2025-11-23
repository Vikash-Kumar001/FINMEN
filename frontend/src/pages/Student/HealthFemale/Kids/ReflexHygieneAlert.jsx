import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const ReflexHygieneAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const items = [
    { type: 'clean', emoji: '👕', text: 'Clean Shirt' },
    { type: 'dirty', emoji: '👚', text: 'Dirty Shirt' },
    { type: 'clean', emoji: '👗', text: 'Clean Dress' },
    { type: 'dirty', emoji: '👖', text: 'Dirty Pants' },
    { type: 'clean', emoji: '🧦', text: 'Clean Socks' },
    { type: 'dirty', emoji: '🧥', text: 'Dirty Jacket' },
    { type: 'clean', emoji: '👚', text: 'Clean Blouse' },
    { type: 'dirty', emoji: '👕', text: 'Dirty T-Shirt' },
  ];

  // Start the game automatically when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
      startNewRound();
      startTimer();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const startNewRound = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
  }, [items]);

  const handleChoice = (choice) => {
    if (gameOver) return;
    
    const isCorrect = 
      (choice === 'clean' && currentItem.type === 'clean') ||
      (choice === 'dirty' && currentItem.type === 'dirty');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('Correct! +1 point');
      showCorrectAnswerFeedback(1, false);
    } else {
      setFeedback('Oops! Try again');
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      startNewRound();
    }, 1000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setShowFeedback(false);
    startNewRound();
    startTimer();
  };

  if (!gameStarted) {
    return (
      <GameShell
        title="Reflex Hygiene Alert"
        subtitle="Loading..."
        backPath="/games/health-female/kids"
      
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">👕</div>
            <p className="text-white">Getting your reflex game ready...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  if (gameOver) {
    const coinsEarned = Math.floor(score / 2);
    return (
      <GameShell
        title="Reflex Hygiene Alert"
        subtitle="Game Over!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={score}
        gameId="health-female-kids-9"
        gameType="health-female"
        totalLevels={10}
        currentLevel={9}
        showConfetti={score >= 10}
        backPath="/games/health-female/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4 text-white">Game Complete!</h2>
          <p className="text-white/90 mb-2 text-lg">
            You scored {score} points!
          </p>
          <div className="text-yellow-400 font-bold text-xl mb-6">
            You've earned +{coinsEarned} Coins!
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 p-6 rounded-xl border border-green-500/30 mb-8">
            <p className="text-white/90">
              {score >= 10 ? 'Amazing! You have great reflexes!' : 'Nice job! Keep practicing to get faster!'}
            </p>
          </div>
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Reflex Hygiene Alert"
      subtitle="Tap Clean or Dirty"
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-500/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Score: {score}</span>
            </div>
            <div className="bg-red-500/20 px-4 py-2 rounded-full">
              <span className="text-red-300 font-bold">Time: {timeLeft}s</span>
            </div>
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">Coins: {Math.floor(score / 2)}</span>
            </div>
          </div>
          
          <div className="text-center my-12">
            <div className="text-8xl mb-6 transform hover:scale-110 transition-transform">
              {currentItem?.emoji}
            </div>
            <h3 className="text-xl text-white/90 mb-2">
              {currentItem?.text}
            </h3>
            {showFeedback && (
              <p className={`text-lg font-bold mt-4 ${
                feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'
              }`}>
                {feedback}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mt-12">
            <button
              onClick={() => handleChoice('clean')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 px-4 rounded-2xl text-2xl transition-all transform hover:scale-105"
            >
              👕 Clean
            </button>
            <button
              onClick={() => handleChoice('dirty')}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-6 px-4 rounded-2xl text-2xl transition-all transform hover:scale-105"
            >
              🚫 Dirty
            </button>
          </div>
          
          <div className="mt-8 text-center text-sm text-white/60">
            <p>Quick! Tap if the clothing item is clean or dirty!</p>
            <p className="mt-2">Earn 1 point for each correct answer. Be quick!</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexHygieneAlert;
