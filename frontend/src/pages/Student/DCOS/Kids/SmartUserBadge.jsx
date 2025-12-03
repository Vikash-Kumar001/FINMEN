import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const SmartUserBadge = () => {
  const location = useLocation();
  const gameId = "dcos-kids-100";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  const tasks = [
    { id: 1, text: "Used an app to learn something new", emoji: "📱" },
    { id: 2, text: "Watched an educational video", emoji: "🎓" },
    { id: 3, text: "Created something using tech (drawing, coding, etc.)", emoji: "💻" },
    { id: 4, text: "Helped someone using technology", emoji: "🤝" },
    { id: 5, text: "Used screen time wisely and took breaks", emoji: "🕒" }
  ];

  const handleCompleteTask = () => {
    if (!completedTasks.includes(tasks[currentTask].id)) {
      const newCompleted = [...completedTasks, tasks[currentTask].id];
      setCompletedTasks(newCompleted);
      showCorrectAnswerFeedback(1, true);
      
      if (newCompleted.length === tasks.length) {
        setTimeout(() => {
          setShowBadge(true);
        }, 500);
      } else {
        setTimeout(() => {
          setCurrentTask(prev => (prev + 1) % tasks.length);
        }, 500);
      }
    }
  };

  const currentAct = tasks[currentTask];
  const isCompleted = completedTasks.includes(currentAct.id);

  return (
    <GameShell
      title="Smart User Badge"
      score={completedTasks.length}
      subtitle={!showBadge ? `Task ${completedTasks.length + 1} of ${tasks.length}` : "Badge Earned!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showBadge}
      gameId={gameId}
      gameType="dcos"
      totalLevels={tasks.length}
      currentLevel={completedTasks.length + 1}
      maxScore={tasks.length}
      showConfetti={showBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
              Smart Tech Habits Challenge
            </h2>

            <p className="text-white/80 mb-6 text-center">
              Complete these productive tech acts to earn your badge!
            </p>

            <div className="space-y-3 mb-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    completedTasks.includes(task.id)
                      ? 'bg-green-500/30 border-green-400'
                      : task.id === currentAct.id
                      ? 'bg-purple-500/30 border-purple-400 ring-2 ring-white'
                      : 'bg-white/10 border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{task.emoji}</div>
                    <div className="flex-1 text-white font-medium text-sm md:text-base">{task.text}</div>
                    {completedTasks.includes(task.id) && (
                      <div className="text-2xl">✅</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!isCompleted && (
              <button
                onClick={handleCompleteTask}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Mark "{currentAct.text}" as Complete
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl p-8 text-center animate-pulse">
              <div className="text-9xl mb-4">🎖️</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Congratulations!</h3>
              <p className="text-lg md:text-xl mb-4">
                You've earned the <strong>Smart User Badge!</strong> 🌟
              </p>
              <p className="text-white/90 text-sm">
                Great job! You unlocked all 5 tech posters! You're officially a Smart Digital User.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartUserBadge;
