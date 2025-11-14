import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexBlockGame = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isSpam, setIsSpam] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🧩 Five reflex test rounds
  const rounds = [
    { id: 1, icon: "📞", label: "Spam Call!", isSpam: true },
    { id: 2, icon: "💬", label: "Message from Friend", isSpam: false },
    { id: 3, icon: "📞", label: "Spam Call!", isSpam: true },
    { id: 4, icon: "🎮", label: "Game Invite", isSpam: false },
    { id: 5, icon: "📞", label: "Spam Call!", isSpam: true },
  ];

  // 🎮 Round display delay
  useEffect(() => {
    if (gameStarted && !showResult) {
      const delay = Math.random() * 2000 + 1000;
      const timer = setTimeout(() => {
        setIsSpam(rounds[currentRound].isSpam);
        setShowIcon(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, currentRound, showResult]);

  // 🧠 Handle action
  const handleAction = (action) => {
    if (!showIcon) return;

    const correct = (isSpam && action === "block") || (!isSpam && action === "ignore");

    if (correct) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentRound < rounds.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setShowIcon(false);
    } else {
      const finalScore = score + (correct ? 1 : 0);
      const accuracy = (finalScore / rounds.length) * 100;
      if (accuracy >= 70) setCoins(3);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  // 🔄 Retry or Next
  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentRound(0);
    setScore(0);
    setCoins(0);
    setShowIcon(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/scam-aware-badge");
  };

  const accuracy = Math.round((score / rounds.length) * 100);

  return (
    <GameShell
      title="Reflex Block Game"
      subtitle={gameStarted ? `Round ${currentRound + 1} of ${rounds.length}` : "Tap Fast to Stay Safe!"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-49"
      gameType="educational"
      totalLevels={100}
      currentLevel={49}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {/* Start Screen */}
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Tap Fast to Block Spam or Ignore Safe Messages!
            </h2>
            <p className="text-white/80 mb-6">
              When you see a <strong>📞 Spam Call</strong>, tap <strong>Block 🚫</strong>.<br />
              When it’s a <strong>💬 Message from Friend</strong>, tap <strong>Ignore ✅</strong>.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          // 🎮 Game Screen
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">
                  Round {currentRound + 1}/{rounds.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="py-12">
                {showIcon ? (
                  <>
                    <div className="text-9xl mb-4 animate-pulse">{rounds[currentRound].icon}</div>
                    <p className="text-white text-2xl font-bold mb-6">
                      {rounds[currentRound].label}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAction("block")}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-4 border-white rounded-2xl p-6 transition-all transform hover:scale-105 active:scale-95"
                      >
                        <div className="text-white font-bold text-2xl">Block 🚫</div>
                      </button>

                      <button
                        onClick={() => handleAction("ignore")}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-4 border-white rounded-2xl p-6 transition-all transform hover:scale-105 active:scale-95"
                      >
                        <div className="text-white font-bold text-2xl">Ignore ✅</div>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-white/70 text-lg animate-pulse">⏳ Waiting for next call...</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // 🏁 Result Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎯 Spam Defender!" : "⚡ Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You acted correctly {score} out of {rounds.length} times ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always block unknown spam calls and ignore harmless messages smartly!
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

export default ReflexBlockGame;
