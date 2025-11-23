import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FaceUnlockSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentFace, setCurrentFace] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const faces = [
    { id: 1, emoji: "😃", name: "You", isCorrect: true },
    { id: 2, emoji: "😎", name: "Friend", isCorrect: false },
    { id: 3, emoji: "😡", name: "Stranger", isCorrect: false },
    { id: 4, emoji: "🤓", name: "Classmate", isCorrect: false },
    { id: 5, emoji: "🤖", name: "Robot", isCorrect: false }
  ];

  const currentFaceData = faces[currentFace];

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // Each correct face earns 1 coin
      showCorrectAnswerFeedback(1, false);
    }

    if (currentFace < faces.length - 1) {
      setTimeout(() => setCurrentFace(prev => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentFace(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/e-commerce-ai-story"); // Update with next game path
  };

  const accuracy = Math.round((score / faces.length) * 100);

  return (
    <GameShell
      title="Face Unlock Simulation"
      score={coins}
      subtitle={`Face ${currentFace + 1} of ${faces.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-29"
      gameType="ai"
      totalLevels={30}
      currentLevel={29}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Which face unlocks the phone?</h3>
            
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-12 mb-6">
              <div className="text-7xl mb-3 text-center">{currentFaceData.emoji}</div>
              <p className="text-4xl text-white font-bold text-center">{currentFaceData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🔓</div>
                <div className="text-white font-bold text-xl">Correct</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🔒</div>
                <div className="text-white font-bold text-xl">Wrong</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Face Unlock Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You unlocked {score} out of {faces.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Facial recognition AI identifies faces to unlock devices. Correctly recognizing faces keeps your phone secure!
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

export default FaceUnlockSimulation;
