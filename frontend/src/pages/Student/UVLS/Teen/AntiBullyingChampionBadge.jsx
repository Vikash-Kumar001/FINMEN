import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AntiBullyingChampionBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [actions, setActions] = useState([false, false, false, false, false]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, showResult]);

  const handleComplete = (index) => {
    const newActions = [...actions];
    newActions[index] = true;
    setActions(newActions);
    showCorrectAnswerFeedback(1, false);
    if (newActions.every(a => a)) {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Anti-Bullying Champion Badge"
      subtitle="Implement 5 actions"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={0}
      gameId="bully-140"
      gameType="bully"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={10}
      showConfetti={showResult}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6">Mark actions as complete:</p>
              
              <div className="space-y-3">
                {actions.map((act, index) => (
                  <button
                    key={index}
                    onClick={() => handleComplete(index)}
                    disabled={actions[index]}
                    className={`w-full py-3 rounded-xl font-bold text-white transition ${
                      actions[index]
                        ? 'bg-green-500 cursor-default'
                        : 'bg-blue-500 hover:opacity-90'
                    }`}
                  >
                    Action {index + 1} {actions[index] ? '✅' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Achievement Unlocked!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You implemented 5 anti-bullying actions.
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Celebrate in school assembly.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AntiBullyingChampionBadge;