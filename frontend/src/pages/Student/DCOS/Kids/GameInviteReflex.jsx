import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GameInviteReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentInvite, setCurrentInvite] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const invites = [
    { id: 1, from: "Unknown User", message: "Play Super Game!", emoji: "🎮", shouldDecline: true },
    { id: 2, from: "Your Friend Tom", message: "Join my game!", emoji: "👦", shouldDecline: false },
    { id: 3, from: "Stranger123", message: "Free coins! Click here!", emoji: "💰", shouldDecline: true },
    { id: 4, from: "Your Classmate Sara", message: "Want to play?", emoji: "👧", shouldDecline: false },
    { id: 5, from: "Winner999", message: "You won a prize! Play now!", emoji: "🏆", shouldDecline: true },
    { id: 6, from: "Your Cousin Mike", message: "Game time!", emoji: "👨", shouldDecline: false },
    { id: 7, from: "Anonymous", message: "Secret game invitation", emoji: "❓", shouldDecline: true },
    { id: 8, from: "Your Friend Emma", message: "Join our team!", emoji: "👧", shouldDecline: false },
    { id: 9, from: "ProGamer2024", message: "Be my partner!", emoji: "🎯", shouldDecline: true },
    { id: 10, from: "Your Neighbor Jake", message: "Let's play!", emoji: "👦", shouldDecline: false },
    { id: 11, from: "FastWin", message: "Easy money! Join!", emoji: "💸", shouldDecline: true },
    { id: 12, from: "Your Friend Lily", message: "New game?", emoji: "👧", shouldDecline: false },
    { id: 13, from: "Mystery Player", message: "Secret level!", emoji: "🔮", shouldDecline: true },
    { id: 14, from: "Your Sibling", message: "Co-op game?", emoji: "👶", shouldDecline: false },
    { id: 15, from: "LuckyWinner", message: "Claim your reward!", emoji: "🎁", shouldDecline: true }
  ];

  const currentInviteData = invites[currentInvite];

  const handleChoice = (shouldDecline) => {
    const isCorrect = currentInviteData.shouldDecline === shouldDecline;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentInvite < invites.length - 1) {
      setTimeout(() => {
        setCurrentInvite(prev => prev + 1);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / invites.length) * 100;
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
    setCurrentInvite(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/safety-poster");
  };

  const accuracy = Math.round((score / invites.length) * 100);

  return (
    <GameShell
      title="Game Invite Reflex"
      score={coins}
      subtitle={gameStarted ? `Invite ${currentInvite + 1} of ${invites.length}` : "Safety Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="dcos-kids-5"
      gameType="educational"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Invite Safety!</h2>
            <p className="text-white/80 mb-6">Accept invites from people you know, decline from strangers!</p>
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
                <span className="text-white/80">Invite {currentInvite + 1}/{invites.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <div className="text-7xl mb-4 text-center">{currentInviteData.emoji}</div>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-white/70 text-sm mb-1">From:</p>
                <p className="text-white text-xl font-bold mb-3">{currentInviteData.from}</p>
                <p className="text-white/90">"{currentInviteData.message}"</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Accept</div>
                </button>
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Decline</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Safe Player Badge!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {invites.length} correct ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Only accept game invites from people you know in real life!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned the Safe Player Badge! 🏆" : "Get 70% or higher to earn the badge!"}
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

export default GameInviteReflex;

