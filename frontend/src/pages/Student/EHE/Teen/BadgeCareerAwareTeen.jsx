import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCareerAwareTeen = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, task: "Matched passions to careers" },
    { id: 2, task: "Learned about professional roles" },
    { id: 3, task: "Explored career requirements" },
    { id: 4, task: "Understood workplace environments" },
    { id: 5, task: "Practiced career fair networking" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedTasks(5);
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowBadge(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCorrectAnswerFeedback]);

  const handleNext = () => {
    navigate("/student/ehe/teen/opportunity-story");
  };

  return (
    <GameShell
      title="Badge: Career Aware Teen"
      subtitle="Achievement Unlocked"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ehe-teen-10"
      gameType="educational"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showBadge}
      backPath="/games/entrepreneurship/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {!showBadge ? (
            <>
              <div className="text-7xl mb-4 text-center animate-pulse">🔄</div>
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                Checking your career awareness...
              </h3>
            </>
          ) : (
            <>
              <div className="text-9xl mb-4 text-center animate-bounce">🎓</div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Career Aware Teen Badge!
              </h2>

              <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  Career Exploration Completed:
                </h3>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-3"
                    >
                      <div className="text-2xl">✅</div>
                      <div className="text-white font-semibold">{task.task}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  🌟 Congratulations! You've responsibly explored 5 different career aspects. 
                  You're now career-aware and ready to make informed decisions!
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold text-center">
                Badge Earned: Career Aware Teen! 🎓
              </p>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeCareerAwareTeen;

