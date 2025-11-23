import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DataCleaningPuzzle = () => {
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

  const images = [
    { id: 1, icon: "🍎", type: "good", correct: "keep" },
    { id: 2, icon: "❌", type: "bad", correct: "remove" },
    { id: 3, icon: "🍎", type: "good", correct: "keep" },
    { id: 4, icon: "❌", type: "bad", correct: "remove" },
    { id: 5, icon: "🍎", type: "good", correct: "keep" }
  ];

  const currentImageData = images[currentImage];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentImageData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentImage < images.length - 1) {
      setTimeout(() => {
        setCurrentImage(prev => prev + 1);
      }, 300);
    } else {
      if (score + (isCorrect ? 1 : 0) >= 4) {
        setCoins(5);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentImage(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/training-ai-reflex"); // ✅ Replace with real next route later
  };

  return (
    <GameShell
      title="Data Cleaning Puzzle"
      score={coins}
      subtitle={`Image ${currentImage + 1} of ${images.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 4}
      
      gameId="ai-kids-53"
      gameType="ai"
      totalLevels={100}
      currentLevel={53}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Keep or Remove?
            </h3>

            <div className="bg-blue-500/20 rounded-lg p-6 mb-6 flex justify-center items-center">
              <div className="text-8xl">{currentImageData.icon}</div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">
              Choose the correct action:
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("keep")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">✅</div>
                <div className="text-white font-bold text-xl">Keep</div>
              </button>
              <button
                onClick={() => handleChoice("remove")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🗑️</div>
                <div className="text-white font-bold text-xl">Remove</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Clean Data Hero!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You sorted {score} out of {images.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI learns best with clean, high-quality data. You just helped the robot train better!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 && (
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

export default DataCleaningPuzzle;
