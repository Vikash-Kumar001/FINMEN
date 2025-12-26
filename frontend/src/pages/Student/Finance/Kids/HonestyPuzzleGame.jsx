import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceKidsGames } from "../../../../pages/Games/GameCategories/Finance/kidGamesData";

const HonestyPuzzleGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceKidsGames({});
      const currentGame = games.find(g => g.id === "finance-kids-94");
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
  }, [location.state]);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Items (left side) - 5 items
  const items = [
    { id: 1, name: "Return Money", emoji: "💰", hint: "When you find extra money" },
    { id: 2, name: "Keep Extra Change", emoji: "🪙", hint: "When someone gives too much change" },
    { id: 3, name: "Tell Truth About Spending", emoji: "🗣️", hint: "When asked about purchases" },
    { id: 4, name: "Borrow Without Asking", emoji: "🤝", hint: "When you take something without permission" },
    { id: 5, name: "Save Honestly for Goals", emoji: "💰", hint: "When saving money for planned purchases" },
  ];

  // Categories (right side) - 5 items
  const categories = [
    { id: 6, name: "Good", emoji: "😊", description: "Honest behavior" },
    { id: 7, name: "Wrong", emoji: "😞", description: "Dishonest behavior" },
    { id: 8, name: "Wrong", emoji: "😞", description: "Unethical choice" },
    { id: 9, name: "Good", emoji: "😊", description: "Ethical choice" },
    { id: 10, name: "Good", emoji: "😊", description: "Trustworthy action" },
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,6,7,10,9]
  const rearrangedCategories = [
    categories[2], // Wrong (id: 8)
    categories[0], // Good (id: 6)
    categories[1], // Wrong (id: 7)
    categories[4], // Good (id: 10)
    categories[3]  // Good (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each item has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { itemId: 1, categoryId: 6 }, // Return Money → Good
    { itemId: 2, categoryId: 7 }, // Keep Extra Change → Wrong
    { itemId: 3, categoryId: 9 }, // Tell Truth About Spending → Good
    { itemId: 4, categoryId: 8 }, // Borrow Without Asking → Wrong
    { itemId: 5, categoryId: 10 }  // Save Honestly for Goals → Good
  ];

  const handleItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedItem(item);
  };

  const handleCategorySelect = (category) => {
    if (gameFinished) return;
    setSelectedCategory(category);
  };

  const handleMatch = () => {
    if (!selectedItem || !selectedCategory || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedItem.id,
      categoryId: selectedCategory.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedItem.id && match.categoryId === selectedCategory.id
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
    if (newMatches.length === items.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedItem(null);
    setSelectedCategory(null);
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a category is already matched
  const isCategoryMatched = (categoryId) => {
    return matches.some(match => match.categoryId === categoryId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };



  return (
    <GameShell
      title="Puzzle of Honesty"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Items with Categories (${matches.length}/${items.length} matched)`}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-kids-94"
      gameType="finance"
      totalLevels={items.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === items.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/kids"
      maxScore={items.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Honest Scenarios</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    disabled={isItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedItem?.id === item.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="text-white/80 text-sm">Hint: {item.hint}</p>
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
                  {selectedItem 
                    ? `Selected: ${selectedItem.name}` 
                    : "Select an Item"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedCategory}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedCategory
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{items.length}</p>
                  <p>Matched: {matches.length}/{items.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Categories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Emotional Responses</h3>
              <div className="space-y-4">
                {rearrangedCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    disabled={isCategoryMatched(category.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCategoryMatched(category.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedCategory?.id === category.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{category.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{category.name}</h4>
                        <p className="text-white/80 text-sm">{category.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {items.length} scenarios with emotions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being honest brings good feelings and trust!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} scenarios correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Always choose honesty in financial matters!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HonestyPuzzleGame;