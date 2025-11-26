import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexSmallBusiness = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-79";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Bake & Sell", wrong: "Buy & Waste", prompt: "Tap to earn by selling!" },
    { action: "Make Crafts", wrong: "Spend All", prompt: "Tap to make and sell crafts!" },
    { action: "Offer Service", wrong: "Do Nothing", prompt: "Tap to offer a service!" },
    { action: "Save Profits", wrong: "Spend Profits", prompt: "Tap to save profits!" },
    { action: "Grow Business", wrong: "Waste Money", prompt: "Tap to grow your business!" },
  ];

  const handleTap = (choice) => {
    resetFeedback();
    if (choice === stages[currentStage].action) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Reflex Small Business"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: ${stages[currentStage]?.prompt || "Test your business reflexes!"}`}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center space-y-8 text-white">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleTap(stages[currentStage].action)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-xl font-bold transition-transform hover:scale-105"
            >
              {stages[currentStage].action}
            </button>
            <button
              onClick={() => handleTap(stages[currentStage].wrong)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl text-xl font-bold transition-transform hover:scale-105"
            >
              {stages[currentStage].wrong}
            </button>
          </div>
          <div className="mt-4 text-lg font-semibold">
            Score: {score}/{stages.length}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexSmallBusiness;