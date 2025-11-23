import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DataCleaningReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentImage, setCurrentImage] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 sample images with “Keep” for clear, “Delete” for blurry
  const images = [
    { id: 1, label: "Clear Photo 🏞️", correctAction: "Keep" },
    { id: 2, label: "Blurry Photo 🌫️", correctAction: "Delete" },
    { id: 3, label: "Clear Photo 🐶", correctAction: "Keep" },
    { id: 4, label: "Blurry Photo 🤳", correctAction: "Delete" },
    { id: 5, label: "Clear Photo 📸", correctAction: "Keep" },
  ];

  const currentImageData = images[currentImage];

  const handleAction = (action) => {
    const isCorrect = action === currentImageData.correctAction;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(2, false);
    }

    setTimeout(() => {
      if (currentImage < images.length - 1) {
        setCurrentImage(prev => prev + 1);
      } else {
        const totalCoins = (score + (isCorrect ? 1 : 0)) * 2;
        setCoins(totalCoins);
        setScore(prev => prev + (isCorrect ? 1 : 0));
        setShowResult(true);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentImage(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-bias-roleplay"); // update next path
  };

  return (
    <GameShell
      title="Data Cleaning Reflex"
      score={coins}
      subtitle={`Image ${currentImage + 1} of ${images.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3}
      
      gameId="ai-teen-67"
      gameType="ai"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Click “Keep” for clear photos or “Delete” for blurry ones!
            </h3>

            <div className="bg-blue-500/20 rounded-xl p-12 mb-6 text-center text-6xl">
              {currentImageData.label}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction("Keep")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">✅</div>
                <div className="text-white font-bold text-xl">KEEP</div>
              </button>

              <button
                onClick={() => handleAction("Delete")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🗑️</div>
                <div className="text-white font-bold text-xl">DELETE</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 3 ? "🎉 Data Cleaning Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You cleaned {score} out of {images.length} images correctly!
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Data preprocessing is essential for AI! Removing blurry or incorrect data helps AI models learn accurately.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 3 ? `You earned ${coins} Coins! 🪙` : "Get at least 3 correct to earn coins!"}
            </p>

            {score < 3 && (
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

export default DataCleaningReflex;
