import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfEthics = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "1️⃣ One hard but right choice I made was ___",
    "2️⃣ What made this choice difficult for you?",
    "3️⃣ What value or principle guided your decision?",
    "4️⃣ How did others react to your choice?",
    "5️⃣ What did you learn about ethics from that experience?",
  ];

  const [entries, setEntries] = useState(["", "", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleChange = (value) => {
    const updated = [...entries];
    updated[currentIndex] = value;
    setEntries(updated);
  };

  const handleNextQuestion = () => {
    if (entries[currentIndex].trim().length < 20) {
      alert("Please write at least 20 characters before proceeding!");
      return;
    }

    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions answered
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/roleplay-ethical-leader");
  };

  return (
    <GameShell
      title="Journal of Ethics"
      subtitle="Reflecting on Right Choices"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-97"
      gameType="moral"
      totalLevels={100}
      currentLevel={97}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🧭</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Journal of Ethics
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">
                Reflection Question {currentIndex + 1} of {prompts.length}
              </p>
              <p className="text-white text-lg font-semibold">
                {prompts[currentIndex]}
              </p>
              <p className="text-white/60 text-sm mt-2">
                Write a thoughtful answer (minimum 20 characters).
              </p>
            </div>

            <textarea
              value={entries[currentIndex]}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Write your reflection here..."
              className="w-full h-28 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mt-1 text-right">
              {entries[currentIndex].length}/200
            </div>

            <button
              onClick={handleNextQuestion}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                entries[currentIndex].trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentIndex < prompts.length - 1
                ? "Next Question →"
                : "Submit Journal ✅"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Ethical Reflection Complete!
            </h2>

            <div className="space-y-4 mb-6">
              {prompts.map((prompt, index) => (
                <div key={index} className="bg-purple-500/20 rounded-lg p-3">
                  <p className="text-white/70 text-sm mb-1">{prompt}</p>
                  <p className="text-white italic">"{entries[index]}"</p>
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Ethics means doing the right thing even when it’s tough.  
                Every right choice you make builds your moral strength and inspires others.
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

export default JournalOfEthics;
