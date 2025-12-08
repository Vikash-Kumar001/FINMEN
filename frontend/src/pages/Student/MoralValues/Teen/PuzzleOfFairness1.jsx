import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleOfFairness1 = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-44";
  const gameData = getGameDataById(gameId);
  
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

  const leftItems = [
    { id: 1, name: "Equality", emoji: "⚖️", description: "Equal treatment" },
    { id: 2, name: "Bullying", emoji: "👊", description: "Harmful behavior" },
    { id: 3, name: "Cheating", emoji: "📝", description: "Dishonest act" },
    { id: 4, name: "Sharing", emoji: "🤲", description: "Dividing equally" },
    { id: 5, name: "Favoritism", emoji: "⭐", description: "Unfair preference" },
  ];

  // Right items with correct matches in different positions: Q1: pos 2, Q2: pos 1, Q3: pos 3, Q4: pos 1, Q5: pos 3
  const rightItems = [
    { id: 1, name: "Injustice", emoji: "❌", description: "Unfair treatment" },
    { id: 2, name: "Justice", emoji: "✅", description: "Fair treatment" },
    { id: 3, name: "Unfairness", emoji: "🚫", description: "Not fair" },
    { id: 4, name: "Fairness", emoji: "🤝", description: "Being fair" },
    { id: 5, name: "Kindness", emoji: "💖", description: "Being kind" },
  ];

  const correctMatches = [
    { leftId: 1, rightId: 2 }, // Equality → Justice (pos 2)
    { leftId: 2, rightId: 1 }, // Bullying → Injustice (pos 1)
    { leftId: 3, rightId: 3 }, // Cheating → Unfairness (pos 3)
    { leftId: 4, rightId: 4 }, // Sharing → Fairness (pos 4)
    { leftId: 5, rightId: 1 }  // Favoritism → Injustice (pos 1) - Note: Injustice can appear twice
  ];

  const isRightItemMatched = (itemId) => {
    return matches.some(match => match.rightId === itemId);
  };

  const handleLeftSelect = (item) => {
    if (showResult) return;
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (showResult) return;
    // Allow Injustice (id: 1) to be matched twice (for Bullying and Favoritism)
    if (item.id === 1) {
      const injusticeMatches = matches.filter(m => m.rightId === 1);
      if (injusticeMatches.length >= 2) return;
    } else if (isRightItemMatched(item.id)) {
      return;
    }
    setSelectedRight(item);
  };

  const handleMatch = () => {
    if (!selectedLeft || !selectedRight || showResult) return;

    // Check if right item is already matched (except Injustice which can be matched twice)
    if (selectedRight.id !== 1 && isRightItemMatched(selectedRight.id)) {
      return;
    }
    if (selectedRight.id === 1) {
      const injusticeMatches = matches.filter(m => m.rightId === 1);
      if (injusticeMatches.length >= 2) return;
    }

    const newMatch = {
      leftId: selectedLeft.id,
      rightId: selectedRight.id,
      isCorrect: correctMatches.some(
        match => match.leftId === selectedLeft.id && match.rightId === selectedRight.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    if (newMatch.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (newMatches.length === leftItems.length) {
      const correctCount = newMatches.filter(match => match.isCorrect).length;
      setFinalScore(correctCount);
      setShowResult(true);
    }

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

  const isItemMatched = (itemId) => {
    return matches.some(match => match.leftId === itemId);
  };

  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? match.isCorrect : null;
  };

  const isRightItemAvailable = (rightId) => {
    if (rightId === 1) {
      const injusticeMatches = matches.filter(m => m.rightId === 1);
      return injusticeMatches.length < 2;
    }
    return !isRightItemMatched(rightId);
  };

  return (
    <GameShell
      title="Puzzle of Fairness"
      score={coins}
      subtitle={showResult ? "Game Complete!" : "Match concepts to their meanings"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="moral"
      totalLevels={5}
      currentLevel={1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Concepts</h3>
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

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Meanings</h3>
              <div className="space-y-4">
                {rightItems.map(item => {
                  const isMatched = !isRightItemAvailable(item.id);
                  const matchedLeft = matches.find(m => m.rightId === item.id && m.leftId === selectedLeft?.id);
                  const allMatches = matches.filter(m => m.rightId === item.id);
                  const isCorrectMatch = allMatches.some(m => correctMatches.some(c => c.leftId === m.leftId && c.rightId === m.rightId));
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRightSelect(item)}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched
                          ? isCorrectMatch
                            ? "bg-green-500/30 border-2 border-green-500"
                            : "bg-red-500/30 border-2 border-red-500"
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
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Matching!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {finalScore} out of {leftItems.length} concepts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {finalScore} out of {leftItems.length} correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfFairness1;
