import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmojiReflex1 = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSituation, setShowSituation] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 👇 5 quick post scenarios for reflex test
  const situations = [
    { id: 1, text: "I love playing with my friends!", emoji: "😊", type: "positive" },
    { id: 2, text: "You look so weird today!", emoji: "😠", type: "rude" },
    { id: 3, text: "Congrats on your new puppy!", emoji: "🐶", type: "positive" },
    { id: 4, text: "That’s such a dumb idea!", emoji: "😤", type: "rude" },
    { id: 5, text: "Had a great match today! ⚽", emoji: "🎉", type: "positive" },
  ];

  // 👇 Each post appears briefly
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
    const isCorrect =
      (situation.type === "positive" && action === "tap") ||
      (situation.type === "rude" && action === "ignore");

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
    navigate("/student/dcos/kids/school-reputation-story");
  };

  const currentSituationData = situations[currentSituation];
  const accuracy = Math.round((score / situations.length) * 100);

  return (
    <GameShell
      title="Emoji Reflex1"
      subtitle={gameStarted ? `Post ${currentSituation + 1} of ${situations.length}` : "Positive vs Rude Posts"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-65"
      gameType="reflex"
      totalLevels={100}
      currentLevel={65}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tap for Kind Posts! 💬</h2>
            <p className="text-white/80 mb-6">
              If the post is <span className="text-green-400 font-semibold">positive</span>, tap fast!  
              If it's <span className="text-red-400 font-semibold">rude</span>, ignore it!
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Post {currentSituation + 1}/{situations.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              {showSituation ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentSituationData.emoji}</div>
                  <p className="text-white text-2xl font-bold">{currentSituationData.text}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white text-xl font-bold mb-6 text-center">What do you do?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => handleAction("tap")}
                      className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-white font-bold text-3xl">Tap 💚</div>
                    </button>
                    <button
                      onClick={() => handleAction("ignore")}
                      className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-white font-bold text-3xl">Ignore 🚫</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🌟 Smart Scroller!" : "💬 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You reacted correctly to {score} of {situations.length} posts ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always engage with positive posts and ignore rude ones. That’s how we spread kindness online!
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

export default EmojiReflex1;
