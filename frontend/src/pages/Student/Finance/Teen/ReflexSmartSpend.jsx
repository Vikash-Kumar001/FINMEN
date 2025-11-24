import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexSmartSpend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-79";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [target, setTarget] = useState("");

  const stages = [
    {
      id: 1,
      action: "Pay Rent",
      wrong: "Luxury Party",
      prompt: "Tap to pay rent!"
    },
    {
      id: 2,
      action: "Buy Groceries",
      wrong: "New Gadgets",
      prompt: "Tap to buy groceries!"
    },
    {
      id: 3,
      action: "Save Money",
      wrong: "Movie Night",
      prompt: "Tap to save money!"
    },
    {
      id: 4,
      action: "Pay Bills",
      wrong: "Designer Clothes",
      prompt: "Tap to pay bills!"
    },
    {
      id: 5,
      action: "Fund Education",
      wrong: "Concert Ticket",
      prompt: "Tap to fund education!"
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
      title="Reflex Smart Spend"
      score={coins}
      subtitle={stages[currentStage]?.prompt || "Test your spending reflexes!"}
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore>= 3}
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      
      gameId="finance-teens-79"
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
            <h3 className="text-3xl font-bold mb-4">Smart Spend Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {finalScore} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Choose essential spending quickly!</p>
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

export default ReflexSmartSpend;