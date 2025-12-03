import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexAISafety1 = () => {
  const location = useLocation();
  const gameId = "dcos-kids-72";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
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
    { id: 1, text: "AI draws a cute cat 🐱", emoji: "🎨", isSafe: true },
    { id: 2, text: "AI spreads a fake rumor 💬", emoji: "🚫", isSafe: false },
    { id: 3, text: "AI helps with homework 📚", emoji: "🤖", isSafe: true },
    { id: 4, text: "AI makes a mean meme 😠", emoji: "⚠️", isSafe: false },
    { id: 5, text: "AI reminds you to rest 💤", emoji: "💡", isSafe: true }
  ];

  const handleChoice = (isSafe) => {
    const currentTaskData = tasks[currentRound];
    const isCorrect = currentTaskData.isSafe === isSafe;
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < tasks.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentTaskData = tasks[currentRound];

  return (
    <GameShell
      title="Reflex AI Safety1"
      score={score}
      subtitle={!showResult ? `Task ${currentRound + 1} of ${tasks.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={tasks.length}
      currentLevel={currentRound + 1}
      maxScore={tasks.length}
      showConfetti={showResult && score === tasks.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Test Your Reflex! ⚡</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="text-green-400 font-bold">Safe ✅</span> for helpful AI actions and{" "}
              <span className="text-red-400 font-bold">Unsafe ❌</span> for harmful ones.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Reflex Game 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center animate-pulse">{currentTaskData.emoji}</div>
            <h2 className="text-white text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{currentTaskData.text}</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Safe ✅</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Unsafe ❌</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🚀</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === tasks.length ? "Perfect AI Safety Hero! 🎉" : `You identified ${score} out of ${tasks.length} correctly!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === tasks.length 
                ? "Excellent! You can identify safe and unsafe AI actions perfectly!"
                : `You identified ${score} out of ${tasks.length} correctly!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Remember: Use AI for learning and creativity — not for harm or spreading rumors.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexAISafety1;
