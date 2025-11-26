import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexBudget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-23";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [target, setTarget] = useState("");

  const stages = [
    { action: "Plan Before Spending", wrong: "Spend Instantly", prompt: "Tap to plan your budget!" },
    { action: "Save First", wrong: "Buy Now", prompt: "Tap to save before spending!" },
    { action: "Track Expenses", wrong: "Ignore Costs", prompt: "Tap to track expenses!" },
    { action: "Set Goals", wrong: "Spend Freely", prompt: "Tap to set savings goals!" },
    { action: "Budget Wisely", wrong: "Overspend", prompt: "Tap to budget wisely!" },
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].action : stages[currentStage].wrong);
    }
  }, [currentStage]);

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
      title="Reflex Budget"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: ${stages[currentStage]?.prompt || "Test your budgeting reflexes!"}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-kids-23"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}>
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => handleTap(stages[currentStage].action)}
              className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold px-6 py-4 rounded-xl transition-transform hover:scale-105"
              disabled={showResult}
            >
              {stages[currentStage].action}
            </button>
            <button
              onClick={() => handleTap(stages[currentStage].wrong)}
              className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold px-6 py-4 rounded-xl transition-transform hover:scale-105"
              disabled={showResult}
            >
              {stages[currentStage].wrong}
            </button>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexBudget;