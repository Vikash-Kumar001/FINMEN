import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexCheckFirst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
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
      setCoins((prev) => prev + 1);
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

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Reflex Check First"
      subtitle={stages[currentStage]?.prompt || "Test your checking reflexes!"}
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
      gameId="finance-kids-169"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <div
              onClick={handleTap}
              className="bg-white/10 text-3xl font-bold px-12 py-8 rounded-2xl border border-white/20 cursor-pointer select-none hover:scale-105 transition-transform"
            >
              {showWord}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">⚡🎉</div>
            <h3 className="text-3xl font-bold mb-4">Check First Reflex Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Always check before buying!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexCheckFirst;