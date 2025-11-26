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
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const passwords = [
    { id: 1, password: "12345", emoji: "❌", isStrong: false },
    { id: 2, password: "Tiger@2025", emoji: "✓", isStrong: true },
    { id: 3, password: "password", emoji: "❌", isStrong: false },
    { id: 4, password: "Star#123!", emoji: "✓", isStrong: true },
    { id: 5, password: "Secure$99", emoji: "✓", isStrong: true }
  ];

  const currentPassword = passwords[currentRound];

  const handleChoice = (isStrong) => {
    const isCorrect = currentPassword.isStrong === isStrong;
    
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      showCorrectAnswerFeedback(1, false);
      
      if (currentRound < passwords.length - 1) {
        setTimeout(() => {
          setCurrentRound(prev => prev + 1);
        }, 300);
      } else {
        // All questions answered - check if all correct
        const finalScore = newScore;
        setScore(finalScore);
        setShowResult(true);
      }
    } else {
      if (currentRound < passwords.length - 1) {
        setTimeout(() => {
          setCurrentRound(prev => prev + 1);
        }, 300);
      } else {
        // All questions answered
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/stranger-chat-story");
  };

  // Calculate final score (number of correct answers)
  const finalScore = score;

  return (
    <GameShell
      title="Strong Password Reflex"
      score={finalScore}
      subtitle={gameStarted ? `Password ${currentRound + 1} of ${passwords.length}` : "Password Security Game"}
      onNext={handleNext}
      nextEnabled={false}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      
      gameId="dcos-kids-1"
      gameType="educational"
      totalLevels={5}
      maxScore={5}
      currentLevel={1}
      showConfetti={showResult && finalScore === 5}
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default StrongPasswordReflex;

