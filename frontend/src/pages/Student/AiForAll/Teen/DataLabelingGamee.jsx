import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DataLabelingGamee = () => {
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
    { id: 1, emoji: "🐱", label: "Cat" },
    { id: 2, emoji: "🐶", label: "Dog" },
    { id: 3, emoji: "😺", label: "Cat" },
    { id: 4, emoji: "🐕", label: "Dog" },
    { id: 5, emoji: "🐈", label: "Cat" },
    { id: 6, emoji: "🐩", label: "Dog" },
    { id: 7, emoji: "😸", label: "Cat" },
    { id: 8, emoji: "🦮", label: "Dog" },
    { id: 9, emoji: "🐱", label: "Cat" },
    { id: 10, emoji: "🐕‍🦺", label: "Dog" }
  ];

  const currentImageData = images[currentImage];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentImageData.label;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2); // Each correct = +2 coins
      showCorrectAnswerFeedback(2, false);
    }

    if (currentImage < images.length - 1) {
      setTimeout(() => setCurrentImage(prev => prev + 1), 300);
    } else {
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
    navigate("/student/ai-for-all/teen/bad-data-story"); // Update next game path
  };

  const accuracy = Math.round((score / images.length) * 100);

  return (
    <GameShell
      title="Data Labeling Game"
      score={coins}
      subtitle={`Image ${currentImage + 1} of ${images.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-20"
      gameType="ai"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Drag and drop to label!</h3>
            
            <div className="bg-gradient-to-br from-green-500/30 to-yellow-500/30 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentImageData.emoji}</div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Which category?</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("Cat")}
                className="bg-purple-500/30 hover:bg-purple-500/50 border-3 border-purple-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐱</div>
                <div className="text-white font-bold text-xl">Cat</div>
              </button>
              <button
                onClick={() => handleChoice("Dog")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐶</div>
                <div className="text-white font-bold text-xl">Dog</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Labeling Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You labeled {score} out of {images.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 This game teaches supervised learning basics. AI learns from labeled images to classify new data accurately!
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

export default DataLabelingGamee;
