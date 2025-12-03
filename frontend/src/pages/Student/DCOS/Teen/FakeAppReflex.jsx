import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const FakeAppReflex = () => {
  const location = useLocation();
  const gameId = "dcos-teen-53";
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

  const appRequests = [
    { id: 1, text: "App asks for contacts & camera access", emoji: "📱", shouldIgnore: true },
    { id: 2, text: "Camera app needs camera permission", emoji: "📷", shouldIgnore: false },
    { id: 3, text: "Game app wants contacts & location", emoji: "🎮", shouldIgnore: true },
    { id: 4, text: "Photo editor needs photo access", emoji: "🖼️", shouldIgnore: false },
    { id: 5, text: "Calculator app requests contacts", emoji: "🔢", shouldIgnore: true }
  ];

  const handleAction = (shouldIgnore) => {
    const currentRequest = appRequests[currentRound];
    const isCorrect = currentRequest.shouldIgnore === shouldIgnore;
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < appRequests.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentRequest = appRequests[currentRound];

  return (
    <GameShell
      title="Fake App Reflex"
      score={score}
      subtitle={!showResult ? `Request ${currentRound + 1} of ${appRequests.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={appRequests.length}
      currentLevel={currentRound + 1}
      maxScore={appRequests.length}
      showConfetti={showResult && score === appRequests.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Ignore Suspicious App Permissions!</h2>
            <p className="text-white/80 mb-6">Tap 'Ignore' when apps ask for unnecessary permissions, 'Allow' only for legitimate needs!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center animate-bounce">{currentRequest.emoji}</div>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-white text-xl md:text-2xl font-bold text-center">"{currentRequest.text}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction(true)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Ignore 🚫</div>
              </button>
              <button
                onClick={() => handleAction(false)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Allow ✓</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">📱</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === appRequests.length ? "Perfect Permission Protector! 🎉" : `You got ${score} out of ${appRequests.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === appRequests.length 
                ? "Excellent! Apps should only ask for permissions they actually need. A calculator doesn't need contacts, a game doesn't need your location, and most apps don't need camera access. Only allow permissions that make sense for what the app does!"
                : `You identified ${score} out of ${appRequests.length} correctly!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Only allow app permissions that are necessary for the app's function!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FakeAppReflex;
