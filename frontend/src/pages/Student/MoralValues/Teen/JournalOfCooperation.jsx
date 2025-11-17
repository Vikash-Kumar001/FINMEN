import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfCooperation = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(["", "", "", "", ""]);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "1️⃣ Describe one time your team achieved more than you could alone.",
    "2️⃣ What made your team work well together?",
    "3️⃣ How did you contribute to your team’s success?",
    "4️⃣ What challenge did your team face, and how did you overcome it?",
    "5️⃣ How did teamwork make you feel compared to working alone?",
  ];

  const handleEntryChange = (value) => {
    const updated = [...entries];
    updated[currentPrompt] = value;
    setEntries(updated);
  };

  const handleNextPrompt = () => {
    if (entries[currentPrompt].trim().length < 20) return;

    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const allValid = entries.every((entry) => entry.trim().length >= 20);
    if (allValid) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/roleplay-good-teammate");
  };

  return (
    <GameShell
      title="Journal of Cooperation"
      subtitle="Celebrating Teamwork and Unity"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-67"
      gameType="moral"
      totalLevels={100}
      currentLevel={67}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          // Journal Question Step-by-Step
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500">
            <div className="text-6xl mb-4 text-center">🤝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reflect on Cooperation
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentPrompt + 1) / prompts.length) * 100}%`,
                }}
              />
            </div>

            {/* Current Prompt */}
            <p className="text-white font-semibold mb-2">
              {prompts[currentPrompt]}
            </p>
            <textarea
              value={entries[currentPrompt]}
              onChange={(e) => handleEntryChange(e.target.value)}
              placeholder="Write your reflection (min 20 characters)..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={200}
            />
            <div className="text-white/50 text-sm text-right">
              {entries[currentPrompt].length}/200
            </div>

            {/* Next / Submit Button */}
            <button
              onClick={handleNextPrompt}
              disabled={entries[currentPrompt].trim().length < 20}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                entries[currentPrompt].trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPrompt === prompts.length - 1
                ? "Submit Journal"
                : "Next Question →"}
            </button>

            {/* Progress Indicator */}
            <p className="text-center text-white/60 mt-3">
              {currentPrompt + 1} / {prompts.length} reflections completed
            </p>
          </div>
        ) : (
          // ✅ Final Result / Feedback
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Team Reflection!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Journal Entries:</p>
              {entries.map((entry, index) => (
                <p key={index} className="text-white italic mb-2">
                  • {entry}
                </p>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Cooperation brings out the best in everyone. Together, we
                achieve what individuals alone cannot.
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

export default JournalOfCooperation;
