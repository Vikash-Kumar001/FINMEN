import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GossipReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChat, setCurrentChat] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const chats = [
    { id: 1, text: "Did you hear Riya failed her exam?", emoji: "💬", isGossip: true },
    { id: 2, text: "Let’s help Riya study next time!", emoji: "🤝", isGossip: false },
    { id: 3, text: "He looks so weird in that photo!", emoji: "😬", isGossip: true },
    { id: 4, text: "Congrats to everyone who passed!", emoji: "🎉", isGossip: false },
    { id: 5, text: "She thinks she’s better than us!", emoji: "😠", isGossip: true }
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // auto move to next message
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentChat < chats.length - 1) {
            setCurrentChat(prev => prev + 1);
            setTimeLeft(2);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / chats.length) * 100;
            if (accuracy >= 70) setCoins(3);
            setShowResult(true);
          }
        }, 900);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentChat, autoAdvance]);

  const currentChatData = chats[currentChat];

  const handleChoice = (shouldStop) => {
    const isCorrect = currentChatData.isGossip === shouldStop;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentChat < chats.length - 1) {
        setCurrentChat(prev => prev + 1);
        setTimeLeft(2);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / chats.length) * 100;
        if (accuracy >= 70) setCoins(3);
        setScore(finalScore);
        setShowResult(true);
      }
    }, 300);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentChat(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(2);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/family-talk-story");
  };

  const accuracy = Math.round((score / chats.length) * 100);

  return (
    <GameShell
      title="Gossip Reflex"
      subtitle={gameStarted ? `Chat ${currentChat + 1} of ${chats.length}` : "Stop Rumors in Time!"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-35"
      gameType="reflex"
      totalLevels={100}
      currentLevel={35}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">🚫 Stop Gossip in Class Chat!</h2>
            <p className="text-white/80 mb-6">
              Tap “Stop” when you see a rumor spreading. Tap “Safe” for normal messages.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game 💬
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Chat {currentChat + 1}/{chats.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="bg-blue-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>

              <div className="text-7xl mb-4 text-center animate-pulse">{currentChatData.emoji}</div>
              <h2 className="text-white text-3xl font-semibold text-center mb-8">{currentChatData.text}</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Stop 🚫</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Safe ✅</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🛡️ Gossip Stopper!" : "🙌 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You stopped {score} out of {chats.length} gossips ({accuracy}%)
            </p>
            <div className="bg-purple-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Rumors hurt feelings. Be the one who ends gossip — not spreads it!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default GossipReflex;
