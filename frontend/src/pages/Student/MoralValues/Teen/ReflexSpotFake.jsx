import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexSpotFake = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHeadline, setShowHeadline] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const headlines = [
    { id: 1, text: "ALIENS LANDED IN NEW YORK!", emoji: "👽", isFake: true },
    { id: 2, text: "Local school wins science fair", emoji: "🏆", isFake: false },
    { id: 3, text: "Drink this to live forever!", emoji: "🧪", isFake: true },
    { id: 4, text: "Weather forecast: Rain tomorrow", emoji: "🌧️", isFake: false },
    { id: 5, text: "Lose 20kg in 1 day - GUARANTEED!", emoji: "⚖️", isFake: true },
    { id: 6, text: "New library opens downtown", emoji: "📚", isFake: false },
    { id: 7, text: "Scientists discover time travel!", emoji: "⏰", isFake: true },
    { id: 8, text: "Basketball team wins championship", emoji: "🏀", isFake: false },
    { id: 9, text: "This one trick makes you rich!", emoji: "💰", isFake: true },
    { id: 10, text: "School announces winter break dates", emoji: "❄️", isFake: false }
  ];

  useEffect(() => {
    if (gameStarted && showHeadline && !showResult) {
      const timer = setTimeout(() => {
        setShowHeadline(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showHeadline, currentHeadline, showResult]);

  const currentHeadlineData = headlines[currentHeadline];

  const handleAction = (isFake) => {
    if (showHeadline) return;
    
    const isCorrect = currentHeadlineData.isFake === isFake;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentHeadline < headlines.length - 1) {
      setTimeout(() => {
        setCurrentHeadline(prev => prev + 1);
        setShowHeadline(true);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / headlines.length) * 100;
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
    setCurrentHeadline(0);
    setScore(0);
    setCoins(0);
    setShowHeadline(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/puzzle-of-integrity");
  };

  const accuracy = Math.round((score / headlines.length) * 100);

  return (
    <GameShell
      title="Reflex: Spot Fake"
      subtitle={gameStarted ? `Headline ${currentHeadline + 1} of ${headlines.length}` : "Fake News Detection"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="moral-teen-3"
      gameType="moral"
      totalLevels={20}
      currentLevel={3}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Spot Fake News!</h2>
            <p className="text-white/80 mb-6">Quickly identify fake vs real headlines!</p>
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
                <span className="text-white/80">Headline {currentHeadline + 1}/{headlines.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {showHeadline ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentHeadlineData.emoji}</div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="text-white text-2xl font-bold">{currentHeadlineData.text}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction(true)}
                    className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Fake News 🚫</div>
                  </button>
                  <button
                    onClick={() => handleAction(false)}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Real News ✓</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Fact Checker!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You identified {score} out of {headlines.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Fake news often uses sensational claims, impossible promises, and emotional language. 
                Always verify information from trusted sources!
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

export default ReflexSpotFake;

