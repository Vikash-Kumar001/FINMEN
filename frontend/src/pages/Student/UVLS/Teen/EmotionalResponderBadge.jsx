import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionalResponderBadge = () => {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState([false, false, false, false, false]);
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
    const newStrategies = [...strategies];
    newStrategies[index] = true;
    setStrategies(newStrategies);
    showCorrectAnswerFeedback(1, false);
    if (newStrategies.every(s => s)) {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Emotional Responder Badge"
      subtitle="Demonstrate 5 strategies"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={0}
      gameId="emotion-150"
      gameType="emotion"
      totalLevels={10}
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
              <p className="text-white text-xl mb-6">Mark strategies complete:</p>
              
              <div className="space-y-3">
                {strategies.map((strat, index) => (
                  <button
                    key={index}
                    onClick={() => handleComplete(index)}
                    disabled={strategies[index]}
                    className={`w-full py-3 rounded-xl font-bold text-white transition ${
                      strategies[index]
                        ? 'bg-green-500 cursor-default'
                        : 'bg-blue-500 hover:opacity-90'
                    }`}
                  >
                    Strategy {index + 1} {strategies[index] ? '✅' : ''}
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
              You demonstrated 5 regulation strategies.
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Provide follow-up micro-lessons.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionalResponderBadge;