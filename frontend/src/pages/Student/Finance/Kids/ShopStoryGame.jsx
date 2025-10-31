import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShopStoryGame = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Return Extra Change", wrong: "Keep It Quietly", prompt: "Shopkeeper gives extra change. What do you do?" },
    { action: "Be Honest", wrong: "Lie About Price", prompt: "You find a cheaper item. What do you do?" },
    { action: "Pay Fairly", wrong: "Bargain Unfairly", prompt: "Seller quotes a price. What’s next?" },
    { action: "Check Receipt", wrong: "Ignore Bill", prompt: "You get a receipt. What do you do?" },
    { action: "Report Error", wrong: "Stay Silent", prompt: "Store overcharges you. What now?" },
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
      title="Shop Story"
      subtitle={stages[currentStage]?.prompt || "Make honest shopping choices!"}
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
      gameId="finance-kids-188"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <p className="text-lg mb-6">{stages[currentStage]?.prompt || "Make honest shopping choices!"}</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleChoice(stages[currentStage]?.action)}
                className="bg-white/20 px-6 py-4 rounded-full text-white font-bold hover:bg-white/30 transition-transform hover:scale-105"
                disabled={!stages[currentStage]}
              >
                {stages[currentStage]?.action || "Honest Choice"}
              </button>
              <button
                onClick={() => handleChoice(stages[currentStage]?.wrong)}
                className="bg-white/20 px-6 py-4 rounded-full text-white font-bold hover:bg-white/30 transition-transform hover:scale-105"
                disabled={!stages[currentStage]}
              >
                {stages[currentStage]?.wrong || "Dishonest Choice"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Honest Shopper Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Honesty pays in shopping!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShopStoryGame;