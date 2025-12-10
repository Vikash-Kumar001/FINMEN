import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TrafficLightAI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "ai-kids-26";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [light, setLight] = useState("🟢"); // Green initially
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [round, setRound] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const totalRounds = 5; // Changed from 10 to 5 to comply with refactor rules

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
      showCorrectAnswerFeedback(1, true); // Updated to 1 coin and proper feedback
    }
    setRound(prev => prev + 1);

    if (round + 1 >= totalRounds) {
      if (score + (correct ? 1 : 0) >= 3) { // Adjusted threshold for 5 rounds (3 out of 5)
        setCoins(5); // Still award 5 coins for passing
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
    navigate("/games/ai-for-all/kids"); // Updated to standard navigation path
  };

  return (
    <GameShell
      title="Traffic Light AI"
      score={coins}
      subtitle={`Round ${round + 1} of ${totalRounds}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3} // Adjusted threshold for 5 rounds
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3} // Adjusted threshold for 5 rounds
      
      gameId={gameId}
      gameType="ai"
      totalLevels={5} // Updated to match number of rounds
      currentLevel={round + 1}
      showConfetti={showResult && score >= 3} // Adjusted threshold for 5 rounds
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
      maxScore={totalRounds} // Added maxScore prop
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Click "Stop" when the red light appears! 🚦
            </h3>

            <div className="bg-gradient-to-br from-green-500/30 to-red-500/30 rounded-2xl p-16 mb-6 flex justify-center items-center border border-white/20">
              <div className="text-9xl animate-pulse">{light}</div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full px-12 py-6 text-white font-bold text-2xl transition-all transform hover:scale-105 border border-white/20"
              >
                🛑 Stop
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 3 ? "🎉 Reflex Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You stopped correctly {score} out of {totalRounds} times!
            </p>
            <div className="bg-blue-500/30 rounded-xl p-4 mb-4 border border-blue-500/50">
              <p className="text-white/90">
                💡 AI in self-driving cars detects traffic lights and decides when to stop—just like you did!
              </p>
            </div>
            {score >= 3 ? (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                <span>+5 Coins</span>
              </div>
            ) : (
              <p className="text-yellow-400 text-xl font-bold mb-4">
                Get 3 or more correct to earn coins!
              </p>
            )}
            {score < 3 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all"
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