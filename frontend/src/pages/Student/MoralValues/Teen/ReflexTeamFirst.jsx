import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTeamFirst = () => {
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
  const [showItem, setShowItem] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🧩 5 Reflex items - Tap when “Serve Others” (team first), not “Me First”
  const items = [
    { id: 1, text: "Serve Others", emoji: "🤝", isTeamFirst: true },
    { id: 2, text: "Me First", emoji: "🙋‍♂️", isTeamFirst: false },
    { id: 3, text: "Help the Group", emoji: "💪", isTeamFirst: true },
    { id: 4, text: "Take Credit Alone", emoji: "🏅", isTeamFirst: false },
    { id: 5, text: "Support a Teammate", emoji: "💬", isTeamFirst: true },
    { id: 6, text: "Ignore Others", emoji: "🚫", isTeamFirst: false },
    { id: 7, text: "Encourage Teamwork", emoji: "🌟", isTeamFirst: true },
    { id: 8, text: "Blame Others", emoji: "😠", isTeamFirst: false },
    { id: 9, text: "Lift Each Other", emoji: "🙌", isTeamFirst: true },
    { id: 10, text: "Only I Matter", emoji: "😤", isTeamFirst: false },
  ];

  useEffect(() => {
    if (gameStarted && showItem && !showResult) {
      const timer = setTimeout(() => {
        setShowItem(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showItem, currentItem, showResult]);

  const currentItemData = items[currentItem];

  const handleAction = (isTeamFirst) => {
    if (showItem) return;

    const isCorrect = currentItemData.isTeamFirst === isTeamFirst;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem((prev) => prev + 1);
        setShowItem(true);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / items.length) * 100;
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
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setShowItem(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/badge-service-leader");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Reflex: Team First"
      score={coins}
      subtitle={
        gameStarted
          ? `Item ${currentItem + 1} of ${items.length}`
          : "Tap for 'Serve Others' — not 'Me First!'"
      }
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="moral-teen-reflex-team-first-79"
      gameType="moral"
      totalLevels={100}
      currentLevel={79}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Reflex Challenge: Team First</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="text-green-400 font-bold">“Serve Others”</span> messages and
              avoid <span className="text-red-400 font-bold">“Me First”</span> ones!
            </p>
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
                <span className="text-white/80">
                  Item {currentItem + 1}/{items.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              {showItem ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentItemData.emoji}</div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white text-2xl font-bold">
                      “{currentItemData.text}”
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction(true)}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Serve Others 🤝</div>
                  </button>
                  <button
                    onClick={() => handleAction(false)}
                    className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Me First 🚫</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🌟 True Team Player!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You identified {score} out of {items.length} correctly ({accuracy}%)
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Great leaders put the team first. Serving others builds trust and unity!
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

export default ReflexTeamFirst;
