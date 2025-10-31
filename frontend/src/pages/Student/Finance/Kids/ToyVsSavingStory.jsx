import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToyVsSavingStory = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Save for Bicycle", wrong: "Buy Toy", prompt: "Buy toy today or save for a bicycle later?" },
    { action: "Save for Goal", wrong: "Spend Now", prompt: "You get gift money. What’s smarter?" },
    { action: "Build Savings", wrong: "Buy Gadget", prompt: "You want a gadget. What’s the plan?" },
    { action: "Save Allowance", wrong: "Buy Candy", prompt: "You get allowance. What do you do?" },
    { action: "Long-Term Save", wrong: "Quick Spend", prompt: "You see a cool toy. What’s best?" },
  ];

  const handleChoice = (choice) => {
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
      title="Toy vs Saving Story"
      subtitle={stages[currentStage]?.prompt || "Make smart saving choices!"}
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
      gameId="finance-kids-128"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <Gift className="mx-auto w-10 h-10 text-pink-400 mb-4" />
            <p className="text-lg mb-6">{stages[currentStage].prompt}</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleChoice(stages[currentStage].action)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleChoice(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🚴‍♀️🎉</div>
            <h3 className="text-3xl font-bold mb-4">Saving Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Save for bigger goals!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ToyVsSavingStory;