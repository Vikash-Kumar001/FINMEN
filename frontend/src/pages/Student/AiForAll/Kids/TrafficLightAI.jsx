import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrafficLightAI = () => {
  const navigate = useNavigate();
  const [light, setLight] = useState("🟢"); // Green initially
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [round, setRound] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const totalRounds = 10;

  // Change light randomly every 1–3 seconds
  useEffect(() => {
    if (showResult) return;
    const interval = setInterval(() => {
      const colors = ["🟢", "🟡", "🔴"];
      const nextLight = colors[Math.floor(Math.random() * colors.length)];
      setLight(nextLight);
    }, Math.random() * 2000 + 1000);
    return () => clearInterval(interval);
  }, [showResult]);

  const handleStop = () => {
    let correct = false;
    if (light === "🔴") {
      correct = true;
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setRound(prev => prev + 1);

    if (round + 1 >= totalRounds) {
      if (score + (correct ? 1 : 0) >= 7) {
        setCoins(5);
      }
      setScore(prev => prev + (correct ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setScore(0);
    setCoins(0);
    setRound(0);
    setLight("🟢");
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-in-maps-story");
  };

  return (
    <GameShell
      title="Traffic Light AI"
      subtitle={`Round ${round + 1} of ${totalRounds}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 7}
      showGameOver={showResult && score >= 7}
      score={coins}
      gameId="ai-kids-26"
      gameType="ai"
      totalLevels={100}
      currentLevel={26}
      showConfetti={showResult && score >= 7}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Click "Stop" when the red light appears! 🚦
            </h3>

            <div className="bg-gradient-to-br from-green-500/30 to-red-500/30 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{light}</div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStop}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl px-12 py-6 text-white font-bold text-2xl transition-all transform hover:scale-105"
              >
                🛑 Stop
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 7 ? "🎉 Reflex Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You stopped correctly {score} out of {totalRounds} times!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI in self-driving cars detects traffic lights and decides when to stop—just like you did!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 7 ? "You earned 5 Coins! 🪙" : "Get 7 or more correct to earn coins!"}
            </p>
            {score < 7 && (
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

export default TrafficLightAI;
