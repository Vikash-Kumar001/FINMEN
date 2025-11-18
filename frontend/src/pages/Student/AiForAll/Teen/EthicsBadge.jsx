import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EthicsBadge = () => {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti } = useGameFeedback();

  const ethicsTasks = [
    { id: 1, text: "Reported online bullying" },
    { id: 2, text: "Refused to share fake news" },
    { id: 3, text: "Respected others' privacy online" },
    { id: 4, text: "Gave credit for others' work" },
    { id: 5, text: "Used AI tools responsibly" },
  ];

  const handleTaskComplete = (id) => {
    if (completed < 5) {
      setCompleted((prev) => prev + 1);
    }
    if (completed + 1 === 5) {
      setShowFeedback(true);
      setCoins(20);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-human-roles-story");
  };

  return (
    <GameShell
      title="Ethics Badge"
      subtitle="Recognition of Ethical Choices"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback}
      score={coins}
      gameId="ai-teen-91"
      gameType="achievement"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl text-center mb-6">🏅</div>
            <h2 className="text-center text-3xl text-white font-bold mb-4">
              Complete 5 Ethics Activities
            </h2>

            <div className="space-y-4">
              {ethicsTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskComplete(task.id)}
                  disabled={completed >= task.id}
                  className={`w-full text-left px-6 py-4 rounded-xl border transition-all ${
                    completed >= task.id
                      ? "bg-green-600/40 border-green-400 text-white line-through"
                      : "bg-purple-500/20 border-purple-400 text-white hover:bg-purple-500/40"
                  }`}
                >
                  ✅ {task.text}
                </button>
              ))}
            </div>

            <p className="text-center text-yellow-300 font-semibold mt-6">
              Progress: {completed}/5 completed
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ethics Badge Earned!
            </h2>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white">
                You’ve shown great responsibility and ethical awareness in your actions.
                Keep being a digital role model! 🌍
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 20 Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EthicsBadge;
