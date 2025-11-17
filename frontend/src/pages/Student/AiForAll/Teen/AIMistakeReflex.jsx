import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIMistakeReflex = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const items = [
    { id: 1, question: "AI says: 2+2=5", correctAction: "correct", type: "mistake" },
    { id: 2, question: "AI says: Sun rises in the west", correctAction: "correct", type: "mistake" },
    { id: 3, question: "AI says: Water boils at 100°C", correctAction: "ignore", type: "correct" },
    { id: 4, question: "AI says: Earth is flat", correctAction: "correct", type: "mistake" },
    { id: 5, question: "AI says: 10-5=5", correctAction: "ignore", type: "correct" },
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect =
      (choice === "correct" && currentItemData.correctAction === "correct") ||
      (choice === "ignore" && currentItemData.correctAction === "ignore");

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 5);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => setCurrentItem((prev) => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/data-diversity-story"); // update with the next game path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="AI Mistake Reflex"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 60}
      showGameOver={showResult && accuracy >= 60}
      score={coins}
      gameId="ai-teen-aimistake-reflex"
      gameType="ai"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult && accuracy >= 60}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Did AI make a mistake?
            </h3>

            <div className="bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-xl p-12 mb-6">
              <p className="text-3xl font-bold text-center">{currentItemData.question}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("correct")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">✔️</div>
                <div className="text-white font-bold text-xl">Correct it</div>
              </button>
              <button
                onClick={() => handleChoice("ignore")}
                className="bg-purple-500/30 hover:bg-purple-500/50 border-3 border-purple-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">❌</div>
                <div className="text-white font-bold text-xl">Ignore</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 60 ? "🎉 Smart Corrector!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You corrected {score} out of {items.length} AI mistakes! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Reinforcing AI retraining helps improve models! Recognizing mistakes ensures better AI behavior.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 60 && (
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

export default AIMistakeReflex;
