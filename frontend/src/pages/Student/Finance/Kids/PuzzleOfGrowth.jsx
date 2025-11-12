import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfGrowth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [matches, setMatches] = useState({});

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
    resetFeedback();
    const correctPair = stages[currentStage].items.find((i) => i.left === left && i.right === right);
    if (correctPair) {
      setMatches((prev) => ({ ...prev, [left]: right }));
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (Object.keys(matches).length + 1 === stages[currentStage].items.length) {
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setMatches({});
          setCurrentStage((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Puzzle of Growth"
      subtitle="Match things that grow!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-124"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold mb-4">Match items to what they grow into!</h3>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              {stages[currentStage].items.map((i) => (
                <React.Fragment key={i.left}>
                  <button className="bg-blue-600 py-3 rounded-lg">{i.left}</button>
                  <button
                    className="bg-purple-600 py-3 rounded-lg hover:bg-purple-700"
                    onClick={() => handleMatch(i.left, i.right)}
                  >
                    {matches[i.left] ? "✅ Matched!" : i.right}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🌱🎉</div>
            <h3 className="text-3xl font-bold mb-4">Growth Puzzle Master!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of {stages.length * stages[0].items.length} for matching growth!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Savings grow like plants!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfGrowth;