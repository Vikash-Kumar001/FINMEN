import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrangerStoryy = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    { action: "Refuse", wrong: "Accept", prompt: "Stranger offers a toy for your address. What do you do?" },
    { action: "Say No", wrong: "Give Info", prompt: "Someone asks for your bank details. What now?" },
    { action: "Walk Away", wrong: "Engage", prompt: "Stranger offers a deal. What’s safer?" },
    { action: "Tell Adult", wrong: "Stay Quiet", prompt: "You see a suspicious offer. What do you do?" },
    { action: "Ignore", wrong: "Reply", prompt: "You get a strange message. What’s best?" },
  ];

  const handleChoice = (choice) => {
    resetFeedback();
    if (choice === stages[currentStage].action) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Automatically advance to next question after a delay
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage((prev) => prev + 1);
      } else {
        // For the last question, show result and then automatically navigate
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
      title="Stranger Story"
      subtitle={stages[currentStage]?.prompt || "Stay safe with strangers!"}
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
      gameId="finance-kids-165"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Question {currentStage + 1}</h3>
            <p className="text-lg mb-6">{stages[currentStage]?.prompt || "Stay safe with strangers!"}</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleChoice(stages[currentStage]?.action)}
                className="bg-green-500 hover:bg-green-600 px-6 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105"
                disabled={!stages[currentStage]}
              >
                {stages[currentStage]?.action || "Safe Choice"}
              </button>
              <button
                onClick={() => handleChoice(stages[currentStage]?.wrong)}
                className="bg-red-500 hover:bg-red-600 px-6 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105"
                disabled={!stages[currentStage]}
              >
                {stages[currentStage]?.wrong || "Unsafe Choice"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
            <ShoppingCart className="mx-auto w-10 h-10 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Safety Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Stay safe with strangers!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StrangerStoryy;