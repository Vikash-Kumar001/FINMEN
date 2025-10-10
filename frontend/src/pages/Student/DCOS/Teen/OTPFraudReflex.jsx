import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OTPFraudReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const messages = [
    { id: 1, text: "Your bank: Share OTP to verify account", emoji: "🏦", isScam: true },
    { id: 2, text: "Legit app: Enter OTP in app", emoji: "📱", isScam: false },
    { id: 3, text: "Text: Send OTP to claim prize", emoji: "🎁", isScam: true },
    { id: 4, text: "Your friend: What's the OTP code?", emoji: "👤", isScam: true },
    { id: 5, text: "App notification: OTP for login", emoji: "🔔", isScam: false },
    { id: 6, text: "Email: Verify OTP by replying", emoji: "📧", isScam: true },
    { id: 7, text: "Banking app: Enter OTP here", emoji: "💳", isScam: false },
    { id: 8, text: "Customer service: Tell us your OTP", emoji: "📞", isScam: true },
    { id: 9, text: "Payment gateway: Input OTP", emoji: "💰", isScam: false },
    { id: 10, text: "Win $1000! Share OTP now", emoji: "💸", isScam: true }
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentMessage < messages.length - 1) {
            setCurrentMessage(prev => prev + 1);
            setTimeLeft(3);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / messages.length) * 100;
            if (accuracy >= 70) {
              setCoins(3);
            }
            setShowResult(true);
          }
        }, 500);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentMessage, autoAdvance]);

  const currentMessageData = messages[currentMessage];

  const handleChoice = (isBlock) => {
    const isCorrect = currentMessageData.isScam === isBlock;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setAutoAdvance(true);
    setTimeout(() => {
      if (currentMessage < messages.length - 1) {
        setCurrentMessage(prev => prev + 1);
        setTimeLeft(3);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / messages.length) * 100;
        if (accuracy >= 70) {
          setCoins(3);
        }
        setScore(finalScore);
        setShowResult(true);
      }
    }, 300);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentMessage(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(3);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/profile-picture-simulation");
  };

  const accuracy = Math.round((score / messages.length) * 100);

  return (
    <GameShell
      title="OTP Fraud Reflex"
      subtitle={gameStarted ? `Message ${currentMessage + 1} of ${messages.length}` : "Scam Detection Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-teen-3"
      gameType="dcos"
      totalLevels={20}
      currentLevel={3}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Detect OTP Scams!</h2>
            <p className="text-white/80 mb-6">NEVER share OTP with anyone. Block scam messages!</p>
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
              
              <div className="bg-red-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>
              
              <div className="text-8xl mb-4 text-center animate-pulse">{currentMessageData.emoji}</div>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-white text-lg font-semibold text-center">{currentMessageData.text}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Block 🚫</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Trust ✓</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Scam Detector!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You detected {score} out of {messages.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Never share OTP with anyone - not banks, customer service, or friends. 
                Only enter OTP directly in secure apps!
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

export default OTPFraudReflex;

