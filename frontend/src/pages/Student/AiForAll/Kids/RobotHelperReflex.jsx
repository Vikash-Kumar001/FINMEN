import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHelperReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentRound, setCurrentRound] = useState(0);
  const [robotAsksHelp, setRobotAsksHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const totalRounds = 5;

  // Randomly decide if robot asks for help
  const startRound = () => {
    setRobotAsksHelp(Math.random() < 0.6); // 60% chance robot asks help
  };

  useEffect(() => {
    if (currentRound < totalRounds && !showResult) {
      startRound();
    }
  }, [currentRound, showResult]);

  const handleHelpClick = () => {
    if (robotAsksHelp) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(2, false);
    }
    nextRound();
  };

  const handleWrongClick = () => {
    nextRound();
  };

  const nextRound = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(prev => prev + 1);
      setRobotAsksHelp(false);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentRound(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/match-ai-uses");
  };

  return (
    <GameShell
      title="Robot Helper Reflex"
      score={coins}
      subtitle={`Round ${currentRound + 1} of ${totalRounds}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3}
      
      gameId="ai-kids-22"
      gameType="ai"
      totalLevels={100}
      currentLevel={22}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-white text-xl font-bold mb-6">
              Click “Help” when the robot asks for help! 🤖
            </h3>
            
            <div className="bg-purple-500/20 rounded-xl p-8 mb-6">
              <div className="text-8xl mb-4">{robotAsksHelp ? "🤖 HELP!" : "🤖 ..."}</div>
              <p className="text-white text-xl font-bold">
                {robotAsksHelp ? "Robot needs your help!" : "Robot is idle..."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleHelpClick}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2">🤝</div>
                <div className="text-white font-bold text-xl">HELP</div>
              </button>
              <button
                onClick={handleWrongClick}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2">✋</div>
                <div className="text-white font-bold text-xl">DON'T CLICK</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 3 ? "🎉 Teamwork Success!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You helped the robot {score} out of {totalRounds} times!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI-human teamwork helps accomplish tasks faster. Great reflexes!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              {score >= 3 ? `You earned ${coins} Coins! 🪙` : "Score 3 or more to earn coins!"}
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

export default RobotHelperReflex;
