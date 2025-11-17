import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FutureAIReflection = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleSubmit = () => {
    if (userInput.trim().length > 0) {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
      setShowFeedback(true);
    } else {
      flashPoints(0); // optional feedback for empty input
    }
  };

  const handleTryAgain = () => {
    setUserInput("");
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-basics-badge"); // Update with next game path
  };

  return (
    <GameShell
      title="Future of AI Reflection ✍️"
      subtitle="AI in 2050"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="ai-teen-24"
      gameType="input"
      totalLevels={20}
      currentLevel={24}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8 text-center">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">🤖</div>
            <h3 className="text-white text-2xl font-bold mb-4">Imagine the future!</h3>
            <p className="text-white/90 mb-6">
              Write one thing AI can do in 2050.
            </p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your idea here..."
              className="w-full bg-white/20 text-white p-4 rounded-xl border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-40 mb-6"
            />
            <button
              onClick={handleSubmit}
              disabled={userInput.trim().length === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                userInput.trim().length > 0
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Idea
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Amazing Imagination!
            </h2>
            <p className="text-white/90 text-lg mb-4 text-center">
              You wrote: "{userInput}"
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                Creative thinking helps you explore how AI can shape the future! 🚀
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4 text-center">
              You earned 5 Coins! 🪙
            </p>
            <button
              onClick={handleTryAgain}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FutureAIReflection;
