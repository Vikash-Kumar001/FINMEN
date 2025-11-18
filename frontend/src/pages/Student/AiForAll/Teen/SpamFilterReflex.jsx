import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpamFilterReflex = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, emoji: "🎉", text: "You won lottery!", type: "spam" },
    { id: 2, emoji: "📚", text: "School homework", type: "not-spam" },
    { id: 3, emoji: "🎁", text: "Claim your free gift", type: "spam" },
    { id: 4, emoji: "📅", text: "Meeting at 3 PM", type: "not-spam" },
    { id: 5, emoji: "🏆", text: "Congratulations! Click now", type: "spam" },
    { id: 6, emoji: "📝", text: "Project submission deadline", type: "not-spam" },
    { id: 7, emoji: "💰", text: "Earn $1000 daily!", type: "spam" },
    { id: 8, emoji: "🍽️", text: "Family dinner tonight", type: "not-spam" },
    { id: 9, emoji: "🎊", text: "You have won a prize!", type: "spam" },
    { id: 10, emoji: "📖", text: "Library book return", type: "not-spam" }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.type;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2); // Each correct earns 2 coins
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
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
    navigate("/student/ai-for-all/teen/robot-vision-mistake"); // Update with actual next game path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Spam Filter Reflex"
      subtitle={`Email ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-teen-21"
      gameType="ai"
      totalLevels={20}
      currentLevel={21}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this Email Spam or Not?</h3>
            
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-12 mb-6">
              <div className="text-7xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-4xl text-white font-bold text-center">{currentItemData.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("spam")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🚫📧</div>
                <div className="text-white font-bold text-xl">SPAM</div>
              </button>
              <button
                onClick={() => handleChoice("not-spam")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">📬✅</div>
                <div className="text-white font-bold text-xl">NOT SPAM</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Email Filter Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You identified {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI filters spam emails to keep your inbox safe. Recognizing spam helps protect your personal data!
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

export default SpamFilterReflex;
