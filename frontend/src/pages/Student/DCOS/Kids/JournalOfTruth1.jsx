import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfTruth1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const prompts = [
    "Today I fact-checked a fun story about...",
    "I checked if a picture I saw online was real or fake...",
    "I asked a grown-up to confirm if...",
    "I looked up the truth about...",
    "I learned that not everything on the internet about ___ is true!"
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      showCorrectAnswerFeedback(5, true);
      const updatedEntries = [...entries, { prompt: prompts[currentPromptIndex], text: journalEntry }];
      setEntries(updatedEntries);
      setJournalEntry("");

      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/emoji-reflex");
  };

  return (
    <GameShell
      title="Journal of Truth"
      subtitle="Reflect on Your Fact-Checking Journey"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-38"
      gameType="educational"
      totalLevels={100}
      currentLevel={38}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Journal Prompt {currentPromptIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Prompt:</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPromptIndex]}
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your journal here... (at least 10 characters)"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 resize-none"
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
              {currentPromptIndex < prompts.length - 1
                ? "Submit Entry & Next ✍️"
                : "Finish Journal 🏁"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Great Work, Truth Explorer!
            </h2>

            <div className="space-y-4 mb-6">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-purple-500/20 rounded-lg p-4 border border-white/20"
                >
                  <p className="text-white/70 text-sm mb-1">
                    Prompt {index + 1}:
                  </p>
                  <p className="text-white font-semibold mb-2">
                    {entry.prompt}
                  </p>
                  <p className="text-white/90 italic">"{entry.text}"</p>
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Checking facts helps you know what’s real and what’s not.
                Keep being smart and careful online!
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

export default JournalOfTruth1;
