import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleWasteHierarchy = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-14");
  const gameId = gameData?.id || "sustainability-teens-14";
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [order, setOrder] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Puzzle: Waste Hierarchy game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const strategies = [
    { id: 1, name: "Reduce", emoji: "📉", correctOrder: 1 },
    { id: 2, name: "Reuse", emoji: "♻️", correctOrder: 2 },
    { id: 3, name: "Recycle", emoji: "🔄", correctOrder: 3 },
    { id: 4, name: "Dispose", emoji: "🗑️", correctOrder: 4 }
  ];

  const handleDrag = (strategy) => {
    if (order.includes(strategy.id)) return;
    setOrder([...order, strategy.id]);
  };

  const checkOrder = () => {
    const correct = order.every((id, index) => {
      const strategy = strategies.find(s => s.id === id);
      return strategy.correctOrder === index + 1;
    });
    if (correct && order.length === strategies.length) {
      setScore(strategies.length);
      showCorrectAnswerFeedback(strategies.length, true);
      setTimeout(() => setShowResult(true), 1000);
    }
  };

  const resetGame = () => {
    setOrder([]);
    setScore(0);
    setShowResult(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Puzzle: Waste Hierarchy"
      score={score}
      subtitle="Arrange waste strategies in priority order!"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={1}
      currentLevel={1}
      maxScore={strategies.length}
      showConfetti={showResult && score === strategies.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult ? (
          <>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Available Strategies:</h3>
              <div className="grid grid-cols-2 gap-4">
                {strategies.filter(s => !order.includes(s.id)).map(strategy => (
                  <button
                    key={strategy.id}
                    onClick={() => handleDrag(strategy)}
                    className="bg-blue-500/20 p-4 rounded-lg border border-blue-400"
                  >
                    <span className="text-2xl mr-2">{strategy.emoji}</span>
                    <span className="text-white">{strategy.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Priority Order:</h3>
              <div className="space-y-2">
                {order.map((id, index) => {
                  const strategy = strategies.find(s => s.id === id);
                  return (
                    <div key={id} className="bg-green-500/20 p-4 rounded-lg border border-green-400">
                      {index + 1}. <span className="text-2xl mr-2">{strategy.emoji}</span>
                      <span className="text-white">{strategy.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={checkOrder}
              disabled={order.length !== strategies.length}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              Check Order
            </button>
          </>
        ) : (
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Great job!</h3>
            <p>You correctly ordered {score} out of {strategies.length} strategies!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleWasteHierarchy;

