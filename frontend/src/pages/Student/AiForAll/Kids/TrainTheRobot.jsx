import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TrainTheRobot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "ai-kids-16";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Reduced to 5 items to comply with the 5-question rule
  const items = [
    { id: 1, emoji: "🍎", name: "Apple", isFood: true },
    { id: 2, emoji: "⚽", name: "Ball", isFood: false },
    { id: 3, emoji: "🍌", name: "Banana", isFood: true },
    { id: 4, emoji: "🚗", name: "Car", isFood: false },
    { id: 5, emoji: "🍕", name: "Pizza", isFood: true }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.isFood;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // Changed to 1 coin per correct answer
      showCorrectAnswerFeedback(1, true); // Changed to true for proper feedback
    }
    
    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ai-for-all/kids"); // Updated to standard navigation path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Train the Robot"
      score={coins}
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      gameId={gameId}
      gameType="ai"
      totalLevels={5} // Updated to match the number of items
      currentLevel={currentItem + 1}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5} // Added maxScore prop
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4 text-center">🤖</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Teach the robot what food is!</h3>
            
            <div className="bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-2xl p-12 mb-6 border border-white/20">
              <div className="text-9xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-2xl font-bold text-center">{currentItemData.name}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Is this food?</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-2xl p-8 transition-all transform hover:scale-105 border border-white/20"
              >
                <div className="text-6xl mb-2">🍽️</div>
                <div className="text-white font-bold text-xl">FOOD</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-2xl p-8 transition-all transform hover:scale-105 border border-white/20"
              >
                <div className="text-6xl mb-2">🔧</div>
                <div className="text-white font-bold text-xl">NOT FOOD</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 AI Trainer!" : "💪 Keep Training!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You taught the robot {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-xl p-4 mb-4 border border-white/10">
              <p className="text-white/90">
                💡 You just trained AI! This is how AI learns - from examples we give it!
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
              <span>+{coins} Coins</span>
            </div>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainTheRobot;