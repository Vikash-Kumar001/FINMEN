import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const IdentityBadge = () => {
  const location = useLocation();
  const gameId = "dcos-teen-70";
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
      const games = getDcosTeenGames({});
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

  const identityProtectActs = [
    { id: 1, text: "Posted a positive achievement", emoji: "🎉" },
    { id: 2, text: "Shared an encouraging message", emoji: "💪" },
    { id: 3, text: "Avoided posting negative content", emoji: "🚫" },
    { id: 4, text: "Built a respectful online presence", emoji: "🌟" },
    { id: 5, text: "Helped others build positive identity", emoji: "🤝" }
  ];

  const handleCompleteTask = () => {
    if (!completedTasks.includes(identityProtectActs[currentTask].id)) {
      const newCompleted = [...completedTasks, identityProtectActs[currentTask].id];
      setCompletedTasks(newCompleted);
      showCorrectAnswerFeedback(1, true);
      
      if (newCompleted.length === identityProtectActs.length) {
        setTimeout(() => {
          setShowBadge(true);
        }, 500);
      } else {
        setTimeout(() => {
          setCurrentTask(prev => (prev + 1) % identityProtectActs.length);
        }, 500);
      }
    }
  };

  const currentAct = identityProtectActs[currentTask];
  const isCompleted = completedTasks.includes(currentAct.id);

  return (
    <GameShell
      title="Identity Badge"
      score={completedTasks.length}
      subtitle={!showBadge ? `Task ${completedTasks.length + 1} of ${identityProtectActs.length}` : "Badge Earned!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showBadge}
      gameId={gameId}
      gameType="dcos"
      totalLevels={identityProtectActs.length}
      currentLevel={completedTasks.length + 1}
      maxScore={identityProtectActs.length}
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
              Positive Identity Acts Progress
            </h2>
            
            <p className="text-white/80 mb-6 text-center">
              Complete these identity-protect acts to earn your "Positive Identity" badge!
            </p>

            <div className="space-y-3 mb-6">
              {identityProtectActs.map(act => (
                <div
                  key={act.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    completedTasks.includes(act.id)
                      ? 'bg-green-500/30 border-green-400'
                      : act.id === currentAct.id
                      ? 'bg-purple-500/30 border-purple-400 ring-2 ring-white'
                      : 'bg-white/10 border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{act.emoji}</div>
                    <div className="flex-1 text-white font-medium text-sm md:text-base">{act.text}</div>
                    {completedTasks.includes(act.id) && (
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
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white rounded-2xl p-6 md:p-8 text-center animate-pulse">
              <div className="text-7xl md:text-9xl mb-4">🌟</div>
              <h3 className="text-2xl md:text-4xl font-bold mb-3">Positive Identity Hero!</h3>
              <p className="text-lg md:text-xl mb-2">You've completed all 5 identity-protect acts!</p>
              <p className="text-white/90 text-sm md:text-base mt-4">
                You're building a positive online identity that opens doors! 🌟
              </p>
              <p className="text-white/80 text-xs md:text-sm mt-3">
                Keep building your positive identity and inspiring others!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IdentityBadge;
