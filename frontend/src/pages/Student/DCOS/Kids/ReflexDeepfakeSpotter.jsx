import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexDeepfakeSpotter = () => {
  const location = useLocation();
  const gameId = "dcos-kids-76";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showClip, setShowClip] = useState(true);
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

  const clips = [
    { id: 1, text: "A cartoon of a famous actor saying strange things never said before", emoji: "🎬", isFake: true },
    { id: 2, text: "A cartoon of your school teacher giving an online class", emoji: "👩‍🏫", isFake: false },
    { id: 3, text: "A cartoon of a celebrity promoting a random product", emoji: "🛍️", isFake: true },
    { id: 4, text: "A cartoon of your favorite singer performing their actual song", emoji: "🎤", isFake: false },
    { id: 5, text: "A cartoon of a politician saying weird words or jokes", emoji: "🎭", isFake: true }
  ];

  React.useEffect(() => {
    if (gameStarted && showClip && !showResult) {
      const timer = setTimeout(() => {
        setShowClip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showClip, currentRound, showResult]);

  const handleAction = (action) => {
    if (showClip) return;

    const currentClip = clips[currentRound];
    const isCorrect = (currentClip.isFake && action === "spot") || (!currentClip.isFake && action === "ignore");
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < clips.length - 1) {
        setCurrentRound(prev => prev + 1);
        setShowClip(true);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentClipData = clips[currentRound];

  return (
    <GameShell
      title="Reflex Deepfake Spotter"
      score={score}
      subtitle={!showResult ? `Clip ${currentRound + 1} of ${clips.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={clips.length}
      currentLevel={currentRound + 1}
      maxScore={clips.length}
      showConfetti={showResult && score === clips.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Spot Deepfakes in Time!</h2>
            <p className="text-white/80 mb-6">
              Watch cartoon clips carefully. Tap <span className="font-bold text-yellow-400">"Spot Fake"</span> if the video looks fake!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🎥
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            {showClip ? (
              <div className="text-center py-12">
                <div className="text-7xl md:text-9xl mb-4 animate-pulse">{currentClipData.emoji}</div>
                <p className="text-white text-xl md:text-2xl font-bold">{currentClipData.text}</p>
              </div>
            ) : (
              <>
                <h3 className="text-white text-lg md:text-xl font-bold mb-6 text-center">What do you do?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction("spot")}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-white font-bold text-2xl md:text-3xl text-center">Spot Fake 🚨</div>
                  </button>
                  <button
                    onClick={() => handleAction("ignore")}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-white font-bold text-2xl md:text-3xl text-center">Looks Real 👍</div>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === clips.length ? "Perfect Great Spotter! 🎉" : `You spotted ${score} out of ${clips.length} correctly!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === clips.length 
                ? "Excellent! You can spot deepfakes perfectly!"
                : `You spotted ${score} out of ${clips.length} correctly!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Deepfakes can look real, but always check for weird lips, voices, or lighting. Stay alert online!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexDeepfakeSpotter;
