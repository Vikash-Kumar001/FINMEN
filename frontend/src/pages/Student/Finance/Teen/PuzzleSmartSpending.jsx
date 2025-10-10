import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSmartSpending = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Smart spending concepts and their descriptions
  const leftItems = [
    { id: 1, name: "Budget", emoji: "📋", description: "A plan for how to spend your money" },
    { id: 2, name: "Waste", emoji: "🗑️", description: "Spending money on things you don't need" },
    { id: 3, name: "Needs", emoji: "🎯", description: "Essential items for survival and well-being" },
    { id: 4, name: "Wants", emoji: "🎁", description: "Items that are nice to have but not essential" },
    { id: 5, name: "Emergency Fund", emoji: "🛡️", description: "Money saved for unexpected expenses" },
    { id: 6, name: "Impulse Buy", emoji: "⚡", description: "Spontaneous purchase without planning" }
  ];

  const rightItems = [
    { id: 1, name: "Plan", emoji: "📝", description: "A strategy or method for achieving something" },
    { id: 2, name: "Trouble", emoji: "⚠️", description: "Problems or difficulties" },
    { id: 3, name: "Priority", emoji: "⭐", description: "Something that should be dealt with first" },
    { id: 4, name: "Luxury", emoji: "💎", description: "Non-essential items that provide comfort or pleasure" },
    { id: 5, name: "Security", emoji: "🔒", description: "Protection from financial risks" },
    { id: 6, name: "Regret", emoji: "😔", description: "Feeling sorry about a decision" }
  ];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Budget → Plan
    { leftId: 2, rightId: 2 }, // Waste → Trouble
    { leftId: 3, rightId: 3 }, // Needs → Priority
    { leftId: 4, rightId: 4 }, // Wants → Luxury
    { leftId: 5, rightId: 5 }, // Emergency Fund → Security
    { leftId: 6, rightId: 6 }  // Impulse Buy → Regret
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
    navigate("/student/finance/teen/party-story");
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
      title="Puzzle: Smart Spending"
      subtitle={showResult ? "Game Complete!" : "Match spending concepts to their meanings"}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4} // Pass if 4 or more correct
      showGameOver={showResult && finalScore >= 4}
      score={coins}
      gameId="finance-teens-14"
      gameType="finance"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Spending concepts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Spending Concepts</h3>
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
                    : "Select a concept"}
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

            {/* Right column - Meanings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Meanings</h3>
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
                  You correctly matched {finalScore} out of {leftItems.length} spending concepts!
                  You understand the key concepts of smart spending!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You know that budgeting is planning, wasting money leads to trouble, and needs should be prioritized!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {finalScore} out of {leftItems.length} spending concepts correctly.
                  Remember, understanding these concepts helps you make better financial decisions!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to match each spending concept with its appropriate meaning.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSmartSpending;