import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleEnergySources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-14";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Puzzle: Energy Sources game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
    { id: 1, name: "Sun", type: "solar", emoji: "☀️" },
    { id: 2, name: "Wind", type: "wind", emoji: "💨" },
    { id: 3, name: "Coal", type: "dirty", emoji: "⛽" },
    { id: 4, name: "Water", type: "hydro", emoji: "💧" },
    { id: 5, name: "Oil", type: "dirty", emoji: "🛢️" }
  ];

  const categories = [
    { id: "solar", name: "Solar Energy", emoji: "☀️", color: "from-yellow-500 to-orange-600" },
    { id: "wind", name: "Wind Energy", emoji: "💨", color: "from-blue-500 to-cyan-600" },
    { id: "hydro", name: "Water Energy", emoji: "💧", color: "from-blue-400 to-blue-600" },
    { id: "dirty", name: "Dirty Energy", emoji: "🏭", color: "from-gray-500 to-gray-600" }
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
    const correctAnswers = droppedItems.filter(item => 
      item.type === item.category
    ).length;
    setCoins(correctAnswers);
    if (correctAnswers > 0) {
      showCorrectAnswerFeedback(correctAnswers, true);
    }
    if (correctAnswers === items.length) {
      showAnswerConfetti();
    }
    setTimeout(() => {
      setShowResult(true);
    }, correctAnswers > 0 ? 1000 : 0);
  };

  const handleNext = () => {
    navigate("/student/sustainability/kids/water-tap-story");
  };

  const getItemsForCategory = (categoryId) => {
    return droppedItems.filter(item => item.category === categoryId);
  };

  const isItemDropped = (itemId) => {
    return droppedItems.some(item => item.id === itemId);
  };

  return (
    <GameShell
      title="Puzzle: Energy Sources"
      subtitle="Drag energy sources to the correct category!"
      currentLevel={14}
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={items.length}
      showConfetti={showResult && coins === items.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Drag energy sources to sort them:</h3>
          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
              !isItemDropped(item.id) && (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-move transition-all transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="text-sm text-white font-semibold">{item.name}</div>
                </div>
              )
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category)}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 border-2 border-dashed border-white/30 min-h-[150px]`}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{category.emoji}</div>
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
              </div>
              <div className="space-y-2">
                {getItemsForCategory(category.id).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center"
                  >
                    <div className="text-2xl">{item.emoji}</div>
                    <div className="text-xs text-white">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {!showResult && (
          <button
            onClick={checkAnswers}
            disabled={droppedItems.length !== items.length}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Check Answers
          </button>
        )}
        {showResult && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white">Great sorting!</h3>
            <p className="text-gray-300">
              You sorted {coins} out of {items.length} energy sources correctly!
            </p>
            <p className="text-green-400 font-semibold">
              You earned {coins} coins! Keep learning about clean energy! ⚡
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleEnergySources;

