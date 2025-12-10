import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpamVsNotSpam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentEmail, setCurrentEmail] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const emails = [
    { id: 1, subject: "Win money free!", emoji: "💰", type: "spam", correct: "spam" },
    { id: 2, subject: "Homework update from teacher", emoji: "📚", type: "not-spam", correct: "not-spam" },
    { id: 3, subject: "Click here for prize!", emoji: "🎁", type: "spam", correct: "spam" },
    { id: 4, subject: "Parent-teacher meeting notice", emoji: "👨‍👩‍👧", type: "not-spam", correct: "not-spam" },
    { id: 5, subject: "You won $1 million!", emoji: "💸", type: "spam", correct: "spam" }
  ];

  const currentEmailData = emails[currentEmail];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentEmailData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentEmail < emails.length - 1) {
      setTimeout(() => {
        setCurrentEmail(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentEmail(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/siri-alexa-quiz");
  };

  const accuracy = Math.round((score / emails.length) * 100);

  return (
    <GameShell
      title="Spam vs Not Spam"
      score={coins}
      subtitle={`Email ${currentEmail + 1} of ${emails.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-9"
      gameType="ai"
      totalLevels={20}
      currentLevel={9}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this email Spam or Not Spam?</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{currentEmailData.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">"{currentEmailData.subject}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("spam")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🚫</div>
                <div className="text-white font-bold text-xl">SPAM</div>
              </button>
              <button
                onClick={() => handleChoice("not-spam")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">✓</div>
                <div className="text-white font-bold text-xl">NOT SPAM</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Spam Filter Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You filtered {score} out of {emails.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI email filters work just like this! They learn to recognize spam and keep your inbox clean!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default SpamVsNotSpam;