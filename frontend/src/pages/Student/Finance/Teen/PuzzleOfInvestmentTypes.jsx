import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleOfInvestmentTypes = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-64");
  const gameId = gameData?.id || "finance-teens-64";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PuzzleOfInvestmentTypes, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Investment types and their characteristics
  const leftItems = [
    { id: 1, name: "FD", emoji: "🏦", description: "Fixed Deposit" },
    { id: 2, name: "Stocks", emoji: "📈", description: "Stock Market" },
    { id: 3, name: "Mutual Fund", emoji: "📊", description: "Mutual Fund" },
    { id: 4, name: "Gold", emoji: "🥇", description: "Gold Investment" },
    { id: 5, name: "Real Estate", emoji: "🏠", description: "Property Investment" }
  ];

  const rightItems = [
    { id: 1, name: "Safe", emoji: "🛡️", description: "Low risk, guaranteed return" },
    { id: 2, name: "Risky", emoji: "⚠️", description: "High risk, high return" },
    { id: 3, name: "Mixed", emoji: "⚖️", description: "Balanced risk and return" },
    { id: 4, name: "Stable", emoji: "📊", description: "Moderate risk, stable value" },
    { id: 5, name: "Long-term", emoji: "📅", description: "Best for long-term growth" }
  ];

  // Correct matches (split across different positions)
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // FD → Safe (position 1)
    { leftId: 2, rightId: 2 }, // Stocks → Risky (position 2)
    { leftId: 3, rightId: 3 }, // Mutual Fund → Mixed (position 3)
    { leftId: 4, rightId: 4 }, // Gold → Stable (position 4)
    { leftId: 5, rightId: 5 }  // Real Estate → Long-term (position 5)
  ];

  // Shuffled right items for display (to split matches)
  const shuffledRightItems = [
    rightItems[0], // Safe (id: 1) - position 1
    rightItems[2], // Mixed (id: 3) - position 2
    rightItems[4], // Long-term (id: 5) - position 3
    rightItems[1], // Risky (id: 2) - position 4
    rightItems[3]  // Stable (id: 4) - position 5
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

    resetFeedback();

    const newMatch = {
      leftId: selectedLeft.id,
      rightId: selectedRight.id,
      isCorrect: correctMatches.some(
        match => match.leftId === selectedLeft.id && match.rightId === selectedRight.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
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
    setScore(0);
    resetFeedback();
  };

  // Check if a left item is already matched
  const isLeftItemMatched = (itemId) => {
    return matches.some(match => match.leftId === itemId);
  };

  // Check if a right item is already matched
  const isRightItemMatched = (itemId) => {
    return matches.some(match => match.rightId === itemId);
  };

  // Get match result for a left item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle of Investment Types"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Match investment types to their characteristics (${matches.length}/${leftItems.length} matched)`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="finance"
      totalLevels={leftItems.length}
      currentLevel={matches.length + 1}
      maxScore={leftItems.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Investment Types */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Investment Types</h3>
              <div className="space-y-4">
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(item)}
                    disabled={isLeftItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isLeftItemMatched(item.id)
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
                        <p className="text-white/80 text-sm">{item.description}</p>
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
                    : "Select an investment type"}
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
                  <p>Score: {score}/{leftItems.length}</p>
                  <p>Matched: {matches.length}/{leftItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Characteristics */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Characteristics</h3>
              <div className="space-y-4">
                {shuffledRightItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleRightSelect(item)}
                    disabled={isRightItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRightItemMatched(item.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedRight?.id === item.id
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
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Matching!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {leftItems.length} investment types!
                  You understand investment characteristics!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  You know that FD is safe, Stocks are risky, and Mutual Funds are mixed!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {leftItems.length} investment types correctly.
                  Remember, FD → Safe, Stocks → Risky, Mutual Fund → Mixed!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to match each investment type with its appropriate characteristic. FD → Safe, Stocks → Risky, Mutual Fund → Mixed!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfInvestmentTypes;

