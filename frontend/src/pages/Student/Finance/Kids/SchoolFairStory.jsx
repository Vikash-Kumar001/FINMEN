import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolFairStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Plan for Both", wrong: "Spend on Toys", prompt: "You have ₹50 for the fair. What do you do?" },
    { action: "Budget Food", wrong: "Buy Games", prompt: "You want snacks and games. What’s smarter?" },
    { action: "Save Some", wrong: "Spend All", prompt: "You get ₹30 more. What now?" },
    { action: "Share with Friend", wrong: "Keep All", prompt: "Your friend has no money. What do you do?" },
    { action: "Buy One Toy", wrong: "Buy Many", prompt: "You see cool toys. What’s the best choice?" },
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
      title="School Fair Story"
      subtitle={stages[currentStage]?.prompt || "Make smart fair choices!"}
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
      gameId="finance-kids-28"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <p className="text-xl mb-6">{stages[currentStage].prompt}</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleChoice(stages[currentStage].action)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleChoice(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4"><PartyPopper className="inline w-10 h-10" /></div>
            <h3 className="text-3xl font-bold mb-4">Fair Budget Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Budget for fun and needs!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SchoolFairStory;