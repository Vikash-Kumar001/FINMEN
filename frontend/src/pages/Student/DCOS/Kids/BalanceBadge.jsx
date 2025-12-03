import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const BalanceBadge = () => {
  const location = useLocation();
  const gameId = "dcos-kids-30";
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

  const balanceHabits = [
    { id: 1, text: "Played offline for 30 minutes", emoji: "⚽" },
    { id: 2, text: "Took a screen break after 1 hour", emoji: "🕒" },
    { id: 3, text: "Read a book instead of using the phone", emoji: "📖" },
    { id: 4, text: "Went to bed before 10 PM", emoji: "🌙" },
    { id: 5, text: "Spent time with family without screens", emoji: "👨‍👩‍👧‍👦" }
  ];

  const handleCompleteTask = () => {
    if (!completedTasks.includes(balanceHabits[currentTask].id)) {
      const newCompleted = [...completedTasks, balanceHabits[currentTask].id];
      setCompletedTasks(newCompleted);
      showCorrectAnswerFeedback(1, true);
      
      if (newCompleted.length === balanceHabits.length) {
        setTimeout(() => {
          setShowBadge(true);
        }, 500);
      } else {
        setTimeout(() => {
          setCurrentTask(prev => (prev + 1) % balanceHabits.length);
        }, 500);
      }
    }
  };

  const currentHabit = balanceHabits[currentTask];
  const isCompleted = completedTasks.includes(currentHabit.id);

  return (
    <GameShell
      title="Balance Badge"
      score={completedTasks.length}
      subtitle={!showBadge ? `Task ${completedTasks.length + 1} of ${balanceHabits.length}` : "Badge Earned!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showBadge}
      gameId={gameId}
      gameType="dcos"
      totalLevels={balanceHabits.length}
      currentLevel={completedTasks.length + 1}
      maxScore={balanceHabits.length}
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
              Balance Challenge: Stay Healthy with Screens!
            </h2>

            <p className="text-white/80 mb-6 text-center">
              Complete these balanced habits to earn your badge!
            </p>

            <div className="space-y-3 mb-6">
              {balanceHabits.map((habit) => (
                <div
                  key={habit.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    completedTasks.includes(habit.id)
                      ? 'bg-green-500/30 border-green-400'
                      : habit.id === currentHabit.id
                      ? 'bg-purple-500/30 border-purple-400 ring-2 ring-white'
                      : 'bg-white/10 border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{habit.emoji}</div>
                    <div className="flex-1 text-white font-medium text-sm md:text-base">{habit.text}</div>
                    {completedTasks.includes(habit.id) && (
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
                Mark "{currentHabit.text}" as Complete
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="bg-gradient-to-r from-green-400 via-blue-400 to-teal-400 text-white rounded-2xl p-8 text-center animate-pulse">
              <div className="text-9xl mb-4">⚖️</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Congratulations!</h3>
              <p className="text-lg md:text-xl mb-4">
                You've earned the <strong>Balanced Kid Badge!</strong> 🌈
              </p>
              <p className="text-white/90 text-sm">
                Great job! You're living a balanced life with screens!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BalanceBadge;
