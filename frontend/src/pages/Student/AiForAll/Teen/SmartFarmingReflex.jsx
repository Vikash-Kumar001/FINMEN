import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartFarmingReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🌱 Reflex challenges — react to rain or sun
  const items = [
    { id: 1, emoji: "🌧️", condition: "Rain", correctAction: "Don't water" },
    { id: 2, emoji: "☀️", condition: "Sun", correctAction: "Water" },
    { id: 3, emoji: "☀️", condition: "Sun", correctAction: "Water" },
    { id: 4, emoji: "🌧️", condition: "Rain", correctAction: "Don't water" },
    { id: 5, emoji: "☀️", condition: "Sun", correctAction: "Water" },
  ];

  const currentItemData = items[currentItem];
  const options = ["Water", "Don't water"];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correctAction;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 5); // Each correct = +5 coins
      showCorrectAnswerFeedback(5, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => setCurrentItem((prev) => prev + 1), 300);
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
    navigate("/student/ai-for-all/teen/ai-teacher-story"); // 🔗 update next path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Smart Farming Reflex 🌱"
      score={coins}
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-40"
      gameType="ai"
      totalLevels={40}
      currentLevel={40}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              React quickly! 🌞🌧️
            </h3>

            <div className="bg-gradient-to-br from-green-500/30 to-yellow-500/30 rounded-xl p-12 mb-6 text-center">
              <div className="text-8xl mb-3">{currentItemData.emoji}</div>
              <p className="text-white text-3xl font-bold">
                {currentItemData.condition} Condition
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">
                    {opt === "Water" ? "💧 " : "🚫 "} {opt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🌱 Farming Pro!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You reacted correctly to {score} out of {items.length} conditions! ({accuracy}%)
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI helps farmers manage crops efficiently by deciding when to water based on weather conditions — avoid overwatering during rain and water plants under sun! 🌞🌧️
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>

            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartFarmingReflex;
