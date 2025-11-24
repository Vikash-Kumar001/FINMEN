import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMonthlyAllowance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-59";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [target, setTarget] = useState("");

  const stages = [
    { action: "Plan Ahead", wrong: "Spend All", prompt: "Tap to plan your budget!" },
    { action: "Save First", wrong: "Waste Money", prompt: "Tap to save first!" },
    { action: "Track Costs", wrong: "Ignore Costs", prompt: "Tap to track costs!" },
    { action: "Prioritize Needs", wrong: "Buy Wants", prompt: "Tap to prioritize needs!" },
    { action: "Check Balance", wrong: "Forget Balance", prompt: "Tap to check balance!" }
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].action : stages[currentStage].wrong);
    }
  }, [currentStage]);

  const handleClick = (choice) => {
    resetFeedback();
    const isCorrect = choice === stages[currentStage].action;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false, "Oops! Try again.");
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage(prev => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/student/finance");

  return (
    <GameShell
      title="Reflex Budget Smarts"
      subtitle={stages[currentStage]?.prompt || "Test your budget reflexes!"}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score>= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-59"
      gameType="reflex"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Stage {currentStage + 1}</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleClick(stages[currentStage].action)}
                className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleClick(stages[currentStage].wrong)}
                className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-full text-xl font-bold transition-transform hover:scale-105"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Budget Smarts Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Quick thinking improves budgeting!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexBudgetSmarts;