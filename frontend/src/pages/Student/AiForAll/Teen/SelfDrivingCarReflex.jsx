import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfDrivingCarReflex = () => {
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
  const [reactionTimes, setReactionTimes] = useState([]);
  const [signalStartTime, setSignalStartTime] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const signals = [
    { id: 1, light: "green", emoji: "🟢", correct: "go" },
    { id: 2, light: "red", emoji: "🔴", correct: "stop" },
    { id: 3, light: "green", emoji: "🟢", correct: "go" },
    { id: 4, light: "red", emoji: "🔴", correct: "stop" },
    { id: 5, light: "green", emoji: "🟢", correct: "go" },
    { id: 6, light: "red", emoji: "🔴", correct: "stop" },
    { id: 7, light: "green", emoji: "🟢", correct: "go" },
    { id: 8, light: "red", emoji: "🔴", correct: "stop" },
    { id: 9, light: "green", emoji: "🟢", correct: "go" },
    { id: 10, light: "red", emoji: "🔴", correct: "stop" }
  ];

  const currentSignalData = signals[currentSignal];

  useEffect(() => {
    if (currentSignalData && !showResult) {
      setSignalStartTime(Date.now());
    }
  }, [currentSignal, currentSignalData, showResult]);

  const handleChoice = (choice) => {
    const reactionTime = Date.now() - signalStartTime;
    setReactionTimes([...reactionTimes, reactionTime]);
    
    const isCorrect = choice === currentSignalData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentSignal < signals.length - 1) {
      setTimeout(() => {
        setCurrentSignal(prev => prev + 1);
      }, 300);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 8) {
        setCoins(5);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentSignal(0);
    setScore(0);
    setCoins(0);
    setReactionTimes([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/sorting-emotions-game");
  };

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  return (
    <GameShell
      title="Self-Driving Car Reflex"
      score={coins}
      subtitle={`Signal ${currentSignal + 1} of ${signals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 8}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 8}
      
      gameId="ai-teen-6"
      gameType="ai"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showResult && score >= 8}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🚗</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">React fast to the signal!</h3>
            
            <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentSignalData.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("stop")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🛑</div>
                <div className="text-white font-bold text-xl">STOP</div>
              </button>
              <button
                onClick={() => handleChoice("go")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">▶️</div>
                <div className="text-white font-bold text-xl">GO</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 8 ? "🎉 Lightning Reflexes!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You made {score} out of {signals.length} correct decisions!
            </p>
            <p className="text-white/80 text-sm mb-4 text-center">
              Average reaction time: {avgReactionTime}ms
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Self-driving cars use rule-based AI to make split-second decisions! They react 
                faster than humans to keep everyone safe!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 8 ? "You earned 5 Coins! 🪙" : "Get 8 or more correct to earn coins!"}
            </p>
            {score < 8 && (
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

export default SelfDrivingCarReflex;

