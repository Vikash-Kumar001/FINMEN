import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexDeepfakeSpotter = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showClip, setShowClip] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const clips = [
    { id: 1, text: "A cartoon of a famous actor saying strange things never said before", emoji: "🎬", isFake: true },
    { id: 2, text: "A cartoon of your school teacher giving an online class", emoji: "👩‍🏫", isFake: false },
    { id: 3, text: "A cartoon of a celebrity promoting a random product", emoji: "🛍️", isFake: true },
    { id: 4, text: "A cartoon of your favorite singer performing their actual song", emoji: "🎤", isFake: false },
    { id: 5, text: "A cartoon of a politician saying weird words or jokes", emoji: "🎭", isFake: true }
  ];

  // Auto-hide each clip after 2 seconds before user can react
  useEffect(() => {
    if (gameStarted && showClip && !showResult) {
      const timer = setTimeout(() => {
        setShowClip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showClip, currentSituation, showResult]);

  const handleAction = (action) => {
    if (showClip) return; // Prevent early tap

    const currentClip = clips[currentSituation];
    const isCorrect = (currentClip.isFake && action === "spot") || (!currentClip.isFake && action === "ignore");

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentSituation < clips.length - 1) {
      setCurrentSituation(prev => prev + 1);
      setShowClip(true);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / clips.length) * 100;
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
    setShowClip(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/poster-task2");
  };

  const currentClipData = clips[currentSituation];
  const accuracy = Math.round((score / clips.length) * 100);

  return (
    <GameShell
      title="Reflex Deepfake Spotter"
      subtitle={gameStarted ? `Clip ${currentSituation + 1} of ${clips.length}` : "Spot the Fake Fast!"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-76"
      gameType="reflex"
      totalLevels={100}
      currentLevel={76}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Spot Deepfakes in Time!</h2>
            <p className="text-white/80 mb-6">
              Watch cartoon clips carefully. Tap <span className="font-bold text-yellow-400">“Spot Fake”</span> if the video looks fake!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🎥
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Clip {currentSituation + 1}/{clips.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              {showClip ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-pulse">{currentClipData.emoji}</div>
                  <p className="text-white text-2xl font-bold">{currentClipData.text}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white text-xl font-bold mb-6 text-center">What do you do?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAction("spot")}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-white font-bold text-3xl text-center">Spot Fake 🚨</div>
                    </button>
                    <button
                      onClick={() => handleAction("ignore")}
                      className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-white font-bold text-3xl text-center">Looks Real 👍</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Great Spotter!" : "👀 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You spotted {score} out of {clips.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Deepfakes can look real, but always check for weird lips, voices, or lighting. Stay alert online!
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

export default ReflexDeepfakeSpotter;
