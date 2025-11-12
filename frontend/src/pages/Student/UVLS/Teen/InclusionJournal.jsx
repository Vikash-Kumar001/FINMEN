import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InclusionJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [journalEntry, setJournalEntry] = useState("");
  const [outcome, setOutcome] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = {
    action: "Describe a time when you challenged exclusion or stood up for someone being left out:",
    outcome: "What was the outcome of your action?"
  };

  const wordCount = journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length;
  const outcomeWordCount = outcome.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleSubmit = () => {
    if (wordCount >= 150 && wordCount <= 250 && outcomeWordCount >= 20) {
      showCorrectAnswerFeedback(3, false);
      setCoins(3); // +3 Coins for reflection (minimum for progress)
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/correcting-bias-roleplay");
  };

  return (
    <GameShell
      title="Inclusion Journal"
      subtitle="Reflect on Your Actions"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="uvls-teen-16"
      gameType="uvls"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={16}
      showConfetti={showResult}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block text-lg">
                  {prompts.action}
                </label>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Describe the situation, what you did, and why you acted..."
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none resize-none"
                  rows="8"
                />
                <span className={`text-sm block mt-2 ${
                  wordCount >= 150 && wordCount <= 250 ? 'text-green-400' : 'text-white/60'
                }`}>
                  Word count: {wordCount} {wordCount < 150 ? `(${150 - wordCount} more needed)` : wordCount > 250 ? `(${wordCount - 250} over limit)` : '✓'}
                </span>
              </div>

              {wordCount >= 150 && wordCount <= 250 && (
                <div className="mb-6">
                  <label className="text-white font-semibold mb-3 block text-lg">
                    {prompts.outcome}
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="What happened as a result of your action? What did you learn?"
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:border-green-400 focus:outline-none resize-none"
                    rows="4"
                  />
                  <span className={`text-sm block mt-2 ${
                    outcomeWordCount >= 20 ? 'text-green-400' : 'text-white/60'
                  }`}>
                    {outcomeWordCount} words {outcomeWordCount >= 20 ? '✓' : `(need ${20 - outcomeWordCount} more)`}
                  </span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={wordCount < 150 || wordCount > 250 || outcomeWordCount < 20}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  wordCount >= 150 && wordCount <= 250 && outcomeWordCount >= 20
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit Journal! 📝
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Powerful Reflection!</h2>
            <div className="bg-white/10 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
              <p className="text-purple-300 font-semibold mb-2">Your Action:</p>
              <p className="text-white text-sm mb-4">{journalEntry}</p>
              <div className="border-t border-white/30 pt-3 mt-3">
                <p className="text-green-300 font-semibold mb-2">Outcome:</p>
                <p className="text-white/90 text-sm">{outcome}</p>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 3 Coins! 🪙
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Provide supportive feedback and consider sharing exceptional reflections (with permission)!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusionJournal;

