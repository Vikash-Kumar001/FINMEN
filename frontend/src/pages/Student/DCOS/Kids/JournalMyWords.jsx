import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalMyWords = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "Today I said kind words to my friend when...",
    "I made someone happy by saying...",
    "I encouraged my classmate by telling them...",
    "I showed respect by saying...",
    "I apologized kindly to someone when..."
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      showCorrectAnswerFeedback(1, true);
      setEntries([...entries, { prompt: prompts[currentPrompt], text: journalEntry }]);
      setCoins((prev) => prev + 1);

      if (currentPrompt < prompts.length - 1) {
        // Move to next prompt
        setTimeout(() => {
          setJournalEntry("");
          setCurrentPrompt((prev) => prev + 1);
        }, 500);
      } else {
        // All done!
        setTimeout(() => setShowResult(true), 500);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/playground-reflex");
  };

  return (
    <GameShell
      title="Journal: My Words"
      subtitle="Write About Your Kind Words"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-88"
      gameType="educational"
      totalLevels={100}
      currentLevel={88}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* Journal Prompts Sequence */}
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">💬</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Prompt {currentPrompt + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Prompt:</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPrompt]}
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your story here... (at least 10 characters)"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={200}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/200 characters
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 10}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 10
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPrompt < prompts.length - 1
                ? "Next Prompt →"
                : "Finish Journal ✨"}
            </button>
          </div>
        ) : (
          // Final Result
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Kind Words Matter!
            </h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-purple-500/20 rounded-lg p-4 border border-white/10"
                >
                  <p className="text-white/70 text-sm mb-1">
                    Prompt {index + 1}: {entry.prompt}
                  </p>
                  <p className="text-white text-lg font-medium italic">
                    “{entry.text}”
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 You reflected on kindness in 5 different ways! Keep using kind,
                respectful words every day — they truly make a difference.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
              You earned {coins} Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Game →
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalMyWords;
