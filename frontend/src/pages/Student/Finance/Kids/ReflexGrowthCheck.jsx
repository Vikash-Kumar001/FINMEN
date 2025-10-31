import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Zap } from "lucide-react";

const ReflexGrowthCheck = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [target, setTarget] = useState("");

  const stages = [
    { action: "Interest Earned", wrong: "Money Lost", prompt: "Tap for Interest Earned!" },
    { action: "Savings Grew", wrong: "Money Spent", prompt: "Tap for Savings Grew!" },
    { action: "Profit Made", wrong: "Loss Incurred", prompt: "Tap for Profit Made!" },
    { action: "Investment Up", wrong: "Money Down", prompt: "Tap for Investment Up!" },
    { action: "Wealth Grows", wrong: "Funds Shrink", prompt: "Tap for Wealth Grows!" },
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].action : stages[currentStage].wrong);
    }
  }, [currentStage]);

  const handleTap = (choice) => {
    resetFeedback();
    if (choice === stages[currentStage].action) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Reflex Growth Check"
      subtitle={stages[currentStage]?.prompt || "Test your growth reflexes!"}
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-129"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Round {currentStage + 1}</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleTap(stages[currentStage].action)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleTap(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-3"><Zap className="inline w-10 h-10" /></div>
            <h3 className="text-3xl font-bold mb-4">Growth Reflex Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Choose growth for wealth!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexGrowthCheck;