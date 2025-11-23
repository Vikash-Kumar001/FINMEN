import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToyShopStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Check Price", wrong: "Buy Quickly", prompt: "Seller says, 'Hurry or lose toy!' What do you do?" },
    { action: "Compare Prices", wrong: "Pay Now", prompt: "You see two toy stores. What’s smarter?" },
    { action: "Ask Quality", wrong: "Buy Fast", prompt: "Toy looks cool. What do you check?" },
    { action: "Read Reviews", wrong: "Rush", prompt: "Online toy sale. What’s first?" },
    { action: "Budget First", wrong: "Spend All", prompt: "You want a toy. What’s the plan?" },
  ];

  const handleChoice = (choice) => {
    resetFeedback();
    if (choice === stages[currentStage].action) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Automatically advance to next round after a delay
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage((prev) => prev + 1);
      } else {
        // For the last round, show result and then automatically navigate
        setShowResult(true);
        setTimeout(() => {
          navigate("/games/financial-literacy/kids");
        }, 3000); // Show the result for 3 seconds before navigating
      }
    }, 2000);
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Toy Shop Story"
      subtitle={stages[currentStage]?.prompt || "Make smart toy shopping choices!"}
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
      gameId="finance-kids-168"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <p className="text-lg mb-6">{stages[currentStage].prompt}</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleChoice(stages[currentStage].action)}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-full text-white font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleChoice(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-full text-white font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold mb-4">Toy Shop Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Check before you buy!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ToyShopStory;