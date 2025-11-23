import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CartoonNewsReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentNews, setCurrentNews] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 📰 Cartoon News headlines (some are silly/fake, some are real/positive)
  const newsItems = [
    { id: 1, text: "Duck becomes mayor of a city 🦆🏛️", isFake: true },
    { id: 2, text: "Kids plant trees to save local park 🌳", isFake: false },
    { id: 3, text: "Robot eats 100 pizzas in one hour 🤖🍕", isFake: true },
    { id: 4, text: "School wins award for clean energy project ⚡", isFake: false },
    { id: 5, text: "Fish learns to play video games 🎮🐠", isFake: true }
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Time's up — move to next
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentNews < newsItems.length - 1) {
            setCurrentNews(prev => prev + 1);
            setTimeLeft(2);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / newsItems.length) * 100;
            if (accuracy >= 70) {
              setCoins(3);
            }
            setShowResult(true);
          }
        }, 800);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentNews, autoAdvance]);

  const currentNewsData = newsItems[currentNews];

  const handleChoice = (isFakeChoice) => {
    const isCorrect = currentNewsData.isFake === isFakeChoice;
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentNews < newsItems.length - 1) {
        setCurrentNews(prev => prev + 1);
        setTimeLeft(2);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / newsItems.length) * 100;
        if (accuracy >= 70) {
          setCoins(3);
        }
        setScore(finalScore);
        setShowResult(true);
      }
    }, 300);
  };

  const handleTryAgain = () => {
    setGameStarted(false);
    setCurrentNews(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    setTimeLeft(2);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/forward-message-story");
  };

  const accuracy = Math.round((score / newsItems.length) * 100);

  return (
    <GameShell
      title="Cartoon News Reflex"
      score={coins}
      subtitle={gameStarted ? `News ${currentNews + 1} of ${newsItems.length}` : "Spot the Fake News!"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="dcos-kids-32"
      gameType="reflex"
      totalLevels={100}
      currentLevel={32}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tap “Fake” when you see silly news!</h2>
            <p className="text-white/80 mb-6">
              Be quick! Some headlines are just funny cartoons — not real news!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 📰🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">News {currentNews + 1}/{newsItems.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="bg-blue-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>

              <h2 className="text-white text-3xl font-bold text-center mb-8 leading-relaxed">
                {currentNewsData.text}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Fake 🚫</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Real ✅</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "📰 Smart News Detective!" : "🤔 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You spotted {score} correct out of {newsItems.length} ({accuracy}%)
            </p>
            <div className="bg-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Tip: Always check if a headline sounds too funny or impossible — it might be fake!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned +3 Coins! 🪙" : "Get 70% or more to earn coins!"}
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

export default CartoonNewsReflex;
