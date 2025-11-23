import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VoiceAssistantReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, emoji: "🎵", text: "Play Music", type: "voice" },
    { id: 2, emoji: "⏰", text: "Set Alarm", type: "voice" },
    { id: 3, emoji: "📷", text: "Open Camera", type: "other" },
    { id: 4, emoji: "📰", text: "Read News", type: "voice" },
    { id: 5, emoji: "💡", text: "Turn on Lights", type: "other" },
    { id: 6, emoji: "🎧", text: "Play Podcast", type: "voice" },
    { id: 7, emoji: "📞", text: "Call Mom", type: "other" },
    { id: 8, emoji: "📺", text: "Play TV Show", type: "voice" },
    { id: 9, emoji: "📝", text: "Open Notes", type: "other" },
    { id: 10, emoji: "🎹", text: "Play Piano App", type: "voice" }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.type;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // Each correct earns 1 coin
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/social-media-recommendation-game"); // Update with actual next game path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Voice Assistant Reflex"
      score={coins}
      subtitle={`Task ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-teen-27"
      gameType="ai"
      totalLevels={30}
      currentLevel={27}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Which is Voice AI?</h3>
            
            <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl p-12 mb-6">
              <div className="text-7xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-4xl text-white font-bold text-center">{currentItemData.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("voice")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🎤</div>
                <div className="text-white font-bold text-xl">Voice AI</div>
              </button>
              <button
                onClick={() => handleChoice("other")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">❌</div>
                <div className="text-white font-bold text-xl">Other</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Voice AI Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You identified {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Voice assistants like Siri, Alexa, and Google Assistant use AI to understand commands and perform tasks quickly.
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

export default VoiceAssistantReflex;
