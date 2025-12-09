import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfDrivingCar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentSignal, setCurrentSignal] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const signals = [
    { id: 1, light: "red", emoji: "🔴", correct: "brake" },
    { id: 2, light: "green", emoji: "🟢", correct: "go" },
    { id: 3, light: "red", emoji: "🔴", correct: "brake" },
    { id: 4, light: "green", emoji: "🟢", correct: "go" },
    { id: 5, light: "red", emoji: "🔴", correct: "brake" }
  ];

  const currentSignalData = signals[currentSignal];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentSignalData.correct;
    const isLastQuestion = currentSignal === signals.length - 1;
    
    if (isCorrect) {
      setScore(prev => {
        const newScore = prev + 1;
        if (isLastQuestion && newScore >= 3) {
          setCoins(5);
        }
        return newScore;
      });
      showCorrectAnswerFeedback(1, false);
    }
    
    if (isLastQuestion) {
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentSignal(prev => prev + 1);
      }, 300);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentSignal(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/pattern-finder-puzzle");
  };

  const accuracy = Math.round((score / signals.length) * 100);

  return (
    <GameShell
      title="Self-Driving Car Game"
      score={score}
      subtitle={`Signal ${currentSignal + 1} of ${signals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3}
      maxScore={signals.length}
      gameId="ai-kids-6"
      gameType="ai"
      totalLevels={signals.length}
      currentLevel={currentSignal + 1}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🚗</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Help the AI car decide!</h3>
            
            <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentSignalData.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("brake")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🛑</div>
                <div className="text-white font-bold text-xl">BRAKE</div>
              </button>
              <button
                onClick={() => handleChoice("go")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">▶️</div>
                <div className="text-white font-bold text-xl">GO</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 3 ? "🎉 Safe Driver!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You made {score} out of {signals.length} correct decisions! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Self-driving cars use AI to make decisions! They recognize traffic lights and drive safely!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 3 ? "You earned 5 Coins! 🪙" : "Get 3 or more correct to earn coins!"}
            </p>
            {score < 3 && (
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

export default SelfDrivingCar;

