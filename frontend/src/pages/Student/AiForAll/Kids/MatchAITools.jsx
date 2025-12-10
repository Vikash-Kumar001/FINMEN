import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MatchAITools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, name: "Google Maps", emoji: "🗺️", isAI: true },
    { id: 2, name: "Pencil", emoji: "✏️", isAI: false },
    { id: 3, name: "Siri", emoji: "🔊", isAI: true },
    { id: 4, name: "Book", emoji: "📖", isAI: false },
    { id: 5, name: "Netflix Recommendations", emoji: "📺", isAI: true }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.isAI;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
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
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/pattern-music-game");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Match AI Tools"
      score={score}
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-12"
      gameType="ai"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this an AI tool?</h3>
            
            <div className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl p-12 mb-6">
              <div className="text-9xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-2xl font-bold text-center">{currentItemData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🤖</div>
                <div className="text-white font-bold text-xl">AI Tool</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-gray-500/30 hover:bg-gray-500/50 border-3 border-gray-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🔧</div>
                <div className="text-white font-bold text-xl">Not AI</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 AI Detective!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You identified {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI is in many tools we use daily! Google Maps, Siri, and Netflix all use AI!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
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

export default MatchAITools;