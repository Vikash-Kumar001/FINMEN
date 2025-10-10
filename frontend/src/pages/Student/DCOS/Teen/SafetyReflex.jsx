import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showAd, setShowAd] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const ads = [
    { id: 1, text: "WIN $10,000! Click NOW!", emoji: "💰", isScam: true },
    { id: 2, text: "Amazon: Your order shipped", emoji: "📦", isScam: false },
    { id: 3, text: "FREE iPhone! Claim yours!", emoji: "📱", isScam: true },
    { id: 4, text: "Netflix: New episodes available", emoji: "📺", isScam: false },
    { id: 5, text: "You're the 1 millionth visitor!", emoji: "🎉", isScam: true },
    { id: 6, text: "YouTube: New video uploaded", emoji: "▶️", isScam: false },
    { id: 7, text: "Download NOW to speed up PC!", emoji: "⚡", isScam: true },
    { id: 8, text: "Email notification from Gmail", emoji: "✉️", isScam: false },
    { id: 9, text: "Hot singles in your area!", emoji: "💋", isScam: true },
    { id: 10, text: "App update available", emoji: "🔄", isScam: false }
  ];

  useEffect(() => {
    if (gameStarted && showAd && !showResult) {
      const timer = setTimeout(() => {
        setShowAd(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showAd, currentAd, showResult]);

  const currentAdData = ads[currentAd];

  const handleAction = (shouldReport) => {
    if (showAd) return;
    
    const isCorrect = currentAdData.isScam === shouldReport;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentAd < ads.length - 1) {
      setTimeout(() => {
        setCurrentAd(prev => prev + 1);
        setShowAd(true);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / ads.length) * 100;
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
    setCurrentAd(0);
    setScore(0);
    setCoins(0);
    setShowAd(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/debate-stage-online-friends");
  };

  const accuracy = Math.round((score / ads.length) * 100);

  return (
    <GameShell
      title="Safety Reflex"
      subtitle={gameStarted ? `Ad ${currentAd + 1} of ${ads.length}` : "Scam Detection"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-teen-8"
      gameType="dcos"
      totalLevels={20}
      currentLevel={8}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Detect Scam Ads!</h2>
            <p className="text-white/80 mb-6">Click "Report" when you see a scam ad!</p>
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
                <span className="text-white/80">Ad {currentAd + 1}/{ads.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {showAd ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentAdData.emoji}</div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white text-2xl font-bold">{currentAdData.text}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction(true)}
                    className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Report 🚫</div>
                  </button>
                  <button
                    onClick={() => handleAction(false)}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Safe ✓</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Scam Detector!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You detected {score} out of {ads.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Scam ads use urgent language, impossible prizes, and flashy designs. 
                Legit notifications are simple and specific!
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

export default SafetyReflex;

