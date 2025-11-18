import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FutureJournal = () => {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const handleChange = (e) => {
    setReflection(e.target.value);
  };

  const handleSubmit = () => {
    if (reflection.trim().length > 0) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-explorer-hero-badgee"); // Next game or summary page
  };

  const handleTryAgain = () => {
    setReflection("");
    setSubmitted(false);
    setCoins(0);
  };

  return (
    <GameShell
      title="Future Journal"
      subtitle="Creative Thinking About AI Jobs"
      onNext={handleNext}
      nextEnabled={submitted}
      showGameOver={submitted}
      score={coins}
      gameId="ai-teen-23"
      gameType="ai"
      totalLevels={23}
      currentLevel={23}
      showConfetti={submitted}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!submitted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Imagine the future!
            </h2>
            <p className="text-white/80 mb-6 text-center">
              Write down one job you think AI will create in 2050:
            </p>
            <textarea
              value={reflection}
              onChange={handleChange}
              rows={5}
              className="w-full p-4 rounded-xl bg-white/20 text-white border border-white/40 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your answer here..."
            ></textarea>

            <button
              onClick={handleSubmit}
              disabled={reflection.trim() === ""}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                reflection.trim()
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Reflection
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">✨</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Job!
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              You imagined a future AI job: <strong>{reflection}</strong>
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                🌟 Reflection helps you think creatively about AI's future impact. Keep imagining new possibilities!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>

            <button
              onClick={handleTryAgain}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FutureJournal;
