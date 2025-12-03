import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexShareSafe = () => {
  const location = useLocation();
  const gameId = "dcos-kids-69";
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

  const posts = [
    { id: 1, text: "Helping animals is cool! 🐾", emoji: "❤️", safeToShare: true },
    { id: 2, text: "This rumor about my classmate… 🤐", emoji: "⚠️", safeToShare: false },
    { id: 3, text: "Happy Friendship Day everyone! 🤝", emoji: "🎉", safeToShare: true },
    { id: 4, text: "Look at this embarrassing photo 😬", emoji: "🚫", safeToShare: false },
    { id: 5, text: "Let's clean our park together 🌳", emoji: "🌟", safeToShare: true }
  ];

  const handleChoice = (shared) => {
    const currentPostData = posts[currentRound];
    const isCorrect = currentPostData.safeToShare === shared;
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < posts.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentPostData = posts[currentRound];

  return (
    <GameShell
      title="Reflex Share Safe"
      score={score}
      subtitle={!showResult ? `Post ${currentRound + 1} of ${posts.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={posts.length}
      currentLevel={currentRound + 1}
      maxScore={posts.length}
      showConfetti={showResult && score === posts.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Think Before You Share!</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="text-green-400 font-semibold">"Share"</span> only on positive, safe posts.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentPostData.emoji}</div>

            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-white/90 text-lg md:text-xl font-semibold text-center">
                "{currentPostData.text}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Share ✅</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Skip 🚫</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === posts.length ? "Perfect Safe Sharer! 🎉" : `You got ${score} out of ${posts.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === posts.length 
                ? "Excellent! You always share positive, safe posts that make others happy!"
                : `You got ${score} out of ${posts.length} correct!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always share positive, safe posts that make others happy and avoid hurtful ones.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexShareSafe;
