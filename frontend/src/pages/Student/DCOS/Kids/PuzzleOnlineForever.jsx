import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const PuzzleOnlineForever = () => {
  const location = useLocation();
  const gameId = "dcos-kids-63";
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
    { id: 1, item: "A photo you post online", emoji: "📸", correctCategory: "Stays Forever" },
    { id: 2, item: "Your homework notebook", emoji: "📒", correctCategory: "Can Be Erased" },
    { id: 3, item: "A story shared on social media", emoji: "📱", correctCategory: "Stays Forever" },
    { id: 4, item: "A paper drawing at home", emoji: "🖍️", correctCategory: "Can Be Erased" },
    { id: 5, item: "A comment on someone's post", emoji: "💬", correctCategory: "Stays Forever" }
  ];

  const categories = ["Stays Forever", "Can Be Erased"];

  const handleConfirm = () => {
    if (!selectedCategory || answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const item = items[currentMatch];
    const isCorrect = selectedCategory === item.correctCategory;
    
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

  const currentItem = items[currentMatch];

  return (
    <GameShell
      title="Online Forever Puzzle"
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
            <div className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl p-6 mb-6">
              <div className="text-6xl md:text-8xl mb-3 text-center">{currentItem.emoji}</div>
              <p className="text-white text-xl md:text-2xl font-bold text-center">
                {currentItem.item}
              </p>
            </div>

            <p className="text-white/90 mb-4 text-center text-lg">
              Does this stay forever online or can it be erased?
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => !answered && setSelectedCategory(category)}
                  disabled={answered}
                  className={`border-2 rounded-xl p-5 md:p-6 transition-all ${
                    answered && category === currentItem.correctCategory
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && selectedCategory === category && category !== currentItem.correctCategory
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedCategory === category
                      ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-bold text-lg md:text-xl">{category}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedCategory || answered}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedCategory && !answered
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌐</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === items.length ? "Perfect Smart Poster! 🎉" : `You got ${score} out of ${items.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === items.length 
                ? "Excellent! You understand what stays forever online and what can be erased!"
                : `You matched ${score} out of ${items.length} correctly!`}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💭 Once you post something online, it can stay forever — think before you post!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOnlineForever;
