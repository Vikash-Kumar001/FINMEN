import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeedbackLoopReflex = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const items = [
    { id: 1, emoji: "🐶", question: "AI says: 'This is a cat.'", correctAnswer: "incorrect" },
    { id: 2, emoji: "🚗", question: "AI says: 'This is a car.'", correctAnswer: "correct" },
    { id: 3, emoji: "🍎", question: "AI says: 'This is a banana.'", correctAnswer: "incorrect" },
    { id: 4, emoji: "🐱", question: "AI says: 'This is a cat.'", correctAnswer: "correct" },
    { id: 5, emoji: "🌧️", question: "AI says: 'It’s sunny.'", correctAnswer: "incorrect" },
    { id: 6, emoji: "🎓", question: "AI says: 'This is a graduation cap.'", correctAnswer: "correct" },
    { id: 7, emoji: "🍕", question: "AI says: 'This is pizza.'", correctAnswer: "correct" },
    { id: 8, emoji: "🐘", question: "AI says: 'This is a dog.'", correctAnswer: "incorrect" },
    { id: 9, emoji: "⚽", question: "AI says: 'This is a football.'", correctAnswer: "correct" },
    { id: 10, emoji: "🚴", question: "AI says: 'This is a person cycling.'", correctAnswer: "correct" },
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 5);
      showCorrectAnswerFeedback(5, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem((prev) => prev + 1);
      }, 300);
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
    navigate("/student/ai-for-all/teen/small-vs-big-data-story"); // 🔗 Replace with actual next game path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Feedback Loop Reflex"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-teen-feedback-loop"
      gameType="ai"
      totalLevels={20}
      currentLevel={63}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Is AI’s answer correct or incorrect?
            </h3>

            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-12 mb-6">
              <div className="text-9xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-2xl font-bold text-center">
                {currentItemData.question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("correct")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">✅</div>
                <div className="text-white font-bold text-xl">Correct</div>
              </button>
              <button
                onClick={() => handleChoice("incorrect")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">❌</div>
                <div className="text-white font-bold text-xl">Incorrect</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 AI Feedback Master!" : "💪 Keep Training the AI!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You gave correct feedback for {score} out of {items.length} responses! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Great work! Giving feedback helps AI learn and improve. Every “correct” or “incorrect” 
                you choose trains the model better! 🤖✨
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
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeedbackLoopReflex;
