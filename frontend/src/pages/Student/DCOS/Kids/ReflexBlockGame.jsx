import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexBlockGame = () => {
  const location = useLocation();
  const gameId = "dcos-kids-49";
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

  const rounds = [
    { id: 1, icon: "📞", label: "Spam Call!", isSpam: true },
    { id: 2, icon: "💬", label: "Message from Friend", isSpam: false },
    { id: 3, icon: "📞", label: "Spam Call!", isSpam: true },
    { id: 4, icon: "🎮", label: "Game Invite", isSpam: false },
    { id: 5, icon: "📞", label: "Spam Call!", isSpam: true }
  ];

  const handleAction = (action) => {
    const currentRoundData = rounds[currentRound];
    const correct = (currentRoundData.isSpam && action === "block") || (!currentRoundData.isSpam && action === "ignore");
    resetFeedback();
    
    if (correct) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentRound < rounds.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentRoundData = rounds[currentRound];

  return (
    <GameShell
      title="Reflex Block Game"
      score={score}
      subtitle={!showResult ? `Round ${currentRound + 1} of ${rounds.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={rounds.length}
      currentLevel={currentRound + 1}
      maxScore={rounds.length}
      showConfetti={showResult && score === rounds.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Tap Fast to Block Spam or Ignore Safe Messages!
            </h2>
            <p className="text-white/80 mb-6">
              When you see a <strong>📞 Spam Call</strong>, tap <strong>Block 🚫</strong>.<br />
              When it's a <strong>💬 Message from Friend</strong>, tap <strong>Ignore ✅</strong>.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-6xl md:text-9xl mb-4 animate-pulse">{currentRoundData.icon}</div>
            <p className="text-white text-xl md:text-2xl font-bold mb-6 md:mb-8">
              {currentRoundData.label}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction("block")}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Block 🚫</div>
              </button>

              <button
                onClick={() => handleAction("ignore")}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-4 border-white rounded-2xl p-6 md:p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Ignore ✅</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🎯</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === rounds.length ? "Perfect Spam Defender! 🎉" : `You got ${score} out of ${rounds.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === rounds.length 
                ? "Excellent! You always block spam calls and ignore safe messages correctly!"
                : `You acted correctly ${score} out of ${rounds.length} times!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always block unknown spam calls and ignore harmless messages smartly!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexBlockGame;
