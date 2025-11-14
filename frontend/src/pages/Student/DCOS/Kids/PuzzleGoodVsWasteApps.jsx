import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleGoodVsWasteApps = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const items = [
    { id: 1, item: "Drawing App", emoji: "🎨", correctCategory: "Good App" },
    { id: 2, item: "Fake Prize App", emoji: "🎁", correctCategory: "Waste App" },
    { id: 3, item: "Math Practice App", emoji: "🧮", correctCategory: "Good App" },
    { id: 4, item: "Random Ads Game", emoji: "📺", correctCategory: "Waste App" },
    { id: 5, item: "Story Reading App", emoji: "📚", correctCategory: "Good App" },
  ];

  const categories = ["Good App", "Waste App"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleConfirm = () => {
    if (!selectedCategory) return;

    const item = items[currentMatch];
    const isCorrect = selectedCategory === item.correctCategory;

    const newMatches = [
      ...matches,
      {
        itemId: item.id,
        selected: selectedCategory,
        isCorrect,
      },
    ];

    setMatches(newMatches);

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setSelectedCategory(null);

    if (currentMatch < items.length - 1) {
      setTimeout(() => {
        setCurrentMatch((prev) => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      const correctCount = newMatches.filter((m) => m.isCorrect).length;
      if (correctCount >= 4) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setSelectedCategory(null);
    setMatches([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/homework-story1");
  };

  const correctCount = matches.filter((m) => m.isCorrect).length;

  return (
    <GameShell
      title="Good vs Waste Apps"
      subtitle={`App ${currentMatch + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      gameId="dcos-kids-93"
      gameType="educational"
      totalLevels={100}
      currentLevel={93}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{items[currentMatch].emoji}</div>
                <p className="text-white text-2xl font-bold text-center">
                  {items[currentMatch].item}
                </p>
              </div>

              <p className="text-white/90 mb-4 text-center">
                Is this a good app or a waste app?
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedCategory === category
                        ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-white font-bold">{category}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedCategory}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedCategory
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {correctCount >= 4 ? "🌟 App Expert!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-4 text-center">
              You sorted {correctCount} out of {items.length} apps correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4 text-center">
              <p className="text-white/90 text-sm">
                💡 Good apps help you learn and create. Waste apps show ads or fake prizes!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6 text-center">
              {correctCount >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more right to earn coins!"}
            </p>
            {correctCount < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleGoodVsWasteApps;
