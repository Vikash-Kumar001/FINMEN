import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleRightVsWrong = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-94");
  const gameId = gameData?.id || "finance-teens-94";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PuzzleRightVsWrong, using fallback ID");
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

  // Financial actions and their ethical outcomes
  const leftItems = [
    { id: 1, name: "Donating to Charity", emoji: "💝", description: "Giving money to help others" },
    { id: 2, name: "Stealing Money", emoji: "😈", description: "Taking money illegally" },
    { id: 3, name: "Honest Financial Reporting", emoji: "✅", description: "Telling truth about finances" },
    { id: 4, name: "Paying Bribes", emoji: "💰", description: "Giving money for illegal favors" },
    { id: 5, name: "Fair Business Deal", emoji: "🤝", description: "Equal and honest transaction" }
  ];

  const rightItems = [
    { id: 1, name: "Ethical - Helps Others", emoji: "✨", description: "Moral and beneficial action" },
    { id: 2, name: "Unethical - Illegal", emoji: "❌", description: "Wrong and punishable action" },
    { id: 3, name: "Ethical - Builds Trust", emoji: "✨", description: "Honest and trustworthy action" },
    { id: 4, name: "Unethical - Corrupt", emoji: "❌", description: "Dishonest and illegal action" },
    { id: 5, name: "Ethical - Fair Practice", emoji: "✨", description: "Just and equal action" }
  ];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Donating to Charity → Ethical - Helps Others
    { leftId: 2, rightId: 2 }, // Stealing Money → Unethical - Illegal
    { leftId: 3, rightId: 3 }, // Honest Financial Reporting → Ethical - Builds Trust
    { leftId: 4, rightId: 4 }, // Paying Bribes → Unethical - Corrupt
    { leftId: 5, rightId: 5 }  // Fair Business Deal → Ethical - Fair Practice
  ];

  // Shuffled right items for display (to split matches across positions)
  // This ensures matches are not in the same position
  const shuffledRightItems = [
    rightItems[2], // Ethical - Builds Trust (id: 3) - matches Honest Financial Reporting - position 1
    rightItems[1], // Unethical - Illegal (id: 2) - matches Stealing Money - position 2
    rightItems[4], // Ethical - Fair Practice (id: 5) - matches Fair Business Deal - position 3
    rightItems[0], // Ethical - Helps Others (id: 1) - matches Donating to Charity - position 4
    rightItems[3]  // Unethical - Corrupt (id: 4) - matches Paying Bribes - position 5
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
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isMatched = (leftId, rightId) => {
    return matches.some(m => m.leftId === leftId && m.rightId === rightId);
  };

  const isLeftMatched = (leftId) => {
    return matches.some(m => m.leftId === leftId);
  };

  const isRightMatched = (rightId) => {
    return matches.some(m => m.rightId === rightId);
  };

  return (
    <GameShell
      title="Puzzle: Right vs Wrong"
      subtitle={!showResult ? `Match ${matches.length + 1} of ${leftItems.length}` : "Puzzle Complete!"}
      score={score}
      currentLevel={matches.length + 1}
      totalLevels={leftItems.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={leftItems.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Match {matches.length + 1}/{leftItems.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{leftItems.length}</span>
              </div>
              
              <p className="text-white/80 text-center mb-6">
                Match each financial action with its ethical classification
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Left Column - Actions */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Financial Actions</h3>
                  {leftItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleLeftSelect(item)}
                      disabled={isLeftMatched(item.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedLeft?.id === item.id
                          ? "bg-blue-500 border-4 border-blue-300"
                          : isLeftMatched(item.id)
                          ? "bg-green-500/30 border-2 border-green-400 opacity-60"
                          : "bg-white/10 hover:bg-white/20 border-2 border-white/20"
                      } ${isLeftMatched(item.id) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Middle Column - Match Button */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleMatch}
                    disabled={!selectedLeft || !selectedRight}
                    className={`px-6 py-3 rounded-full font-bold transition-all ${
                      selectedLeft && selectedRight
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Match
                  </button>
                </div>

                {/* Right Column - Classifications */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Ethical Classification</h3>
                  {shuffledRightItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRightSelect(item)}
                      disabled={isRightMatched(item.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedRight?.id === item.id
                          ? "bg-blue-500 border-4 border-blue-300"
                          : isRightMatched(item.id)
                          ? "bg-green-500/30 border-2 border-green-400 opacity-60"
                          : "bg-white/10 hover:bg-white/20 border-2 border-white/20"
                      } ${isRightMatched(item.id) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PuzzleRightVsWrong;
