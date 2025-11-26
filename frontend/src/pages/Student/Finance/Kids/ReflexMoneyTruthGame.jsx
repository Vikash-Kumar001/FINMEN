import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexMoneyTruthGame = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-99";
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
    { action: "Be Fair", wrong: "Be Greedy", prompt: "Tap for Be Fair!" },
    { action: "Tell Truth", wrong: "Lie", prompt: "Tap for Tell Truth!" },
    { action: "Share", wrong: "Hoard", prompt: "Tap for Share!" },
    { action: "Honest Deal", wrong: "Cheat", prompt: "Tap for Honest Deal!" },
    { action: "Be Ethical", wrong: "Be Dishonest", prompt: "Tap for Be Ethical!" },
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
      title="Reflex Money Truth"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: ${stages[currentStage]?.prompt || "Test your fairness reflexes!"}`}
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
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleTap(stages[currentStage].action)}
              className="bg-green-500 px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              {stages[currentStage].action}
            </button>
            <button
              onClick={() => handleTap(stages[currentStage].wrong)}
              className="bg-red-500 px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform"
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

export default ReflexMoneyTruthGame;