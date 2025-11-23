import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrongPasswordReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const passwords = [
    { id: 1, password: "12345", emoji: "❌", isStrong: false },
    { id: 2, password: "Tiger@2025", emoji: "✓", isStrong: true },
    { id: 3, password: "password", emoji: "❌", isStrong: false },
    { id: 4, password: "Star#123!", emoji: "✓", isStrong: true },
    { id: 5, password: "abc123", emoji: "❌", isStrong: false },
    { id: 6, password: "Secure$99", emoji: "✓", isStrong: true },
    { id: 7, password: "qwerty", emoji: "❌", isStrong: false },
    { id: 8, password: "Blue@Sky7", emoji: "✓", isStrong: true },
    { id: 9, password: "111111", emoji: "❌", isStrong: false },
    { id: 10, password: "Safe&Pass8", emoji: "✓", isStrong: true },
    { id: 11, password: "myname", emoji: "❌", isStrong: false },
    { id: 12, password: "Jump$Moon3", emoji: "✓", isStrong: true },
    { id: 13, password: "123456789", emoji: "❌", isStrong: false },
    { id: 14, password: "Rain@Day15", emoji: "✓", isStrong: true },
    { id: 15, password: "admin", emoji: "❌", isStrong: false },
    { id: 16, password: "Lock#Key99", emoji: "✓", isStrong: true },
    { id: 17, password: "hello", emoji: "❌", isStrong: false },
    { id: 18, password: "Cool@Kid24", emoji: "✓", isStrong: true },
    { id: 19, password: "1234567", emoji: "❌", isStrong: false },
    { id: 20, password: "Fire!Fly88", emoji: "✓", isStrong: true }
  ];

  const currentPassword = passwords[currentRound];

  const handleChoice = (isStrong) => {
    const isCorrect = currentPassword.isStrong === isStrong;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentRound < passwords.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / passwords.length) * 100;
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
    setCurrentRound(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/stranger-chat-story");
  };

  const accuracy = Math.round((score / passwords.length) * 100);

  return (
    <GameShell
      title="Strong Password Reflex"
      score={coins}
      subtitle={gameStarted ? `Password ${currentRound + 1} of ${passwords.length}` : "Password Security Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="dcos-kids-1"
      gameType="educational"
      totalLevels={20}
      currentLevel={1}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Password Security!</h2>
            <p className="text-white/80 mb-6">Can you spot strong vs weak passwords quickly? 🔒</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Round {currentRound + 1}/{passwords.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-8 mb-8">
                <p className="text-white text-4xl font-mono font-bold text-center">
                  {currentPassword.password}
                </p>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">Is this password strong?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-4xl mb-2">✓</div>
                  <div className="text-white font-bold text-xl">Strong</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-4xl mb-2">✗</div>
                  <div className="text-white font-bold text-xl">Weak</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Password Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {passwords.length} correct ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Strong passwords have: letters, numbers, symbols, and are at least 8 characters long!
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

export default StrongPasswordReflex;

