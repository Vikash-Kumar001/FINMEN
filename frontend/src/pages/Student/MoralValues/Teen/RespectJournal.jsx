import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🔹 5 sequential prompts
  const prompts = [
    "1️⃣ This week I showed respect by...",
    "2️⃣ A time I listened to someone even when I disagreed was...",
    "3️⃣ One way I show respect at school is...",
    "4️⃣ I can show respect to my parents or elders by...",
    "5️⃣ When someone disrespected me, I responded respectfully by..."
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 20) {
      // If there are more prompts left
      if (currentPromptIndex < prompts.length - 1) {
        showCorrectAnswerFeedback(1, true); // 1 coin per reflection
        setCoins((prev) => prev + 1);
        setCurrentPromptIndex((prev) => prev + 1);
        setJournalEntry(""); // clear for next
      } else {
        // Last prompt completed
        showCorrectAnswerFeedback(5, true);
        setCoins((prev) => prev + 1);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-respect-teachers");
  };

  return (
    <GameShell
      title="Respect Journal"
      subtitle="Reflecting on Respectful Actions"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-16"
      gameType="moral"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">📖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Respect Reflection {currentPromptIndex + 1}/5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPromptIndex]}
              </p>
              <p className="text-white/60 text-sm mt-2">
                Think about respectful actions like listening, helping, or using kind words.
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder={`Write your reflection here... (minimum 20 characters)\n\nInclude: What did you do? Who was involved? How did it show respect?`}
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={250}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/250 characters (min: 20)
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 20}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPromptIndex < prompts.length - 1
                ? "Next Reflection ➡️"
                : "Finish All Reflections 🌟"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Excellent Reflections!
            </h2>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 You completed all 5 respect reflections! Every act of respect makes
                your community better. Keep practicing respect in daily life.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RespectJournal;
