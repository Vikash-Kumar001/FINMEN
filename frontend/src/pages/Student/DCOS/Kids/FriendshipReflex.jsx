import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const FriendshipReflex = () => {
  const location = useLocation();
  const gameId = "dcos-kids-19";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
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

  const situations = [
    { id: 1, text: "A classmate is being teased online", emoji: "😢", needsHelp: true },
    { id: 2, text: "Your friend got a new haircut", emoji: "💇", needsHelp: false },
    { id: 3, text: "Someone is spreading rumors", emoji: "🗣️", needsHelp: true },
    { id: 4, text: "A friend shares good news", emoji: "🎉", needsHelp: false },
    { id: 5, text: "Someone is left out of a game", emoji: "🎮", needsHelp: true }
  ];

  const handleAction = (action) => {
    const situation = situations[currentSituation];
    const isCorrect = (action === "stand" && situation.needsHelp) || (action === "celebrate" && !situation.needsHelp);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentSituation < situations.length - 1) {
        setCurrentSituation(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentSituationData = situations[currentSituation];

  return (
    <GameShell
      title="Friendship Reflex"
      score={score}
      subtitle={!showResult ? `Situation ${currentSituation + 1} of ${situations.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={situations.length}
      currentLevel={currentSituation + 1}
      maxScore={situations.length}
      showConfetti={showResult && score === situations.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Stand With Your Friend!</h2>
            <p className="text-white/80 mb-6">When you see bullying or someone needing help, tap "Stand with Friend"! When it's good news, tap "Celebrate"!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6 text-center animate-pulse">{currentSituationData.emoji}</div>
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">{currentSituationData.text}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleAction("stand")}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Stand with Friend 💪</div>
              </button>
              <button
                onClick={() => handleAction("celebrate")}
                className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Celebrate 🎉</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === situations.length ? "🎉 Perfect Friend!" : `You got ${score} out of ${situations.length}!`}
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-4">
              {score === situations.length 
                ? "You're a true friend! You always stand up for others and celebrate their successes!"
                : `You stood with your friends ${score} out of ${situations.length} times!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always stand up for your friends when they need help. True friends support each other!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendshipReflex;
