import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleSaveOrSpend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-4";
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

  const items = [
    { id: 1, name: "Money Bank", type: "save", emoji: "💰" },
    { id: 2, name: "Ice Cream", type: "spend", emoji: "🍦" },
    { id: 3, name: "New Bicycle", type: "save", emoji: "🚲" },
    { id: 4, name: "Candy", type: "spend", emoji: "🍬" },
    { id: 5, name: "School Books", type: "save", emoji: "📚" },
    { id: 6, name: "Study Desk", type: "save", emoji: "🪑" }
  ];

  const categories = [
    { id: "save", name: "Save", emoji: "📥", color: "from-green-500 to-emerald-600" },
    { id: "spend", name: "Spend", emoji: "📤", color: "from-red-500 to-orange-600" }
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
    
    setTimeout(() => {
      setShowResult(true);
    }, correctAnswers > 0 ? 1000 : 0);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/birthday-money-story");
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
      title="Puzzle: Save or Spend"
      subtitle="Drag items to the correct category!"
      currentLevel={4}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-4"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={items.length}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 text-center">
                Drag each item to the correct category: Save or Spend
              </p>
              
              {/* Single row layout: Save | Items | Spend */}
              <div className="flex flex-wrap items-start justify-center gap-4 mb-8">
                {/* Save Category - Left */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, categories[0])}
                  className={`bg-gradient-to-r ${categories[0].color} p-6 rounded-2xl border-2 border-dashed border-white/30 min-h-[200px] min-w-[150px] flex-shrink-0`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-3xl mr-3">{categories[0].emoji}</div>
                    <h3 className="text-2xl font-bold text-white">{categories[0].name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {getItemsForCategory(categories[0].id).map(item => (
                      <div
                        key={item.id}
                        className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center"
                      >
                        <div className="text-xl mr-2">{item.emoji}</div>
                        <span className="text-white font-medium text-sm">{item.name}</span>
                      </div>
                    ))}
                    
                    {getItemsForCategory(categories[0].id).length === 0 && (
                      <div className="text-white/70 text-center py-8 text-sm">
                        Drop items here
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Items to drag - Middle */}
                <div className="flex flex-wrap gap-4 justify-center items-start">
                  {items.map(item => (
                    !isItemDropped(item.id) && (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg cursor-move transition-all hover:scale-105 min-w-[120px]"
                      >
                        <div className="text-2xl mb-2 text-center">{item.emoji}</div>
                        <h3 className="font-bold text-center text-sm">{item.name}</h3>
                      </div>
                    )
                  ))}
                </div>
                
                {/* Spend Category - Right */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, categories[1])}
                  className={`bg-gradient-to-r ${categories[1].color} p-6 rounded-2xl border-2 border-dashed border-white/30 min-h-[200px] min-w-[150px] flex-shrink-0`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-3xl mr-3">{categories[1].emoji}</div>
                    <h3 className="text-2xl font-bold text-white">{categories[1].name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {getItemsForCategory(categories[1].id).map(item => (
                      <div
                        key={item.id}
                        className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center"
                      >
                        <div className="text-xl mr-2">{item.emoji}</div>
                        <span className="text-white font-medium text-sm">{item.name}</span>
                      </div>
                    ))}
                    
                    {getItemsForCategory(categories[1].id).length === 0 && (
                      <div className="text-white/70 text-center py-8 text-sm">
                        Drop items here
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={checkAnswers}
                  disabled={droppedItems.length === 0}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    droppedItems.length === 0
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                  }`}
                >
                  Check My Answers
                </button>
                
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-full font-bold transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
            <p className="text-white/90 text-lg mb-4">
              You correctly categorized {coins} items!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              <span>+{coins} Coins</span>
            </div>
            <p className="text-white/80 mb-6">
              Remember: Save for important things and spend on wants!
            </p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mr-4"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSaveOrSpend;