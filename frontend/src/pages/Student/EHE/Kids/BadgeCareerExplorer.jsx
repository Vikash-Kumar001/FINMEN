import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCareerExplorer = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, task: "Identified Doctor's job" },
    { id: 2, task: "Matched jobs correctly" },
    { id: 3, task: "Learned about careers" },
    { id: 4, task: "Explored dream jobs" },
    { id: 5, task: "Understood job roles" }
  ];

  useEffect(() => {
    // Simulate that user has completed previous tasks
    const timer = setTimeout(() => {
      setCompletedTasks(5);
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowBadge(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCorrectAnswerFeedback]);

  const handleNext = () => {
    navigate("/student/ehe/kids/idea-story");
  };

  return (
    <GameShell
      title="Badge: Career Explorer Kid"
      subtitle="Achievement Unlocked"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ehe-kids-10"
      gameType="educational"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showBadge}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {!showBadge ? (
            <>
              <div className="text-7xl mb-4 text-center animate-pulse">🔄</div>
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                Checking your progress...
              </h3>
            </>
          ) : (
            <>
              <div className="text-9xl mb-4 text-center animate-bounce">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Career Explorer Kid Badge!
              </h2>

              <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  Completed Tasks:
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
                  🌟 Congratulations! You've successfully identified 5 different jobs and learned 
                  about various careers. Keep exploring the world of work!
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold text-center">
                Badge Earned: Career Explorer Kid! 🏆
              </p>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeCareerExplorer;

