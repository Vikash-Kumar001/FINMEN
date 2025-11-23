import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexRightVsEasy = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 situations — user taps “Right” or “Easy”
  const items = [
    { id: 1, text: "Do homework yourself", emoji: "📘", isRight: true },
    { id: 2, text: "Copy a friend’s answers", emoji: "📄", isRight: false },
    { id: 3, text: "Tell truth about mistake", emoji: "💬", isRight: true },
    { id: 4, text: "Blame someone else", emoji: "🙈", isRight: false },
    { id: 5, text: "Help clean up mess", emoji: "🧹", isRight: true },
    { id: 6, text: "Walk away quietly", emoji: "🚶‍♂️", isRight: false },
    { id: 7, text: "Stand up for a friend", emoji: "🦸‍♀️", isRight: true },
    { id: 8, text: "Stay silent to avoid trouble", emoji: "🤫", isRight: false },
    { id: 9, text: "Do the task properly", emoji: "🛠️", isRight: true },
    { id: 10, text: "Find a shortcut", emoji: "⚡", isRight: false },
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

  const handleAction = (isRight) => {
    if (showItem) return;

    const isCorrect = currentItemData.isRight === isRight;

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
    navigate("/student/moral-values/teen/puzzle-of-ethics");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Reflex: Right vs Easy"
      score={coins}
      subtitle={gameStarted ? `Scenario ${currentItem + 1} of ${items.length}` : "Quick Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="moral-teen-93"
      gameType="moral"
      totalLevels={100}
      currentLevel={93}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Choose What’s Right! ⚖️</h2>
            <p className="text-white/80 mb-6">
              Tap <b>Right</b> for good actions, <b>Easy</b> for shortcuts.  
              Be fast and accurate to win coins!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Reflex! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Scenario {currentItem + 1}/{items.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              {showItem ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentItemData.emoji}</div>
                  {currentItemData.text && (
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white text-2xl font-bold">"{currentItemData.text}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction(true)}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Right ✅</div>
                  </button>
                  <button
                    onClick={() => handleAction(false)}
                    className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Easy 😅</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎯 True Hero of Choices!" : "💡 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You chose {score} out of {items.length} right actions ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💬 Doing what’s right may be harder, but it always builds stronger character than taking shortcuts.
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

export default ReflexRightVsEasy;
