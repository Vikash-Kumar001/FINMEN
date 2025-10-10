import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MachineVsHumanReflex = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, emoji: "👨‍🏫", name: "Teacher", type: "human" },
    { id: 2, emoji: "🤖", name: "Robot", type: "ai" },
    { id: 3, emoji: "👨‍⚕️", name: "Doctor", type: "human" },
    { id: 4, emoji: "🚗", name: "Self-Driving Car", type: "ai" },
    { id: 5, emoji: "👩‍💼", name: "Manager", type: "human" },
    { id: 6, emoji: "💬", name: "Chatbot", type: "ai" },
    { id: 7, emoji: "👨‍🎨", name: "Artist", type: "human" },
    { id: 8, emoji: "📱", name: "Smart Assistant", type: "ai" },
    { id: 9, emoji: "👶", name: "Baby", type: "human" },
    { id: 10, emoji: "🎮", name: "Game AI", type: "ai" }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.type;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
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
    navigate("/student/ai-for-all/teen/language-ai-quiz");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Machine vs Human Reflex"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-teen-15"
      gameType="ai"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this Human or AI?</h3>
            
            <div className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl p-12 mb-6">
              <div className="text-9xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-2xl font-bold text-center">{currentItemData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("human")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">👤</div>
                <div className="text-white font-bold text-xl">HUMAN</div>
              </button>
              <button
                onClick={() => handleChoice("ai")}
                className="bg-purple-500/30 hover:bg-purple-500/50 border-3 border-purple-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🤖</div>
                <div className="text-white font-bold text-xl">AI</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 AI Identifier!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You identified {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Distinguishing human intelligence from AI is important! Understanding where AI is 
                used helps us appreciate both human creativity and machine capabilities!
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

export default MachineVsHumanReflex;

