import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleOfGrowth = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-64";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [matches, setMatches] = useState({});
  const [answered, setAnswered] = useState(false);

  const stages = [
    {
      items: [
        { left: "Seed", right: "Tree" },
        { left: "Savings", right: "Growth" },
      ],
    },
    {
      items: [
        { left: "Plant", right: "Fruit" },
        { left: "Bank Deposit", right: "Interest" },
      ],
    },
    {
      items: [
        { left: "Sapling", right: "Forest" },
        { left: "Investment", right: "Profit" },
      ],
    },
    {
      items: [
        { left: "Bulb", right: "Flower" },
        { left: "Savings Account", right: "Wealth" },
      ],
    },
    {
      items: [
        { left: "Acorn", right: "Oak" },
        { left: "Money Saved", right: "Future Fund" },
      ],
    },
  ];

  const handleMatch = (left, right) => {
    if (answered || matches[left]) return; // Prevent multiple clicks
    
    resetFeedback();
    const correctPair = stages[currentStage].items.find((i) => i.left === left && i.right === right);
    
    if (correctPair) {
      const newMatches = { ...matches, [left]: right };
      setMatches(newMatches);
      showCorrectAnswerFeedback(1, true);
      
      // Check if all items in current stage are matched
      if (Object.keys(newMatches).length === stages[currentStage].items.length) {
        setScore((prev) => prev + 1);
        setAnswered(true);
        
        // Move to next stage or show results
        const isLastStage = currentStage === stages.length - 1;
        setTimeout(() => {
          if (isLastStage) {
            setShowResult(true);
          } else {
            setMatches({});
            setCurrentStage((prev) => prev + 1);
            setAnswered(false);
          }
        }, 800);
      }
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Puzzle of Growth"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Match things that grow!` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-2xl font-bold mb-4">Match items to what they grow into!</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {stages[currentStage].items.map((i) => (
              <React.Fragment key={i.left}>
                <button 
                  className="bg-blue-600 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={showResult || answered}
                >
                  {i.left}
                </button>
                <button
                  className="bg-purple-600 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  onClick={() => handleMatch(i.left, i.right)}
                  disabled={showResult || matches[i.left] || answered}
                >
                  {matches[i.left] ? "✅ Matched!" : i.right}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleOfGrowth;