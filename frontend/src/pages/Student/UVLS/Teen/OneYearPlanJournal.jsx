import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OneYearPlanJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [goal, setGoal] = useState("");
  const [milestones, setMilestones] = useState(["", "", "", "", ""]);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };

  const handleMilestoneChange = (e) => {
    const newMilestones = [...milestones];
    newMilestones[currentMilestone] = e.target.value;
    setMilestones(newMilestones);
  };

  const handleSubmit = () => {
    if (milestones[currentMilestone].trim() === "") return;
    showCorrectAnswerFeedback(1, false);
    if (currentMilestone < 4) {
      setTimeout(() => {
        setCurrentMilestone(prev => prev + 1);
      }, 1500);
    } else {
      setShowResult(true);
      if (goal.trim() !== "" && milestones.every(m => m.trim() !== "")) {
        setCoins(5);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = goal.trim() !== "" && milestones.every(m => m.trim() !== "");

  return (
    <GameShell
      title="One-year Plan Journal"
      subtitle={`Milestone ${currentMilestone + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      gameId="life-193"
      gameType="life"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={3}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {currentMilestone === 0 && (
                <>
                  <p className="text-white text-xl mb-6">Write 1-year goal:</p>
                  <textarea
                    value={goal}
                    onChange={handleGoalChange}
                    className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="Goal..."
                  />
                </>
              )}
              <p className="text-white text-xl mb-6">Milestone {currentMilestone + 1}:</p>
              
              <textarea
                value={milestones[currentMilestone]}
                onChange={handleMilestoneChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Milestone..."
              />
              
              <button
                onClick={handleSubmit}
                disabled={milestones[currentMilestone].trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  milestones[currentMilestone].trim() !== ""
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Set
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Plan Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your 1-year plan is set.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Pair for accountability.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OneYearPlanJournal;