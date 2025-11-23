import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SnackStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Lunch", wrong: "Chips", prompt: "You need lunch but want chips. What do you pick?" },
    { action: "Healthy Snack", wrong: "Candy", prompt: "You’re hungry. What’s the smart choice?" },
    { action: "Water", wrong: "Soda", prompt: "You’re thirsty. What do you choose?" },
    { action: "Fruit", wrong: "Cookies", prompt: "You want a snack. What’s better?" },
    { action: "Balanced Meal", wrong: "Ice Cream", prompt: "You have money for food. What now?" },
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
      title="Snack Story"
      subtitle={stages[currentStage]?.prompt || "Make smart food choices!"}
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
      gameId="finance-kids-65"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <p className="text-xl mb-6">{stages[currentStage].prompt}</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleChoice(stages[currentStage].action)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleChoice(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold mb-4">Healthy Choice Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Choose healthy needs first!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SnackStory;