import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexCheckFirst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-89";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showWord, setShowWord] = useState("");

  const stages = [
    { action: "Ask Price", wrong: "Trust Blindly", prompt: "Tap when 'Ask Price' appears!" },
    { action: "Check Cost", wrong: "Buy Now", prompt: "Tap when 'Check Cost' appears!" },
    { action: "Compare Prices", wrong: "Pay Fast", prompt: "Tap when 'Compare Prices' appears!" },
    { action: "Verify Quality", wrong: "Ignore", prompt: "Tap when 'Verify Quality' appears!" },
    { action: "Read Reviews", wrong: "Rush", prompt: "Tap when 'Read Reviews' appears!" },
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      const interval = setInterval(() => {
        setShowWord((prev) => (prev === stages[currentStage].action ? stages[currentStage].wrong : stages[currentStage].action));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  const handleTap = () => {
    resetFeedback();
    if (showWord === stages[currentStage].action) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      if (currentStage < stages.length - 1) {
        setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Reflex Check First"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: ${stages[currentStage]?.prompt || "Test your checking reflexes!"}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId="finance-kids-169"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div
            onClick={handleTap}
            className="bg-white/10 text-3xl font-bold px-12 py-8 rounded-2xl border border-white/20 cursor-pointer select-none hover:scale-105 transition-transform"
          >
            {showWord}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexCheckFirst;