import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FraudDetectorReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentMessage, setCurrentMessage] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 👇 Messages to detect — some are fraud, some are safe
  const messages = [
    { id: 1, text: "Win 1 lakh now!", isFraud: true },
    { id: 2, text: "Meeting at 5 PM", isFraud: false },
    { id: 3, text: "You won a lottery!", isFraud: true },
    { id: 4, text: "Lunch with team tomorrow", isFraud: false },
    { id: 5, text: "Claim your prize immediately!", isFraud: true },
  ];

  const handleClick = (clickedFraud) => {
    const current = messages[currentMessage];
    const isCorrect = clickedFraud === current.isFraud;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 5);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentMessage < messages.length - 1) {
      setTimeout(() => setCurrentMessage((prev) => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentMessage(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-in-movies-quiz"); // replace with actual next game path
  };

  const accuracy = Math.round((score / messages.length) * 100);

  return (
    <GameShell
      title="Fraud Detector Reflex"
      score={coins}
      subtitle={`Message ${currentMessage + 1} of ${messages.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-35"
      gameType="ai"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-white text-xl font-bold mb-6">
              Click “Fraud” if message seems suspicious 👇
            </h3>

            <div className="bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-xl p-12 mb-6">
              <p className="text-white text-3xl font-bold">{messages[currentMessage].text}</p>
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleClick(true)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl px-10 py-5 text-white font-bold text-xl transition-all transform hover:scale-105"
              >
                Fraud 🚨
              </button>
              <button
                onClick={() => handleClick(false)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl px-10 py-5 text-white font-bold text-xl transition-all transform hover:scale-105"
              >
                Safe ✅
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Cyber Defender!" : "⚠️ Keep Alert!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You correctly identified {score} out of {messages.length} messages! ({accuracy}%)
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI in cybersecurity helps detect phishing and fraud messages. Stay alert and earn rewards! 🛡️
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned {coins} Coins! 🪙
            </p>

            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FraudDetectorReflex;
