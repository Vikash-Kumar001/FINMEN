import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSaveOrSpend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Calculate back path
  const resolvedBackPath = useMemo(() => {
    if (location.state?.returnPath) {
      return location.state.returnPath;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "student" && pathSegments.length >= 3) {
      const categoryKey = pathSegments[1];
      const ageKey = pathSegments[2];

      const categorySlugMap = {
        finance: "financial-literacy",
        "financial-literacy": "financial-literacy",
      };

      const ageSlugMap = {
        kid: "kids",
        kids: "kids",
      };

      const mappedCategory = categorySlugMap[categoryKey] || categoryKey;
      const mappedAge = ageSlugMap[ageKey] || ageKey;

      return `/games/${mappedCategory}/${mappedAge}`;
    }

    return "/games";
  }, [location.pathname, location.state]);

  const handleGameOverClose = () => {
    navigate(resolvedBackPath);
  };

  const items = [
    { id: 1, name: "Piggy Bank", type: "save", emoji: "💰" },
    { id: 2, name: "Ice Cream", type: "spend", emoji: "🍦" },
    { id: 3, name: "New Bicycle", type: "save", emoji: "🚲" },
    { id: 4, name: "Candy", type: "spend", emoji: "🍬" },
    { id: 5, name: "School Books", type: "save", emoji: "📚" },
    { id: 6, name: "Video Game", type: "spend", emoji: "🎮" }
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

  const allItemsPlaced = droppedItems.length === items.length;

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
    <div className="h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Puzzle Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-lg sm:text-2xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['🧩', '🎯', '✨', '💫'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {showResult && coins >= 3 && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-purple-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-purple-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🧩</span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Puzzle: Save or Spend</span>
              <span className="xs:hidden">Save or Spend</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🧩</span>
            <span className="text-purple-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Drag items to the correct category!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Instructions */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-purple-300 shadow-md">
                <p className="text-gray-800 text-xs sm:text-sm font-semibold text-center">
                  Drag each item to the correct category: <span className="text-green-600 font-bold">Save</span> or <span className="text-red-600 font-bold">Spend</span>
                </p>
              </div>

              {/* Items to drag */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-purple-300 shadow-md">
                <h3 className="text-gray-800 text-xs sm:text-sm font-bold mb-2 text-center">Items to Sort:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {items.map(item => (
                    !isItemDropped(item.id) && (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-2 rounded-lg shadow-md cursor-move transition-all transform hover:scale-105 active:scale-95 border-2 border-purple-300"
                      >
                        <div className="text-lg sm:text-xl mb-1">{item.emoji}</div>
                        <h3 className="font-bold text-xs">{item.name}</h3>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Drop zones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(category => (
                  <div
                    key={category.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category)}
                    className={`bg-gradient-to-r ${category.color} p-3 rounded-lg sm:rounded-xl border-2 border-dashed border-white/50 min-h-[120px] sm:min-h-[140px] shadow-md`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div className="text-xl sm:text-2xl mr-2">{category.emoji}</div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{category.name}</h3>
                    </div>
                    
                    <div className="space-y-1.5">
                      {getItemsForCategory(category.id).map(item => (
                        <div
                          key={item.id}
                          className="bg-white/30 backdrop-blur-sm p-1.5 sm:p-2 rounded-md flex items-center justify-center"
                        >
                          <div className="text-base sm:text-lg mr-1.5">{item.emoji}</div>
                          <span className="text-white font-medium text-xs sm:text-sm">{item.name}</span>
                        </div>
                      ))}
                      
                      {getItemsForCategory(category.id).length === 0 && (
                        <div className="text-white/70 text-center py-3 sm:py-4 text-xs">
                          Drop items here
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-2 sm:gap-3 pt-2">
                <button
                  onClick={checkAnswers}
                  disabled={droppedItems.length === 0}
                  className={`py-2 px-4 sm:px-5 rounded-full font-bold text-xs sm:text-sm transition-all ${
                    droppedItems.length === 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md transform hover:scale-105'
                  }`}
                >
                  Check My Answers
                </button>
                
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-2 px-4 sm:px-5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all transform hover:scale-105"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            /* Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">🎉</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2 sm:mb-3">Great Job!</h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                You correctly categorized <span className="font-bold text-green-600">{coins}</span> out of <span className="font-bold">{items.length}</span> items!
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Remember: Save for important things and spend on wants!
              </p>
              {coins >= 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Continue to Next Level</span>
                  <span className="sm:hidden">Next Level</span> →
                </button>
              ) : (
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                >
                  Try Again 🧩
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {showResult && coins >= 3 && (
        <GameOverModal
          score={coins}
          gameId="finance-kids-4"
          gameType="finance"
          totalLevels={1}
          coinsPerLevel={coinsPerLevel}
          isReplay={location?.state?.isReplay || false}
          onClose={handleGameOverClose}
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default PuzzleSaveOrSpend;