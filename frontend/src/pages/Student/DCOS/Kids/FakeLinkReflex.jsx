import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FakeLinkReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSituation, setShowSituation] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ⚠️ 5 Phishing/Fake Link reflex situations
  const situations = [
    { id: 1, text: "You see a pop-up saying 'Free iPhone if you click!'", emoji: "📱", correctAction: "ignore" },
    { id: 2, text: "A message says 'Your account is locked! Click here to fix it!'", emoji: "🔒", correctAction: "ignore" },
    { id: 3, text: "You get a link promising free game coins!", emoji: "🎮", correctAction: "ignore" },
    { id: 4, text: "Email says 'You won a lottery!' and has a link", emoji: "💰", correctAction: "ignore" },
    { id: 5, text: "Website link looks like www.go0gle.com", emoji: "🌐", correctAction: "ignore" }
  ];

  useEffect(() => {
    if (gameStarted && showSituation && !showResult) {
      const timer = setTimeout(() => {
        setShowSituation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showSituation, currentSituation, showResult]);

  const handleAction = (action) => {
    if (showSituation) return;

    const situation = situations[currentSituation];
    const isCorrect = action === situation.correctAction;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentSituation < situations.length - 1) {
      setCurrentSituation((prev) => prev + 1);
      setShowSituation(true);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / situations.length) * 100;
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
    setCurrentSituation(0);
    setScore(0);
    setCoins(0);
    setShowSituation(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/game-coin-scam-quiz");
  };

  const currentSituationData = situations[currentSituation];
  const accuracy = Math.round((score / situations.length) * 100);

  return (
    <GameShell
      title="Fake Link Reflex"
      subtitle={gameStarted ? `Scenario ${currentSituation + 1} of ${situations.length}` : "Quick Reflex Challenge"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-42"
      gameType="educational"
      totalLevels={100}
      currentLevel={42}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Spot the Fake Links!</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="font-bold text-yellow-300">“Don’t Click”</span> when you see a suspicious link or pop-up.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Reflex Game ⚡
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Scenario {currentSituation + 1}/{situations.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              {showSituation ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentSituationData.emoji}</div>
                  <p className="text-white text-2xl font-bold">{currentSituationData.text}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white text-xl font-bold mb-6 text-center">Quick! What do you do?</h3>
                  <button
                    onClick={() => handleAction("ignore")}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-white font-bold text-3xl">Don’t Click 🚫</div>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Safe Kid!" : "⚠️ Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made the right choice {score} out of {situations.length} times ({accuracy}%)
            </p>
            <div className="bg-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always check links before clicking. Fake links can steal your info!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned +3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
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

export default FakeLinkReflex;
