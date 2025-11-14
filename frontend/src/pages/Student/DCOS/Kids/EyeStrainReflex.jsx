import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EyeStrainReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSituation, setShowSituation] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const situations = [
    {
      id: 1,
      text: "You’ve been looking at your screen for 25 minutes.",
      emoji: "💻",
      correctAction: "rest",
    },
    {
      id: 2,
      text: "You just started a new online video.",
      emoji: "🎬",
      correctAction: "wait",
    },
    {
      id: 3,
      text: "Your eyes feel dry and tired.",
      emoji: "🥱",
      correctAction: "rest",
    },
    {
      id: 4,
      text: "You took a short 5-minute break recently.",
      emoji: "🕒",
      correctAction: "wait",
    },
    {
      id: 5,
      text: "You’ve been studying for 30 minutes straight.",
      emoji: "📖",
      correctAction: "rest",
    },
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
    const isCorrect = situation.correctAction === "rest" ? action === "rest" : action === "wait";

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
      if (accuracy >= 70) setCoins(3);
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
    navigate("/student/dcos/kids/sleep-quiz");
  };

  const currentSituationData = situations[currentSituation];
  const accuracy = Math.round((score / situations.length) * 100);

  return (
    <GameShell
      title="Eye Strain Reflex"
      subtitle={gameStarted ? `Situation ${currentSituation + 1} of ${situations.length}` : "Tap Rest After 20 Minutes"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-24"
      gameType="educational"
      totalLevels={100}
      currentLevel={24}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Keep Your Eyes Healthy!</h2>
            <p className="text-white/80 mb-6">
              Watch the screen and tap “Rest 💤” when it’s time to take a break.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 👀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">
                  Situation {currentSituation + 1}/{situations.length}
                </span>
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
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => handleAction("rest")}
                      className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-white font-bold text-3xl">Tap Rest 💤</div>
                    </button>

                    <button
                      onClick={() => handleAction("wait")}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-white font-bold text-3xl">Keep Watching 👁️</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🌟 Eye Care Champion!" : "🕒 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made the right eye choices {score} out of {situations.length} times ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Resting your eyes every 20 minutes keeps them healthy and prevents strain. Great job staying aware!
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

export default EyeStrainReflex;
