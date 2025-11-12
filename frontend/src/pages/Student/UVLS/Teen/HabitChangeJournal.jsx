import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HabitChangeJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [habit, setHabit] = useState("");
  const [steps, setSteps] = useState(["", "", "", "", ""]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleHabitChange = (e) => {
    setHabit(e.target.value);
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
      }, 1500);
    } else {
      setShowResult(true);
      if (habit.trim() !== "" && steps.every(s => s.trim() !== "")) {
        setCoins(5);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = habit.trim() !== "" && steps.every(s => s.trim() !== "");

  return (
    <GameShell
      title="Habit Change Journal"
      subtitle={`Step ${currentStep + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      gameId="life-198"
      gameType="life"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={8}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {currentStep === 0 && (
                <>
                  <p className="text-white text-xl mb-6">Habit to change:</p>
                  <input
                    value={habit}
                    onChange={handleHabitChange}
                    className="w-full p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="Habit..."
                  />
                </>
              )}
              <p className="text-white text-xl mb-6">Plan step {currentStep + 1}:</p>
              
              <textarea
                value={steps[currentStep]}
                onChange={handleStepChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Step..."
              />
              
              <button
                onClick={handleSubmit}
                disabled={steps[currentStep].trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  steps[currentStep].trim() !== ""
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
              Your habit change plan is ready.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Schedule check-ins.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HabitChangeJournal;