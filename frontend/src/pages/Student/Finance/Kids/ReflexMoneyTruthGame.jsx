import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexMoneyTruthGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-99";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [target, setTarget] = useState("");

  const stages = [
    { action: "Be Fair", wrong: "Be Greedy", prompt: "Tap for Be Fair!" },
    { action: "Tell Truth", wrong: "Lie", prompt: "Tap for Tell Truth!" },
    { action: "Share", wrong: "Hoard", prompt: "Tap for Share!" },
    { action: "Honest Deal", wrong: "Cheat", prompt: "Tap for Honest Deal!" },
    { action: "Be Ethical", wrong: "Be Dishonest", prompt: "Tap for Be Ethical!" },
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].action : stages[currentStage].wrong);
    }
  }, [currentStage]);

  const handleTap = (choice) => {
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
      title="Reflex Money Truth"
      subtitle={stages[currentStage]?.prompt || "Test your fairness reflexes!"}
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
      gameId="finance-kids-189"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Round {currentStage + 1}</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleTap(stages[currentStage].action)}
                className="bg-green-500 px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform"
              >
                {stages[currentStage].action}
              </button>
              <button
                onClick={() => handleTap(stages[currentStage].wrong)}
                className="bg-red-500 px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Fairness Reflex Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {coins} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{coins} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Fairness builds trust!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexMoneyTruthGame;