import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleSmartVsWaste = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-14";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
    { id: 1, name: "Need", emoji: "✅", description: "Important for life" },
    { id: 2, name: "Waste", emoji: "❌", description: "Not necessary" }
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
    if (showResult) return;
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (showResult) return;
    setSelectedRight(item);
  };

  const handleMatch = () => {
    if (!selectedLeft || !selectedRight || showResult) return;

    const newMatch = {
      leftId: selectedLeft.id,
      rightId: selectedRight.id,
      isCorrect: correctMatches.some(
        match => match.leftId === selectedLeft.id && match.rightId === selectedRight.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add coins and show flash/confetti
    if (newMatch.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
      // Calculate final score
      const correctCount = newMatches.filter(match => match.isCorrect).length;
      setFinalScore(correctCount);
      setShowResult(true);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
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

  return (
    <GameShell
      title="Puzzle: Smart vs Waste"
      score={coins}
      subtitle={showResult ? "Game Complete!" : "Match items to Needs or Wants"}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 4 or more correct
      showGameOver={showResult && finalScore >= 4}
      
      gameId="finance-kids-14"
      gameType="finance"
      totalLevels={10}
      currentLevel={4}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Items to categorize */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Items</h3>
              <div className="space-y-4">
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(item)}
                    disabled={isItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedLeft?.id === item.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedLeft 
                    ? `Selected: ${selectedLeft.name}` 
                    : "Select an item"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Coins: {coins}</p>
                  <p>Matched: {matches.length}/{leftItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Categories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Categories</h3>
              <div className="space-y-4">
                {rightItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleRightSelect(item)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedRight?.id === item.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="text-white/80 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Matching!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {finalScore} out of {leftItems.length} items!
                  You understand the difference between needs and wants!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You know that items like notebooks and medicine are needs, while extra candy is a want!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {finalScore} out of {leftItems.length} items correctly.
                  Remember, needs are important for life while wants are things we'd like to have!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to distinguish between essential items (needs) and non-essential items (wants).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSmartVsWaste;