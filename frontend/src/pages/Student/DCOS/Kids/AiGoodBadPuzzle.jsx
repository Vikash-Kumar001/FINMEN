import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AiGoodBadPuzzle = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 AI-related matching questions
  const items = [
    { id: 1, item: "AI Translation App", emoji: "🌐", correctCategory: "Good Use" },
    { id: 2, item: "AI Cheating in Exams", emoji: "📚", correctCategory: "Bad Use" },
    { id: 3, item: "AI Helping Doctors", emoji: "🩺", correctCategory: "Good Use" },
    { id: 4, item: "AI Making Fake News", emoji: "📰", correctCategory: "Bad Use" },
    { id: 5, item: "AI Helping Kids Learn", emoji: "🎓", correctCategory: "Good Use" }
  ];

  const categories = ["Good Use", "Bad Use"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleConfirm = () => {
    if (!selectedCategory) return;

    const item = items[currentMatch];
    const isCorrect = selectedCategory === item.correctCategory;

    const newMatches = [
      ...matches,
      { itemId: item.id, selected: selectedCategory, isCorrect },
    ];
    setMatches(newMatches);

    if (isCorrect) showCorrectAnswerFeedback(1, true);

    setSelectedCategory(null);

    if (currentMatch < items.length - 1) {
      setTimeout(() => {
        setCurrentMatch((prev) => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      const correctCount = newMatches.filter((m) => m.isCorrect).length;
      if (correctCount >= 4) setCoins(5);
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
    navigate("/student/dcos/kids/fairness-quiz1");
  };

  const correctCount = matches.filter((m) => m.isCorrect).length;

  return (
    <GameShell
      title="AI Good vs Bad"
      subtitle={`Item ${currentMatch + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      gameId="dcos-kids-73"
      gameType="puzzle"
      totalLevels={100}
      currentLevel={73}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{items[currentMatch].emoji}</div>
                <p className="text-white text-2xl font-bold text-center">
                  {items[currentMatch].item}
                </p>
              </div>

              <p className="text-white/90 mb-4 text-center">
                Is this a good or bad use of AI?
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedCategory === category
                        ? "bg-green-500/50 border-green-400 ring-2 ring-white"
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
                    ? "bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🤖 AI Hero!" : "💭 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {correctCount} out of {items.length} correctly!
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Good AI helps people — bad AI cheats or spreads fake info!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4
                ? "You earned 5 Coins! 🪙"
                : "Get 4 or more correct to earn coins!"}
            </p>
            {correctCount < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default AiGoodBadPuzzle;
