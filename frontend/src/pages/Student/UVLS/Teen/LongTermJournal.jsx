import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LongTermJournal = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-58";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [support, setSupport] = useState("");
  const [steps, setSteps] = useState(["", "", "", "", ""]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  const handleSupportChange = (e) => {
    setSupport(e.target.value);
  };

  const handleStepChange = (e) => {
    const newSteps = [...steps];
    newSteps[currentStep] = e.target.value;
    setSteps(newSteps);
  };

  const handleSubmit = () => {
    if (steps[currentStep].trim() === "") return;
    showCorrectAnswerFeedback(1, false);
    if (currentStep < 4) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTimeLeft(30);
      }, 1500);
    } else {
      setShowResult(true);
      if (support.trim() !== "" && steps.every(s => s.trim() !== "")) {
        setCoins(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = support.trim() !== "" && steps.every(s => s.trim() !== "");

  return (
    <GameShell
      title="Long-term Journal"
      subtitle={`Question ${currentStep + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-58"
      gameType="uvls"
      totalLevels={20}
      currentLevel={58}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              {currentStep === 0 && (
                <>
                  <p className="text-white text-xl mb-6">Create support plan:</p>
                  <textarea
                    value={support}
                    onChange={handleSupportChange}
                    className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="Plan overview..."
                  />
                </>
              )}
              <p className="text-white text-xl mb-6">Multi-step {currentStep + 1}:</p>
              
              <textarea
                value={steps[currentStep]}
                onChange={handleStepChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Step..."
              />
              
              <button
                onClick={handleSubmit}
                disabled={steps[currentStep].trim() === "" && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  steps[currentStep].trim() !== "" || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Journal Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your support plan is ready.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Consider confidentiality.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LongTermJournal;