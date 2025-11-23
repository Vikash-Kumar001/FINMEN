import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfDecisions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "One right choice I made recently was...",
    "A time I helped someone the right way was...",
    "A decision I made that made me proud was...",
    "One choice where I did the right thing even when it was hard...",
    "A time I chose honesty over convenience..."
  ];

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const prompt = prompts[currentPromptIndex];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 15) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentPromptIndex < prompts.length - 1) {
      // Go to next prompt
      setCurrentPromptIndex((prev) => prev + 1);
      setJournalEntry("");
      setShowResult(false);
      setCoins(0);
    } else {
      // All prompts done → navigate to next game
      navigate("/student/moral-values/kids/cheating-offer-story");
    }
  };

  return (
    <GameShell
      title="Journal of Decisions"
      subtitle="Reflect on Your Right Choices"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={false}
      score={coins}
      gameId="moral-kids-97"
      gameType="educational"
      totalLevels={100}
      currentLevel={97}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Write About a Right Choice ({currentPromptIndex + 1}/{prompts.length})
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Prompt:</p>
              <p className="text-white text-xl font-semibold">{prompt}</p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your story here... (at least 15 characters)"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={200}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/200 characters (min: 15)
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 15}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 15
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Journal Entry
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Reflection!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Entry:</p>
              <p className="text-white text-lg font-semibold italic">
                "{journalEntry}"
              </p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Making the right choices helps you grow and makes others trust you.
                Keep reflecting on your good decisions!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
              You earned 5 Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="w-full py-3 mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 rounded-xl text-white font-bold"
            >
              {currentPromptIndex < prompts.length - 1
                ? "Next Prompt ➡️"
                : "Finish Reflection ✅"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfDecisions;
