import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexInvestorSmartness = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [target, setTarget] = useState("");

  const stages = [
    {
      id: 1,
      action: "Diversify",
      wrong: "Put All in One",
      prompt: "Tap to diversify!"
    },
    {
      id: 2,
      action: "Research First",
      wrong: "Invest Blindly",
      prompt: "Tap to research first!"
    },
    {
      id: 3,
      action: "Long-term Plan",
      wrong: "Short-term Gain",
      prompt: "Tap for long-term plan!"
    },
    {
      id: 4,
      action: "Check Risk",
      wrong: "Ignore Risk",
      prompt: "Tap to check risk!"
    },
    {
      id: 5,
      action: "Balance Portfolio",
      wrong: "Single Stock",
      prompt: "Tap to balance portfolio!"
    }
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].action : stages[currentStage].wrong);
    }
  }, [currentStage]);

  const handleTap = (choice) => {
    resetFeedback();
    const isCorrect = choice === stages[currentStage].action;

    if (isCorrect) {
      setCoins(prev => prev + 3);
      showCorrectAnswerFeedback(3, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage(prev => prev + 1), 800);
    } else {
      const finalCoins = isCorrect ? coins + 3 : coins;
      setFinalScore(Math.floor(finalCoins / 3));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentStage(0);
    setCoins(0);
    setFinalScore(0);
    setTarget("");
    resetFeedback();
  };

  const handleNext = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Reflex Investor Smartness"
      subtitle={stages[currentStage]?.prompt || "Test your investor reflexes!"}
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-teens-133"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Stage {currentStage + 1}</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleTap(stages[currentStage].action)}
                className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleTap(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-full text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Investor Smartness Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {finalScore} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Smart investing reduces risks!</p>
            {finalScore < 3 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-transform hover:scale-105 mt-4"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexInvestorSmartness;