import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexDelete = () => {
  const location = useLocation();
  const gameId = "dcos-kids-62";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showImage, setShowImage] = useState(false);
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

  const photos = [
    { id: 1, emoji: "😜", caption: "Silly selfie with toothpaste on face" },
    { id: 2, emoji: "🥴", caption: "Weird dance pose caught on camera" },
    { id: 3, emoji: "🤪", caption: "Funny face photo before school" },
    { id: 4, emoji: "😅", caption: "Messy hair Monday picture" },
    { id: 5, emoji: "🙈", caption: "Goofy group photo with friends" }
  ];

  const handleTap = () => {
    if (showImage) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      resetFeedback();
    }
    nextRound();
  };

  const nextRound = () => {
    setShowImage(false);
    if (currentRound < photos.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setTimeout(() => setShowImage(true), 1000);
      }, 500);
    } else {
      setShowResult(true);
    }
  };

  React.useEffect(() => {
    if (gameStarted && !showResult && currentRound < photos.length) {
      const timer = setTimeout(() => {
        setShowImage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, currentRound, showResult]);

  const currentPhoto = photos[currentRound];

  return (
    <GameShell
      title="Reflex Delete"
      score={score}
      subtitle={!showResult ? `Round ${currentRound + 1} of ${photos.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={photos.length}
      currentLevel={currentRound + 1}
      maxScore={photos.length}
      showConfetti={showResult && score === photos.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Reflex Delete Challenge!</h2>
            <p className="text-white/80 mb-6">
              👀 Tap FAST when a silly photo appears — don't let it get posted online!
            </p>
            <button
              onClick={() => {
                setGameStarted(true);
                setTimeout(() => setShowImage(true), 1000);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            {showImage ? (
              <div
                onClick={handleTap}
                className="cursor-pointer select-none transition transform hover:scale-110"
              >
                <div className="text-7xl md:text-9xl mb-4 animate-bounce">{currentPhoto.emoji}</div>
                <p className="text-white text-lg md:text-xl font-bold mb-2">{currentPhoto.caption}</p>
                <p className="text-white/70 text-sm md:text-base">(Tap to delete before it posts!)</p>
              </div>
            ) : (
              <p className="text-white/60 text-lg py-20 animate-pulse">Waiting for photo...</p>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <div className="text-7xl mb-4">🧠</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === photos.length ? "Perfect Smart Reflexes! 🎉" : `You avoided ${score} out of ${photos.length} silly posts!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === photos.length 
                ? "Excellent! You always think before posting and delete silly photos before they go online!"
                : `You avoided ${score} out of ${photos.length} silly posts!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Think before posting! Once online, it stays forever — deleting before posting is a smart move.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexDelete;
