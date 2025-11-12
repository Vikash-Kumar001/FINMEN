import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DecisionMasterBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [tasks, setTasks] = useState([false, false, false, false, false]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index] = true;
    setTasks(newTasks);
    showCorrectAnswerFeedback(1, false);
    if (newTasks.every(t => t)) {
      setBadge(true);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Decision Master Badge"
      subtitle="Complete 5 tasks"
      onNext={handleNext}
      nextEnabled={showResult && badge}
      showGameOver={showResult && badge}
      score={0}
      gameId="decision-160"
      gameType="decision"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={10}
      showConfetti={showResult && badge}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Mark tasks complete:</p>
              
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => handleComplete(index)}
                    disabled={tasks[index]}
                    className={`w-full py-3 rounded-xl font-bold text-white transition ${
                      tasks[index]
                        ? 'bg-green-500 cursor-default'
                        : 'bg-blue-500 hover:opacity-90'
                    }`}
                  >
                    {tasks[index] ? '✅' : ''} Evidence-based decision {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Badge Earned!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed 5 evidence-based decisions.
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use badge for portfolio.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DecisionMasterBadge;