import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalofTeamwork = () => {
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
  const [responses, setResponses] = useState([]);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "Today I helped my team by ___",
    "One way I supported a teammate was ___",
    "A challenge we overcame together was ___",
    "I shared my ideas with the team by ___",
    "I made my team feel valued by ___"
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 15) {
      const newResponses = [...responses, journalEntry];
      setResponses(newResponses);
      setJournalEntry("");

      // Check if last prompt
      if (currentPromptIndex === prompts.length - 1) {
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
        setShowResult(true);
      } else {
        // Go to next prompt
        setCurrentPromptIndex(currentPromptIndex + 1);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/playground-sharing-story"); // next game
  };

  const currentPrompt = prompts[currentPromptIndex];

  return (
    <GameShell
      title="Journal of Teamwork"
      subtitle="Reflect on Helping Your Team"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-67"
      gameType="educational"
      totalLevels={100}
      currentLevel={67}
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
              Write About Helping Your Team
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Prompt {currentPromptIndex + 1} of {prompts.length}:</p>
              <p className="text-white text-xl font-semibold">{currentPrompt}</p>
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
              {currentPromptIndex === prompts.length - 1 ? "Finish Journal" : "Next Prompt"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Job!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Journal Entries:</p>
              <ul className="text-white text-lg font-medium space-y-3">
                {responses.map((resp, idx) => (
                  <li key={idx} className="italic">🖊️ “{resp}”</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Helping your team strengthens trust, collaboration, and success. Keep contributing!
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

export default JournalofTeamwork;
