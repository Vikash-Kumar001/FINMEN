import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const GossipPuzzle = () => {
  const location = useLocation();
  const gameId = "dcos-kids-14";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
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

  const items = [
    {
      id: 1,
      text: "Spreading Rumors",
      emoji: "🗣️",
      correctCategory: "Hurt Feelings"
    },
    {
      id: 2,
      text: "Telling Secrets",
      emoji: "🤫",
      correctCategory: "Broken Trust"
    },
    {
      id: 3,
      text: "Gossiping",
      emoji: "💬",
      correctCategory: "Damaged Friendships"
    },
    {
      id: 4,
      text: "Making Fun of Someone",
      emoji: "😢",
      correctCategory: "Hurt Feelings"
    },
    {
      id: 5,
      text: "Sharing Private Info",
      emoji: "🔒",
      correctCategory: "Broken Trust"
    }
  ];

  const categories = [
    { id: "Hurt Feelings", emoji: "😢" },
    { id: "Broken Trust", emoji: "💔" },
    { id: "Damaged Friendships", emoji: "👥" }
  ];

  const currentItem = items[currentMatch];

  const handleConfirm = () => {
    if (!selectedCategory || answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = selectedCategory === currentItem.correctCategory;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentMatch < items.length - 1) {
        setCurrentMatch(prev => prev + 1);
        setSelectedCategory(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  return (
    <GameShell
      title="Gossip Puzzle"
      score={score}
      subtitle={!showResult ? `Item ${currentMatch + 1} of ${items.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={items.length}
      currentLevel={currentMatch + 1}
      maxScore={items.length}
      showConfetti={showResult && score === items.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <h3 className="text-white text-lg md:text-xl font-bold mb-4 text-center">
              What does this action lead to?
            </h3>
            
            <div className="bg-purple-500/20 rounded-lg p-6 mb-6 text-center">
              <div className="text-6xl md:text-8xl mb-4">{currentItem.emoji}</div>
              <div className="text-white text-xl md:text-2xl font-bold">{currentItem.text}</div>
            </div>

            <h4 className="text-white font-bold mb-4 text-center">Select the outcome:</h4>
            
            <div className="space-y-3 mb-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => !answered && setSelectedCategory(category.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && category.id === currentItem.correctCategory
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && selectedCategory === category.id && category.id !== currentItem.correctCategory
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedCategory === category.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{category.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{category.id}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedCategory || answered}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedCategory && !answered
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === items.length ? "Perfect Score! 🎉" : `You got ${score} out of ${items.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === items.length 
                ? "Excellent! You understand how gossip and rumors hurt people. Always think before you speak!"
                : "Great job! Remember that gossip and rumors can hurt feelings and break trust."}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GossipPuzzle;
