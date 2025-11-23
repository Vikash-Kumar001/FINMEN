import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrainingAIReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const animals = [
    { id: 1, emoji: "🐶", breed: "Labrador Retriever", type: "dog", correct: "dog" },
    { id: 2, emoji: "🐱", breed: "Persian Cat", type: "cat", correct: "cat" },
    { id: 3, emoji: "🐶", breed: "German Shepherd", type: "dog", correct: "dog" },
    { id: 4, emoji: "🐱", breed: "Siamese Cat", type: "cat", correct: "cat" },
    { id: 5, emoji: "🐶", breed: "Poodle", type: "dog", correct: "dog" },
    { id: 6, emoji: "🐱", breed: "Bengal Cat", type: "cat", correct: "cat" },
    { id: 7, emoji: "🐶", breed: "Beagle", type: "dog", correct: "dog" },
    { id: 8, emoji: "🐱", breed: "Maine Coon", type: "cat", correct: "cat" },
    { id: 9, emoji: "🐶", breed: "Bulldog", type: "dog", correct: "dog" },
    { id: 10, emoji: "🐱", breed: "Sphynx Cat", type: "cat", correct: "cat" }
  ];

  const currentAnimalData = animals[currentAnimal];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentAnimalData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentAnimal < animals.length - 1) {
      setTimeout(() => {
        setCurrentAnimal(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentAnimal(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/overfitting-story");
  };

  const accuracy = Math.round((score / animals.length) * 100);

  return (
    <GameShell
      title="Training AI Reflex"
      score={coins}
      subtitle={`Animal ${currentAnimal + 1} of ${animals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-54"
      gameType="ai"
      totalLevels={100}
      currentLevel={54}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Dog or Cat? Click Fast!
            </h3>

            <div className="bg-white/10 rounded-lg p-6 mb-6 text-center">
              <div className="text-8xl mb-4 animate-pulse">{currentAnimalData.emoji}</div>
              <p className="text-white text-xl font-semibold">
                {currentAnimalData.breed}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("dog")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🐶</div>
                <div className="text-white font-bold text-xl">Dog</div>
              </button>
              <button
                onClick={() => handleChoice("cat")}
                className="bg-purple-500/30 hover:bg-purple-500/50 border-3 border-purple-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🐱</div>
                <div className="text-white font-bold text-xl">Cat</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Reflex Master!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {animals.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 You just practiced supervised learning—teaching AI with correct answers!
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

export default TrainingAIReflex;
