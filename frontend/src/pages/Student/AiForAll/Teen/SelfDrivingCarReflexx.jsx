import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfDrivingCarReflexx = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentLight, setCurrentLight] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🚦 Reflex challenges — each color has one correct action
  const lights = [
    { id: 1, emoji: "🟥", signal: "Red", correctAction: "Stop" },
    { id: 2, emoji: "🟢", signal: "Green", correctAction: "Go" },
    { id: 3, emoji: "🟡", signal: "Yellow", correctAction: "Slow" },
    { id: 4, emoji: "🟢", signal: "Green", correctAction: "Go" },
    { id: 5, emoji: "🟥", signal: "Red", correctAction: "Stop" },
    { id: 6, emoji: "🟡", signal: "Yellow", correctAction: "Slow" },
    { id: 7, emoji: "🟢", signal: "Green", correctAction: "Go" },
    { id: 8, emoji: "🟥", signal: "Red", correctAction: "Stop" },
    { id: 9, emoji: "🟡", signal: "Yellow", correctAction: "Slow" },
    { id: 10, emoji: "🟢", signal: "Green", correctAction: "Go" },
  ];

  const currentLightData = lights[currentLight];
  const options = ["Stop", "Go", "Slow"];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentLightData.correctAction;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 1); // Each correct = +1 coin
      showCorrectAnswerFeedback(1, false);
    }

    if (currentLight < lights.length - 1) {
      setTimeout(() => setCurrentLight((prev) => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLight(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-ethics-decision"); // 🔗 update next path
  };

  const accuracy = Math.round((score / lights.length) * 100);

  return (
    <GameShell
      title="Self-Driving Car Reflex 🚗"
      score={coins}
      subtitle={`Signal ${currentLight + 1} of ${lights.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-38"
      gameType="ai"
      totalLevels={40}
      currentLevel={38}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              React Fast! What should the car do? 🚦
            </h3>

            <div className="bg-gradient-to-br from-red-500/30 to-yellow-500/30 rounded-xl p-12 mb-6 text-center">
              <div className="text-8xl mb-3">{currentLightData.emoji}</div>
              <p className="text-white text-3xl font-bold">
                {currentLightData.signal} Light
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">
                    {opt === "Stop" && "🛑 "}
                    {opt === "Go" && "🏎️ "}
                    {opt === "Slow" && "⚠️ "}
                    {opt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🚦 Reflex Pro!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You reacted correctly to {score} out of {lights.length} signals! ({accuracy}%)
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Self-driving cars use sensors and AI to detect traffic lights and make quick decisions — Stop 🛑, Go 🟢, or Slow ⚠️ — keeping roads safe for everyone!
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

export default SelfDrivingCarReflexx;
