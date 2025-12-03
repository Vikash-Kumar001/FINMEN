import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const JournalMyBalance = () => {
  const location = useLocation();
  const gameId = "dcos-kids-29";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentTask, setCurrentTask] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
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
    {
      id: 1,
      prompt: "Today I played offline for ___ minutes.",
      emoji: "⏰"
    },
    {
      id: 2,
      prompt: "What offline activity did I enjoy the most today?",
      emoji: "⚽"
    },
    {
      id: 3,
      prompt: "How did playing offline make me feel?",
      emoji: "😊"
    },
    {
      id: 4,
      prompt: "One thing I noticed when I was away from screens:",
      emoji: "🌿"
    },
    {
      id: 5,
      prompt: "Tomorrow, I want to spend ___ minutes offline.",
      emoji: "📅"
    }
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      resetFeedback();
      
      setTimeout(() => {
        if (currentTask < tasks.length - 1) {
          setCurrentTask(prev => prev + 1);
          setJournalEntry("");
        } else {
          setShowResult(true);
        }
      }, 500);
    }
  };

  const currentTaskData = tasks[currentTask];

  return (
    <GameShell
      title="Journal: My Balance"
      score={score}
      subtitle={!showResult ? `Task ${currentTask + 1} of ${tasks.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={tasks.length}
      currentLevel={currentTask + 1}
      maxScore={tasks.length}
      showConfetti={showResult && score === tasks.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentTaskData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
              {currentTaskData.prompt}
            </h2>

            <textarea
              rows={4}
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts here... (at least 10 characters)"
              className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            ></textarea>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 10}
              className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 10
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentTask < tasks.length - 1 ? "Next ➡️" : "Finish Journal 📝"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === tasks.length ? "Perfect Reflection! 🎉" : `You completed ${score} out of ${tasks.length} tasks!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === tasks.length 
                ? "Great reflection! You completed your 'My Balance' journal and reflected on your offline time today."
                : "Great job! Writing about your balance helps you understand your screen time habits."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Remember — real fun happens offline too! You're learning to balance your screen time beautifully.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalMyBalance;
