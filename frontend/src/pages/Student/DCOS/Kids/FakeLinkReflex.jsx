import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const FakeLinkReflex = () => {
  const location = useLocation();
  const gameId = "dcos-kids-42";
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

  const situations = [
    { id: 1, text: "You see a pop-up saying 'Free iPhone if you click!'", emoji: "📱", correctAction: "ignore" },
    { id: 2, text: "A message says 'Your account is locked! Click here to fix it!'", emoji: "🔒", correctAction: "ignore" },
    { id: 3, text: "You get a link promising free game coins!", emoji: "🎮", correctAction: "ignore" },
    { id: 4, text: "Email says 'You won a lottery!' and has a link", emoji: "💰", correctAction: "ignore" },
    { id: 5, text: "Website link looks like www.go0gle.com", emoji: "🌐", correctAction: "ignore" }
  ];

  const handleAction = (action) => {
    const situation = situations[currentRound];
    const isCorrect = action === situation.correctAction;
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentRound < situations.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentSituation = situations[currentRound];

  return (
    <GameShell
      title="Fake Link Reflex"
      score={score}
      subtitle={!showResult ? `Scenario ${currentRound + 1} of ${situations.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={situations.length}
      currentLevel={currentRound + 1}
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Spot the Fake Links!</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="font-bold text-yellow-300">"Don't Click"</span> when you see a suspicious link or pop-up.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Reflex Game ⚡
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-9xl mb-4 text-center animate-bounce">{currentSituation.emoji}</div>
            <p className="text-white text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{currentSituation.text}</p>

            <h3 className="text-white text-lg md:text-xl font-bold mb-6 text-center">Quick! What do you do?</h3>
            <button
              onClick={() => handleAction("ignore")}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
            >
              <div className="text-white font-bold text-xl md:text-3xl">Don't Click 🚫</div>
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === situations.length ? "Perfect Safe Kid! 🎉" : `You got ${score} out of ${situations.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === situations.length 
                ? "Excellent! You always avoid suspicious links!"
                : `You made the right choice ${score} out of ${situations.length} times!`}
            </p>
            <div className="bg-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always check links before clicking. Fake links can steal your info!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FakeLinkReflex;
