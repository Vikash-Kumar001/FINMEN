import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const EmojiReflex1 = () => {
  const location = useLocation();
  const gameId = "dcos-kids-65";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSituation, setShowSituation] = useState(true);
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
    { id: 1, text: "I love playing with my friends!", emoji: "😊", type: "positive" },
    { id: 2, text: "You look so weird today!", emoji: "😠", type: "rude" },
    { id: 3, text: "Congrats on your new puppy!", emoji: "🐶", type: "positive" },
    { id: 4, text: "That's such a dumb idea!", emoji: "😤", type: "rude" },
    { id: 5, text: "Had a great match today! ⚽", emoji: "🎉", type: "positive" }
  ];

  React.useEffect(() => {
    if (gameStarted && showSituation && !showResult) {
      const timer = setTimeout(() => {
        setShowSituation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showSituation, currentRound, showResult]);

  const handleAction = (action) => {
    if (showSituation) return;

    const situation = situations[currentRound];
    const isCorrect =
      (situation.type === "positive" && action === "tap") ||
      (situation.type === "rude" && action === "ignore");
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
        setShowSituation(true);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentSituationData = situations[currentRound];

  return (
    <GameShell
      title="Emoji Reflex1"
      score={score}
      subtitle={!showResult ? `Post ${currentRound + 1} of ${situations.length}` : "Game Complete!"}
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Tap for Kind Posts! 💬</h2>
            <p className="text-white/80 mb-6">
              If the post is <span className="text-green-400 font-semibold">positive</span>, tap fast!  
              If it's <span className="text-red-400 font-semibold">rude</span>, ignore it!
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
            {showSituation ? (
              <div className="text-center py-12">
                <div className="text-7xl md:text-9xl mb-4 animate-bounce">{currentSituationData.emoji}</div>
                <p className="text-white text-xl md:text-2xl font-bold">{currentSituationData.text}</p>
              </div>
            ) : (
              <>
                <h3 className="text-white text-lg md:text-xl font-bold mb-6 text-center">What do you do?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => handleAction("tap")}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-white font-bold text-2xl md:text-3xl">Tap 💚</div>
                  </button>
                  <button
                    onClick={() => handleAction("ignore")}
                    className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-white font-bold text-2xl md:text-3xl">Ignore 🚫</div>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === situations.length ? "Perfect Smart Scroller! 🎉" : `You reacted correctly to ${score} of ${situations.length} posts!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === situations.length 
                ? "Excellent! You always engage with positive posts and ignore rude ones!"
                : `You reacted correctly to ${score} of ${situations.length} posts!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always engage with positive posts and ignore rude ones. That's how we spread kindness online!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmojiReflex1;
