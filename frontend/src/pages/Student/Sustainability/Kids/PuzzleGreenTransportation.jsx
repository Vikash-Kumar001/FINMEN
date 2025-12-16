import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleGreenTransportation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "sustainability-kids-24";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
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
      const games = getSustainabilityKidsGames({});
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

  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Puzzle: Green Transportation game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, coins, gameId, nextGamePath, nextGameId]);

  const items = [
    { id: 1, name: "Bike", type: "clean", emoji: "🚲" },
    { id: 2, name: "Car", type: "pollutes", emoji: "🚗" },
    { id: 3, name: "Walk", type: "healthy", emoji: "🚶" },
    { id: 4, name: "Bus", type: "clean", emoji: "🚌" },
    { id: 5, name: "Scooter", type: "healthy", emoji: "🛴" },
    { id: 6, name: "Truck", type: "pollutes", emoji: "🚚" }
  ];

  const categories = [
    { id: "clean", name: "Clean", emoji: "🌱", color: "from-green-500 to-emerald-600" },
    { id: "healthy", name: "Healthy", emoji: "💪", color: "from-blue-500 to-cyan-600" },
    { id: "pollutes", name: "Pollutes", emoji: "💨", color: "from-red-500 to-pink-600" }
  ];

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (draggedItem) {
      const newItem = { ...draggedItem, category: category.id };
      setDroppedItems(prev => {
        const filtered = prev.filter(item => item.id !== draggedItem.id);
        return [...filtered, newItem];
      });
      setDraggedItem(null);
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    items.forEach(item => {
      const dropped = droppedItems.find(d => d.id === item.id);
      if (dropped && dropped.category === item.type) {
        correct++;
      }
    });
    
    setCoins(correct);
    resetFeedback();
    if (correct > 0) {
      showCorrectAnswerFeedback(correct, true);
    }
    setShowResult(true);
  };

  const availableItems = items.filter(item => !droppedItems.find(d => d.id === item.id));

  return (
    <GameShell
      title="Puzzle: Green Transportation"
      score={coins}
      subtitle={!showResult ? "Match transportation to categories" : "Puzzle Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={1}
      currentLevel={1}
      maxScore={items.length}
      showConfetti={showResult && coins >= items.length - 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && (
          <>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-lg mb-4">Drag items to the correct category:</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {availableItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl cursor-move hover:scale-105 transition-transform text-center"
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-semibold">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category)}
                  className={`bg-gradient-to-r ${category.color} rounded-2xl p-6 min-h-[200px] text-white`}
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h3 className="text-xl font-bold mb-4">{category.name}</h3>
                  <div className="space-y-2">
                    {droppedItems
                      .filter(item => item.category === category.id)
                      .map((item) => (
                        <div key={item.id} className="bg-white/20 p-2 rounded-lg flex items-center gap-2">
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={checkAnswers}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Check Answers
            </button>
          </>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleGreenTransportation;

