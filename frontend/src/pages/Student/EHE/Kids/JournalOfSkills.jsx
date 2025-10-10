import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfSkills = () => {
  const navigate = useNavigate();
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const handleSubmit = () => {
    if (entry.trim().length >= 5) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/ehe/kids/risk-story");
  };

  return (
    <GameShell
      title="Journal of Skills"
      subtitle="Personal Growth"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="ehe-kids-17"
      gameType="educational"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showResult}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">📔</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Reflect on Your Skills!</h3>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-center font-semibold">
                Complete this sentence:
              </p>
              <p className="text-white text-xl text-center mt-2">
                "One skill I want to improve is..."
              </p>
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Type your answer here... (e.g., teamwork, creativity, problem-solving)"
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/40 rounded-xl text-white placeholder-white/50 focus:border-purple-400 focus:outline-none mb-4 min-h-[120px]"
            />

            <p className="text-white/70 text-sm mb-4 text-center">
              Write at least 5 characters to continue
            </p>

            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < 5}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                entry.trim().length >= 5
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit My Journal Entry ✍️
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Reflection!
            </h2>
            
            <div className="bg-purple-500/20 rounded-lg p-5 mb-6">
              <p className="text-white/80 text-sm mb-2 text-center">You wrote:</p>
              <p className="text-white text-xl font-semibold text-center italic">
                "One skill I want to improve is {entry}"
              </p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                💫 Excellent! Knowing what skills you want to improve is the first step to growth. 
                Keep practicing and you'll get better every day!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfSkills;

