import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartCityTrafficGame = () => {
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

  // 🟢 5 Questions (Signals)
  const signals = [
    { id: 1, light: "🟥 Red Light", correct: "Stop" },
    { id: 2, light: "🟡 Yellow Light", correct: "Slow Down" },
    { id: 3, light: "🟢 Green Light", correct: "Go" },
    { id: 4, light: "🚦 Flashing Signal", correct: "Wait" },
    { id: 5, light: "🚗 Pedestrian Crossing", correct: "Stop" },
  ];

  const actions = ["Stop", "Go", "Slow Down", "Wait"];

  const currentSignalData = signals[currentSignal];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentSignalData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    // Move to next question or show result
    if (currentSignal < signals.length - 1) {
      setTimeout(() => {
        setCurrentSignal((prev) => prev + 1);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      if (finalScore >= 3) {
        setCoins(5);
      }
      setScore(finalScore);
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
    navigate("/student/ai-for-all/kids/ai-news-story"); // update to next actual route
  };

  return (
    <GameShell
      title="Smart City Traffic Game"
      score={coins}
      subtitle={`Signal ${currentSignal + 1} of ${signals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3}
      
      gameId="ai-kids-46"
      gameType="ai"
      totalLevels={100}
      currentLevel={46}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">{currentSignalData.light}</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Choose the correct action!
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(action)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl text-center">{action}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 3 ? "🚦 Great Traffic Sense!" : "🛑 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You followed the correct signals {score} out of {signals.length} times.
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI controls smart traffic lights to reduce congestion and prevent accidents!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              {score >= 3 ? "You earned 5 Coins! 🪙" : "Get at least 3 correct to earn coins!"}
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

export default SmartCityTrafficGame;
