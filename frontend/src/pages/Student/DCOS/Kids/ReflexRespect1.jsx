import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ReflexRespect1 = () => {
  const location = useLocation();
  const gameId = "dcos-kids-82";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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

  const words = [
    { id: 1, text: "Thank you", emoji: "🙏", isKind: true },
    { id: 2, text: "Idiot", emoji: "😠", isKind: false },
    { id: 3, text: "Good job", emoji: "👏", isKind: true },
    { id: 4, text: "Loser", emoji: "😞", isKind: false },
    { id: 5, text: "Nice work", emoji: "🌟", isKind: true }
  ];

  const handleChoice = (isKind) => {
    const currentWordData = words[currentRound];
    const isCorrect = currentWordData.isKind === isKind;
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < words.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentWordData = words[currentRound];

  return (
    <GameShell
      title="Reflex Respect1"
      score={score}
      subtitle={!showResult ? `Word ${currentRound + 1} of ${words.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={words.length}
      currentLevel={currentRound + 1}
      maxScore={words.length}
      showConfetti={showResult && score === words.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Reflex Challenge #{currentRound + 1}
            </h2>
            <p className="text-white/80 mb-6">
              Word appears — tap fast for the right response!
            </p>

            <div className="text-5xl md:text-6xl font-extrabold text-yellow-300 mb-8 md:mb-10">
              "{currentWordData.text}"
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="w-full py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl text-white transition bg-green-500/60 hover:bg-green-500/80"
              >
                👍 Respect (Kind)
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="w-full py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl text-white transition bg-red-500/60 hover:bg-red-500/80"
              >
                🚫 Disrespect (Mean)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === words.length ? "Perfect Respect Hero! 🎉" : `You got ${score} out of ${words.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === words.length 
                ? "Excellent! You spotted kind words quickly. Respectful speech makes everyone feel valued!"
                : "Great job! Keep practicing to identify respectful words!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Amazing reflex! You spotted kind words quickly. Respectful speech makes everyone feel valued. 💬
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexRespect1;
