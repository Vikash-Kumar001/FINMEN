import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexBraveSymbol = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const items = [
    {
      id: 1,
      text: "You see a Brave Shield appear on screen!",
      emoji: "🛡️",
      isBrave: true,
    },
    {
      id: 2,
      text: "A Normal Star sparkles in the corner.",
      emoji: "⭐",
      isBrave: false,
    },
    {
      id: 3,
      text: "You spot a Brave Sword shining bright!",
      emoji: "⚔️",
      isBrave: true,
    },
    {
      id: 4,
      text: "A Regular Book appears — seems calm.",
      emoji: "📖",
      isBrave: false,
    },
    {
      id: 5,
      text: "A Glowing Brave Crown appears majestically!",
      emoji: "👑",
      isBrave: true,
    },
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        handleChoice("ignore");
      }
    }
  }, [timeLeft, gameStarted, showResult, autoAdvance]);

  const currentItemData = items[currentItem];

  const handleChoice = (action) => {
    const isCorrect = (currentItemData.isBrave && action === "tap") ||
      (!currentItemData.isBrave && action === "ignore");

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentItem < items.length - 1) {
        setCurrentItem((prev) => prev + 1);
        setTimeLeft(3);
        setAutoAdvance(false);
      } else {
        const accuracy = ((isCorrect ? score + 1 : score) / items.length) * 100;
        if (accuracy >= 70) setCoins(3);
        setScore((s) => (isCorrect ? s + 1 : s));
        setShowResult(true);
      }
    }, 400);
  };

  const handleTryAgain = () => {
    setGameStarted(false);
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(3);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/badge-brave-kid");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Reflex Brave Symbol"
      score={coins}
      subtitle={
        gameStarted
          ? `Item ${currentItem + 1} of ${items.length}`
          : "Choose Fast: Brave or Not?"
      }
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="moral-kids-59"
      gameType="educational"
      totalLevels={100}
      currentLevel={59}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Reflex Challenge!
            </h2>
            <p className="text-white/80 mb-6">
              When a Brave Symbol appears, tap “Brave Action.” Otherwise, choose “Ignore.”
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <div className="flex justify-between mb-4">
                <span className="text-white/70">
                  Item {currentItem + 1}/{items.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="text-7xl mb-4 animate-pulse">{currentItemData.emoji}</div>
              <h2 className="text-white text-2xl font-bold mb-4">
                {currentItemData.text}
              </h2>
              <p className="text-white/80 mb-4">Time left: {timeLeft}s</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => handleChoice("tap")}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-2 border-green-400 rounded-xl p-5 text-white font-bold text-lg transition transform hover:scale-105 disabled:opacity-50"
                >
                  Brave Action ⚡
                </button>
                <button
                  onClick={() => handleChoice("ignore")}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-2 border-red-400 rounded-xl p-5 text-white font-bold text-lg transition transform hover:scale-105 disabled:opacity-50"
                >
                  Ignore 🚫
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Brave Reflex Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              You got {score} out of {items.length} correct ({accuracy}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70%+ to earn coins!"}
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

export default ReflexBraveSymbol;
