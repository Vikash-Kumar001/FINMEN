import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfCourage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [promptIndex, setPromptIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [completedEntries, setCompletedEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "One time I showed courage was ___",
    "I felt brave when I ___",
    "I stood up for someone by ___",
    "A scary situation I handled was ___",
    "I did the right thing even though I was afraid by ___"
  ];

  const handleSubmit = () => {
    if (entry.trim().length >= 5) {
      // Add entry and give reward
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
      setCompletedEntries([...completedEntries, entry]);

      // Move to next prompt or finish
      if (promptIndex < prompts.length - 1) {
        setPromptIndex(promptIndex + 1);
        setEntry(""); // clear for next
      } else {
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/bully-story1");
  };

  const currentPrompt = prompts[promptIndex];

  return (
    <GameShell
      title="Journal of Courage"
      subtitle="Write About Your Bravery"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-57"
      gameType="educational"
      totalLevels={100}
      currentLevel={57}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Write About Your Courage
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">
                Complete the sentence ({promptIndex + 1}/{prompts.length}):
              </p>
              <p className="text-white text-xl font-semibold">{currentPrompt}</p>
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your courageous act here..."
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 min-h-[100px]"
              maxLength={200}
            />

            {entry.trim().length >= 5 && (
              <div className="bg-purple-500/20 rounded-lg p-4 mt-4">
                <p className="text-white/70 text-sm mb-1">Preview:</p>
                <p className="text-white text-lg font-semibold italic">
                  "{entry}"
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < 5}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                entry.trim().length >= 5
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {promptIndex < prompts.length - 1
                ? "Next Prompt ➡️"
                : "Finish Journal 🏁"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Fantastic Courage!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6 space-y-2">
              <p className="text-white/70 text-sm mb-2">Your Journal Entries:</p>
              {completedEntries.map((e, i) => (
                <p
                  key={i}
                  className="text-white text-lg font-semibold italic border-b border-white/10 pb-2"
                >
                  {i + 1}. "{e}"
                </p>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Being brave and standing up for what is right helps you grow
                stronger and inspire others!
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

export default JournalOfCourage;
