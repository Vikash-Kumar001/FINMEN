import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleSortWaste = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-4";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
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
      console.log(`🎮 Puzzle: Sort the Waste game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
    { id: 1, name: "Plastic Bottle", type: "recycle", emoji: "🥤" },
    { id: 2, name: "Apple Core", type: "compost", emoji: "🍎" },
    { id: 3, name: "Broken Toy", type: "trash", emoji: "🧸" },
    { id: 4, name: "Glass Jar", type: "recycle", emoji: "🍯" },
    { id: 5, name: "Banana Peel", type: "compost", emoji: "🍌" },
    { id: 6, name: "Used Tissue", type: "trash", emoji: "🧻" }
  ];

  const categories = [
    { id: "recycle", name: "Recycle", emoji: "♻️", color: "from-blue-500 to-cyan-600" },
    { id: "compost", name: "Compost", emoji: "🌱", color: "from-green-500 to-emerald-600" },
    { id: "trash", name: "Trash", emoji: "🗑️", color: "from-gray-500 to-gray-600" }
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
        // Remove if already exists
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
    navigate("/student/sustainability/kids/litter-story");
  };

  const resetGame = () => {
    setDroppedItems([]);
    setShowResult(false);
    setCoins(0);
    resetFeedback();
  };

  const getItemsForCategory = (categoryId) => {
    return droppedItems.filter(item => item.category === categoryId);
  };

  const isItemDropped = (itemId) => {
    return droppedItems.some(item => item.id === itemId);
  };

  return (
    <GameShell
      title="Puzzle: Sort the Waste"
      subtitle="Drag items to the correct category!"
      currentLevel={4}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      coins={coins}
      onNext={showResult ? handleNext : null}
      gameId={gameId}
      gameType="sustainability"
      score={coins}
      showGameOver={showResult}
      maxScore={items.length}
      showConfetti={showResult && coins === items.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      <div className="space-y-6">
        {/* Items to drag */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Drag items to sort them:</h3>
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

        {/* Drop zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category)}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 border-2 border-dashed border-white/30 min-h-[200px]`}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{category.emoji}</div>
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
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
              You sorted {coins} out of {items.length} items correctly!
            </p>
            <p className="text-green-400 font-semibold">
              You earned {coins} coins! Keep sorting waste properly! ♻️
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSortWaste;

