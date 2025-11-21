import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSmartVsWaste = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
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

  // Items that represent needs (smart spending) vs wants (waste)
  const leftItems = [
    { id: 1, name: "Notebook", emoji: "📚", category: "need" },
    { id: 2, name: "School Uniform", emoji: "👕", category: "need" },
    { id: 3, name: "Medicine", emoji: "💊", category: "need" },
    { id: 4, name: "Healthy Food", emoji: "🍎", category: "need" },
    { id: 5, name: "Extra Candy", emoji: "🍬", category: "want" },
    { id: 6, name: "Luxury Watch", emoji: "⌚", category: "want" }
  ];

  const rightItems = [
    { id: 1, name: "Need", emoji: "✅", description: "Important for life", color: "green" },
    { id: 2, name: "Waste", emoji: "❌", description: "Not necessary", color: "red" }
  ];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Notebook → Need
    { leftId: 2, rightId: 1 }, // School Uniform → Need
    { leftId: 3, rightId: 1 }, // Medicine → Need
    { leftId: 4, rightId: 1 }, // Healthy Food → Need
    { leftId: 5, rightId: 2 }, // Extra Candy → Waste
    { leftId: 6, rightId: 2 }  // Luxury Watch → Waste
  ];

  const handleLeftSelect = (item) => {
    if (showResult || isItemMatched(item.id)) return;
    setSelectedLeft(item);
    // Auto-match if right is already selected
    if (selectedRight) {
      handleMatch(item, selectedRight);
    }
  };

  const handleRightSelect = (item) => {
    if (showResult) return;
    setSelectedRight(item);
    // Auto-match if left is already selected
    if (selectedLeft && !isItemMatched(selectedLeft.id)) {
      handleMatch(selectedLeft, item);
    }
  };

  const handleMatch = (leftItem = selectedLeft, rightItem = selectedRight) => {
    if (!leftItem || !rightItem || showResult || isItemMatched(leftItem.id)) return;

    const newMatch = {
      leftId: leftItem.id,
      rightId: rightItem.id,
      isCorrect: correctMatches.some(
        match => match.leftId === leftItem.id && match.rightId === rightItem.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, show flash/confetti
    if (newMatch.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
      // Calculate final score with a small delay for better UX
      setTimeout(() => {
      const correctCount = newMatches.filter(match => match.isCorrect).length;
      setFinalScore(correctCount);
      setShowResult(true);
      }, 500);
    }

    // Reset selections with a small delay for visual feedback
    setTimeout(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    }, 200);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/kids/shop-story-2");
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.leftId === itemId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? match.isCorrect : null;
  };

  // Get matched category for an item
  const getMatchedCategory = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? rightItems.find(r => r.id === match.rightId) : null;
  };

  // Award 5 coins when game finishes
  useEffect(() => {
    if (showResult && finalScore > 0) {
      setCoins(5);
    }
  }, [showResult, finalScore]);

  const allItemsMatched = matches.length === leftItems.length;

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
            {['🧩', '✅', '❌', '🎯'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {showResult && finalScore >= 4 && <Confetti />}

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
              <span className="hidden xs:inline">Puzzle: Smart vs Waste</span>
              <span className="xs:hidden">Smart vs Waste</span>
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
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Match items to Needs or Wants • {matches.length}/{leftItems.length} matched
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-5xl flex-1 flex flex-col justify-center min-h-0">
        {!showResult ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Instructions */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border-2 border-purple-300 shadow-lg">
                <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">
                  <span className="font-bold text-purple-600">How to play:</span> Click an item, then click a category to match them!
                </p>
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Left column - Items to categorize */}
                <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border-2 border-purple-300 shadow-xl">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-700 mb-2 sm:mb-3 text-center">
                    Items to Match
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {leftItems.map(item => {
                      const isMatched = isItemMatched(item.id);
                      const matchResult = getMatchResult(item.id);
                      const matchedCategory = getMatchedCategory(item.id);
                      
                      return (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(item)}
                          disabled={isMatched}
                          className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl text-left transition-all transform hover:scale-[1.02] ${
                            isMatched
                              ? matchResult
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-2 border-green-500 shadow-md"
                                : "bg-gradient-to-r from-red-400 to-pink-500 text-white border-2 border-red-500 shadow-md"
                        : selectedLeft?.id === item.id
                              ? "bg-gradient-to-r from-purple-400 to-indigo-400 text-white border-2 border-purple-500 shadow-lg ring-2 ring-purple-300"
                              : "bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-gray-800 border-2 border-purple-200"
                          } ${isMatched ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                          <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 text-center">
                            <div className="text-xl sm:text-2xl md:text-3xl">{item.emoji}</div>
                            <div className="w-full">
                              <h4 className="font-bold text-xs sm:text-sm md:text-base truncate">{item.name}</h4>
                              {isMatched && matchedCategory && (
                                <p className="text-xs opacity-90 mt-0.5 truncate">
                                  → {matchedCategory.name}
                                </p>
                              )}
                            </div>
                            {isMatched && (
                              <div className="text-base sm:text-lg">
                                {matchResult ? "✓" : "✗"}
                      </div>
                            )}
                    </div>
                  </button>
                      );
                    })}
              </div>
            </div>

                {/* Middle column - Instructions/Match button */}
            <div className="flex flex-col items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl text-center w-full">
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎯</div>
                    {selectedLeft && !isItemMatched(selectedLeft.id) ? (
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-gray-700 text-xs sm:text-sm md:text-base font-semibold">
                          Selected Item:
                </p>
                        <div className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white p-2 sm:p-3 rounded-lg shadow-md animate-pulse">
                          <div className="text-2xl sm:text-3xl mb-1">{selectedLeft.emoji}</div>
                          <p className="font-bold text-xs sm:text-sm md:text-base">{selectedLeft.name}</p>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm flex items-center justify-center gap-1">
                          <span>Now select a category</span>
                          <span className="animate-bounce">→</span>
                        </p>
                      </div>
                    ) : selectedLeft && isItemMatched(selectedLeft.id) ? (
                      <div>
                        <p className="text-gray-700 text-xs sm:text-sm md:text-base font-semibold mb-2">
                          This item is already matched!
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Select another item
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 text-xs sm:text-sm md:text-base font-semibold mb-2">
                          Select an item first
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Then choose a category
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-purple-200">
                      <div className="text-gray-700 text-xs sm:text-sm">
                        <p className="font-bold text-purple-600 mb-1">Progress:</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg sm:text-xl font-bold text-purple-600">{matches.length}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-base sm:text-lg font-semibold text-gray-600">{leftItems.length}</span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${(matches.length / leftItems.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                </div>
              </div>
            </div>

            {/* Right column - Categories */}
                <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border-2 border-purple-300 shadow-xl">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-700 mb-2 sm:mb-3 text-center">
                    Categories
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                {rightItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleRightSelect(item)}
                        className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl text-left transition-all transform hover:scale-[1.02] ${
                      selectedRight?.id === item.id
                            ? item.color === "green"
                              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-2 border-green-500 shadow-lg ring-2 ring-green-300"
                              : "bg-gradient-to-r from-red-400 to-pink-500 text-white border-2 border-red-500 shadow-lg ring-2 ring-red-300"
                            : item.color === "green"
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-gray-800 border-2 border-green-200"
                            : "bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-gray-800 border-2 border-red-200"
                    }`}
                  >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{item.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base md:text-lg">{item.name}</h4>
                            <p className="text-xs sm:text-sm md:text-base opacity-80 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
                  </div>
              </div>
            </div>
          </div>
        ) : (
            /* Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl text-center">
            {finalScore >= 4 ? (
              <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎉</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🧩✅</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Excellent Matching!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You correctly matched <span className="font-bold text-green-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{leftItems.length}</span> items!
                    <br />
                    You understand the difference between needs and wants! 🎯
                </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                  You know that items like notebooks and medicine are needs, while extra candy is a want!
                </p>
                  {finalScore >= 4 && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                    >
                      <span className="hidden sm:inline">Continue to Next Level</span>
                      <span className="sm:hidden">Next Level</span> →
                    </button>
                  )}
              </div>
            ) : (
              <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🧩</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You matched <span className="font-bold text-purple-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{leftItems.length}</span> items correctly.
                    <br />
                  Remember, needs are important for life while wants are things we'd like to have!
                </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                <button
                  onClick={handleTryAgain}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                >
                    Try Again 🧩
                </button>
                  <p className="text-gray-600 text-xs sm:text-sm px-1">
                  Try to distinguish between essential items (needs) and non-essential items (wants).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Game Over Modal */}
      {showResult && finalScore >= 4 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-14"
          gameType="finance"
          totalLevels={leftItems.length}
          coinsPerLevel={1}
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

export default PuzzleSmartVsWaste;
