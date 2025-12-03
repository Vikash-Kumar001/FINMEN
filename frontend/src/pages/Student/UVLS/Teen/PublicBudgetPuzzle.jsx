import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const PublicBudgetPuzzle = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-84";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [allocations, setAllocations] = useState([0, 0, 0, 0, 0]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const needs = [
    { name: "Books", emoji: "📚" },
    { name: "Sports equipment", emoji: "⚽" },
    { name: "Computers", emoji: "💻" },
    { name: "Field trips", emoji: "🚌" },
    { name: "Cafeteria food", emoji: "🍽️" }
  ];

  const handleAllocate = (index, amount) => {
    if (answered || showResult) return;
    const newAllocations = [...allocations];
    newAllocations[index] = Math.max(0, Math.min(100, amount));
    setAllocations(newAllocations);
  };

  const handleConfirm = () => {
    if (answered || showResult) return;
    
    setAnswered(true);
    resetFeedback();
    
    const total = allocations.reduce((sum, a) => sum + a, 0);
    const isBalanced = allocations.every(a => a > 0) && total === 100;
    
    if (isBalanced) {
      setScore(5);
      showCorrectAnswerFeedback(5, true);
    } else if (total === 100) {
      setScore(3);
      showCorrectAnswerFeedback(3, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      setShowResult(true);
    }, 1000);
  };

  const total = allocations.reduce((sum, a) => sum + a, 0);
  const finalScore = score;

  return (
    <GameShell
      title="Public Budget Puzzle"
      subtitle={showResult ? "Budget Allocated!" : "Allocate 100 units to needs"}
      score={finalScore}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
      showGameOver={showResult}
      maxScore={5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={showResult && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6 text-center">Allocate budget to needs (total must equal 100):</p>
              
              <div className="space-y-4 mb-6">
                {needs.map((need, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/10 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{need.emoji}</span>
                      <span className="text-white font-medium">{need.name}</span>
                    </div>
                    <input
                      type="number"
                      value={allocations[index]}
                      onChange={(e) => handleAllocate(index, parseInt(e.target.value) || 0)}
                      className="p-2 bg-white/20 border-2 border-white/40 rounded-xl text-white w-24 text-center"
                      min="0"
                      max="100"
                      disabled={answered}
                    />
                  </div>
                ))}
              </div>
              
              <div className={`mb-4 p-4 rounded-xl text-center ${
                total === 100 ? 'bg-green-500/20 border-2 border-green-400' : 'bg-red-500/20 border-2 border-red-400'
              }`}>
                <p className="text-white text-xl font-bold">
                  Total: {total} / 100
                </p>
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={total !== 100 || answered}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  total === 100 && !answered
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PublicBudgetPuzzle;
