import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexShareSafe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPost, setCurrentPost] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const posts = [
    { id: 1, text: "Helping animals is cool! 🐾", emoji: "❤️", safeToShare: true },
    { id: 2, text: "This rumor about my classmate… 🤐", emoji: "⚠️", safeToShare: false },
    { id: 3, text: "Happy Friendship Day everyone! 🤝", emoji: "🎉", safeToShare: true },
    { id: 4, text: "Look at this embarrassing photo 😬", emoji: "🚫", safeToShare: false },
    { id: 5, text: "Let’s clean our park together 🌳", emoji: "🌟", safeToShare: true }
  ];

  const currentPostData = posts[currentPost];

  const handleChoice = (shared) => {
    const isCorrect = currentPostData.safeToShare === shared;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentPost < posts.length - 1) {
      setTimeout(() => {
        setCurrentPost((prev) => prev + 1);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / posts.length) * 100;
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
    setCurrentPost(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/footprint-badge");
  };

  const accuracy = Math.round((score / posts.length) * 100);

  return (
    <GameShell
      title="Reflex Share Safe"
      score={coins}
      subtitle={gameStarted ? `Post ${currentPost + 1} of ${posts.length}` : "Safe Sharing Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="dcos-kids-69"
      gameType="educational"
      totalLevels={100}
      currentLevel={69}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Think Before You Share!</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="text-green-400 font-semibold">“Share”</span> only on positive, safe posts.
            </p>
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
                <span className="text-white/80">
                  Post {currentPost + 1}/{posts.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="text-7xl mb-4 text-center">{currentPostData.emoji}</div>

              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-white/90 text-lg font-semibold text-center">
                  "{currentPostData.text}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Share ✅</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Skip 🚫</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Safe Sharer Badge!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {posts.length} correct ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always share positive, safe posts that make others happy and avoid hurtful ones.
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

export default ReflexShareSafe;
