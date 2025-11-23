import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexDutyCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    { id: 1, text: "You promised a friend to help them study.", emoji: "📚", correctAction: "keep" },
    { id: 2, text: "You said you'd finish a group task on time.", emoji: "📝", correctAction: "keep" },
    { id: 3, text: "You agreed to return a borrowed book.", emoji: "📖", correctAction: "keep" },
    { id: 4, text: "You promised to attend a community cleanup.", emoji: "🌳", correctAction: "keep" },
    { id: 5, text: "You said you'd call your sibling today.", emoji: "📞", correctAction: "keep" }
  ];

  useEffect(() => {
    if (gameStarted && showPrompt && !showResult) {
      const timer = setTimeout(() => {
        setShowPrompt(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showPrompt, currentScenario, showResult]);

  const currentData = scenarios[currentScenario];

  const handleAction = (action) => {
    if (showPrompt) return;

    const isCorrect = currentData.correctAction === action;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
        setShowPrompt(true);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / scenarios.length) * 100;
      if (accuracy >= 70) {
        setCoins(3);
      }
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentScenario(0);
    setScore(0);
    setCoins(0);
    setShowPrompt(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/badge-discipline-hero");
  };

  const accuracy = Math.round((score / scenarios.length) * 100);

  return (
    <GameShell
      title="Reflex: Duty Check"
      score={coins}
      subtitle={gameStarted ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Tap to Keep or Break Promise"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="moral-teen-39"
      gameType="moral"
      totalLevels={100}
      currentLevel={39}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Duty Reflex Challenge!</h2>
            <p className="text-white/80 mb-6">Quickly tap to keep or break your promises!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {showPrompt ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentData.emoji}</div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="text-white text-2xl font-bold">{currentData.text}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction("keep")}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Keep Promise ✅</div>
                  </button>
                  <button
                    onClick={() => handleAction("break")}
                    className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Break Promise ❌</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Duty Champion!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You chose correctly {score} out of {scenarios.length} times ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Keeping promises strengthens trust and responsibility. Breaking promises can harm relationships. Always aim to follow through!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default ReflexDutyCheck;
