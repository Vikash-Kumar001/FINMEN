import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexLearningTools = () => {
  const location = useLocation();
  const gameId = "dcos-kids-92";
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

  const tools = [
    { id: 1, text: "Dictionary App", emoji: "📖", isGood: true },
    { id: 2, text: "Spam Game", emoji: "🎮", isGood: false },
    { id: 3, text: "Language Learning App", emoji: "🌍", isGood: true },
    { id: 4, text: "Fake Prize App", emoji: "🎁", isGood: false },
    { id: 5, text: "Science Quiz App", emoji: "🔬", isGood: true }
  ];

  const handleChoice = (isGood) => {
    const currentToolData = tools[currentRound];
    const isCorrect = currentToolData.isGood === isGood;
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < tools.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentToolData = tools[currentRound];

  return (
    <GameShell
      title="Reflex Learning Tools"
      score={score}
      subtitle={!showResult ? `Tool ${currentRound + 1} of ${tools.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={tools.length}
      currentLevel={currentRound + 1}
      maxScore={tools.length}
      showConfetti={showResult && score === tools.length}
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
              Tap <span className="text-green-400 font-bold">Good Tool ✅</span> for learning apps and{" "}
              <span className="text-red-400 font-bold">Bad Tool ❌</span> for spam games.
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
            <div className="text-6xl md:text-8xl mb-4 text-center animate-pulse">{currentToolData.emoji}</div>
            <h2 className="text-white text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{currentToolData.text}</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Good Tool ✅</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 md:p-8 transition-all transform hover:scale-105"
              >
                <div className="text-white font-bold text-xl md:text-2xl">Bad Tool ❌</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🚀</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === tools.length ? "Perfect Learning Tools Hero! 🎉" : `You identified ${score} out of ${tools.length} correctly!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === tools.length 
                ? "Excellent! You can identify good learning tools perfectly!"
                : `You identified ${score} out of ${tools.length} correctly!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Good learning tools help you learn and grow. Bad tools waste your time with spam and ads!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexLearningTools;
