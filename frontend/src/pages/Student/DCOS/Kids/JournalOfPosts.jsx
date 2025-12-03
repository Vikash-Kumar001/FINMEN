import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const JournalOfPosts = () => {
  const location = useLocation();
  const gameId = "dcos-kids-68";
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
      prompt: "One good thing I can share online is my art 🎨",
      emoji: "🎨"
    },
    {
      id: 2,
      prompt: "One good thing I can share online is kindness 😊",
      emoji: "😊"
    },
    {
      id: 3,
      prompt: "One good thing I can share online is helpful advice 💡",
      emoji: "💡"
    },
    {
      id: 4,
      prompt: "One good thing I can share online is my learning journey 📚",
      emoji: "📚"
    },
    {
      id: 5,
      prompt: "One good thing I can share online is positive news 🌈",
      emoji: "🌈"
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
      title="Journal of Posts"
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
              Write About What's Good to Share Online
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Prompt {currentTask + 1} of {tasks.length}</p>
              <p className="text-white text-lg md:text-xl font-semibold">
                {currentTaskData.prompt}
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts here... (at least 10 characters)"
              className="w-full h-32 md:h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={200}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/200 characters
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 10}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 10
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentTask < tasks.length - 1 ? "Next Prompt ➡️" : "Finish Journal ✍️"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === tasks.length ? "Perfect Reflections! 🎉" : `You completed ${score} out of ${tasks.length} tasks!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === tasks.length 
                ? "Excellent! Your reflections show kindness and responsibility online!"
                : "Great job! Keep learning about positive online sharing!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Your reflections show kindness and responsibility online!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfPosts;
