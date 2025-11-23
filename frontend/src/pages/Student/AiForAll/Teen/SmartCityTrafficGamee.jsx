import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartCityTrafficGamee = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const signals = [
    { id: 1, color: "🟥", name: "Red - Stop", isCorrect: true },
    { id: 2, color: "🟩", name: "Green - Go", isCorrect: true },
    { id: 3, color: "🟨", name: "Yellow - Slow", isCorrect: true },
    { id: 4, color: "🟦", name: "Blue - Fly", isCorrect: false },
    { id: 5, color: "⬛", name: "Black - Wait", isCorrect: false },
  ];

  const currentSignalData = signals[currentSignal];

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // Each correct signal earns 1 coin
      showCorrectAnswerFeedback(1, false);
    }

    if (currentSignal < signals.length - 1) {
      setTimeout(() => setCurrentSignal(prev => prev + 1), 300);
    } else {
      setShowResult(true);
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
    navigate("/student/ai-for-all/teen/ai-artist-simulation"); // Update next game path
  };

  const accuracy = Math.round((score / signals.length) * 100);

  return (
    <GameShell
      title="Smart City Traffic Game"
      score={coins}
      subtitle={`Signal ${currentSignal + 1} of ${signals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-40"
      gameType="ai"
      totalLevels={30}
      currentLevel={40}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Follow the AI Traffic Signal 🚦</h3>
            
            <div className="bg-gradient-to-br from-orange-500/30 to-green-500/30 rounded-xl p-12 mb-6">
              <div className="text-7xl mb-3 text-center">{currentSignalData.color}</div>
              <p className="text-4xl text-white font-bold text-center">{currentSignalData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">✅</div>
                <div className="text-white font-bold text-xl">Follow</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">❌</div>
                <div className="text-white font-bold text-xl">Wrong</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Smart Traffic Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You followed {score} out of {signals.length} signals correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI traffic systems help manage city traffic efficiently. Following signals ensures safety and smooth traffic flow! 🚗
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

export default SmartCityTrafficGamee;
