import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotVacuumGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentObstacle, setCurrentObstacle] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const obstacles = [
    { id: 1, emoji: "🪑", correctAction: "turn" },
    { id: 2, emoji: "🛋️", correctAction: "turn" },
    { id: 3, emoji: "🪞", correctAction: "stay" },
    { id: 4, emoji: "🛏️", correctAction: "turn" },
    { id: 5, emoji: "🖼️", correctAction: "stay" }
  ];

  const currentObstacleData = obstacles[currentObstacle];

  const handleChoice = (action) => {
    const isCorrect = action === currentObstacleData.correctAction;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentObstacle < obstacles.length - 1) {
      setTimeout(() => {
        setCurrentObstacle(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentObstacle(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-translator-quiz"); // replace with actual next route
  };

  const accuracy = Math.round((score / obstacles.length) * 100);

  return (
    <GameShell
      title="Robot Vacuum Game"
      score={score}
      subtitle={`Obstacle ${currentObstacle + 1} of ${obstacles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-36"
      gameType="ai"
      totalLevels={20}
      currentLevel={36}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🤖</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Help the robot vacuum avoid obstacles!</h3>

            <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentObstacleData.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("turn")}
                className="bg-yellow-500/30 hover:bg-yellow-500/50 border-3 border-yellow-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">↩️</div>
                <div className="text-white font-bold text-xl">TURN</div>
              </button>
              <button
                onClick={() => handleChoice("stay")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">⬇️</div>
                <div className="text-white font-bold text-xl">STAY</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Obstacle Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You avoided {score} out of {obstacles.length} obstacles! ({accuracy}%)
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 The robot vacuum uses AI to detect obstacles. You helped it navigate safely!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
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

export default RobotVacuumGame;