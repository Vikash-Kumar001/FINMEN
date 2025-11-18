import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodDataBadDataGame = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, emoji: "📸", label: "Clear Photo", correct: "good" },
    { id: 2, emoji: "📷", label: "Blurry Photo", correct: "bad" },
    { id: 3, emoji: "🖼️", label: "Well-lit Image", correct: "good" },
    { id: 4, emoji: "🌫️", label: "Foggy Photo", correct: "bad" },
    { id: 5, emoji: "📹", label: "High-quality Video", correct: "good" },
    { id: 6, emoji: "🎞️", label: "Low-res Video", correct: "bad" }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => setCurrentItem(prev => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-superpower-puzzle");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Good Data vs Bad Data"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-kids-89"
      gameType="ai"
      totalLevels={100}
      currentLevel={89}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🖼️</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Sort the data!
            </h3>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentItemData.emoji}</div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">{currentItemData.label}</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("good")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">👍</div>
                <div className="text-white font-bold text-xl">Good Data</div>
              </button>
              <button
                onClick={() => handleChoice("bad")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">👎</div>
                <div className="text-white font-bold text-xl">Bad Data</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Sorting Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You sorted {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Using clean, high-quality data helps AI learn correctly. You just learned how to identify good vs bad data!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
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

export default GoodDataBadDataGame;
