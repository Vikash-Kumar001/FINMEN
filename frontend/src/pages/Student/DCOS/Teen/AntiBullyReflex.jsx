import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AntiBullyReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const messages = [
    { id: 1, text: "You're so dumb, nobody likes you", emoji: "😡", isTroll: true },
    { id: 2, text: "Great job on your presentation!", emoji: "👏", isTroll: false },
    { id: 3, text: "Everyone thinks you're ugly", emoji: "😢", isTroll: true },
    { id: 4, text: "Thanks for your help today", emoji: "🙏", isTroll: false },
    { id: 5, text: "You should just quit trying", emoji: "👎", isTroll: true },
    { id: 6, text: "Your idea was really creative", emoji: "💡", isTroll: false },
    { id: 7, text: "Nobody wants you here", emoji: "💔", isTroll: true },
    { id: 8, text: "You're doing amazing!", emoji: "⭐", isTroll: false },
    { id: 9, text: "Loser! Get out of here", emoji: "😠", isTroll: true },
    { id: 10, text: "Love your positive energy!", emoji: "❤️", isTroll: false }
  ];

  useEffect(() => {
    if (gameStarted && showMessage && !showResult) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showMessage, currentMessage, showResult]);

  const currentMessageData = messages[currentMessage];

  const handleAction = (shouldStandUp) => {
    if (showMessage) return;
    
    const isCorrect = currentMessageData.isTroll === shouldStandUp;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentMessage < messages.length - 1) {
      setTimeout(() => {
        setCurrentMessage(prev => prev + 1);
        setShowMessage(true);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / messages.length) * 100;
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
    setCurrentMessage(0);
    setScore(0);
    setCoins(0);
    setShowMessage(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/upstander-simulation");
  };

  const accuracy = Math.round((score / messages.length) * 100);

  return (
    <GameShell
      title="Anti-Bully Reflex"
      subtitle={gameStarted ? `Message ${currentMessage + 1} of ${messages.length}` : "Stand Up Fast!"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-teen-18"
      gameType="dcos"
      totalLevels={20}
      currentLevel={18}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stand Up Against Trolling!</h2>
            <p className="text-white/80 mb-6">Tap "Stand Up" when you see troll messages!</p>
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
                <span className="text-white/80">Message {currentMessage + 1}/{messages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {showMessage ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentMessageData.emoji}</div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="text-white text-2xl font-bold">"{currentMessageData.text}"</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction(true)}
                    className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Stand Up 💪</div>
                  </button>
                  <button
                    onClick={() => handleAction(false)}
                    className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
                  >
                    <div className="text-white font-bold text-2xl">Positive ✓</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Anti-Bully Hero!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You identified {score} out of {messages.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always stand up against trolling and bullying! Block, report, and support victims. 
                Your voice matters!
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

export default AntiBullyReflex;

