import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const EyeStrainReflex = () => {
  const location = useLocation();
  const gameId = "dcos-kids-24";
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
    {
      id: 1,
      text: "You've been looking at your screen for 25 minutes.",
      emoji: "💻",
      correctAction: "rest"
    },
    {
      id: 2,
      text: "You just started a new online video.",
      emoji: "🎬",
      correctAction: "wait"
    },
    {
      id: 3,
      text: "Your eyes feel dry and tired.",
      emoji: "🥱",
      correctAction: "rest"
    },
    {
      id: 4,
      text: "You took a short 5-minute break recently.",
      emoji: "🕒",
      correctAction: "wait"
    },
    {
      id: 5,
      text: "You've been studying for 30 minutes straight.",
      emoji: "📖",
      correctAction: "rest"
    }
  ];

  const handleAction = (action) => {
    const situation = situations[currentRound];
    const isCorrect = situation.correctAction === action;
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
      title="Eye Strain Reflex"
      score={score}
      subtitle={!showResult ? `Situation ${currentRound + 1} of ${situations.length}` : "Game Complete!"}
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Your Eyes Healthy!</h2>
            <p className="text-white/80 mb-6">
              Watch the screen and tap "Rest 💤" when it's time to take a break.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 👀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center animate-pulse">{currentSituation.emoji}</div>
            <p className="text-white text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{currentSituation.text}</p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleAction("rest")}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Tap Rest 💤</div>
              </button>

              <button
                onClick={() => handleAction("wait")}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Keep Watching 👁️</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === situations.length ? "Perfect Eye Care! 🎉" : `You got ${score} out of ${situations.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === situations.length 
                ? "Excellent! You always know when to rest your eyes!"
                : `You made the right eye choices ${score} out of ${situations.length} times!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Resting your eyes every 20 minutes keeps them healthy and prevents strain. Great job staying aware!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EyeStrainReflex;
