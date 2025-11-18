import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfDuty = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "One responsibility I do every day is helping my parents at home.",
    "One responsibility I do every day is finishing my homework on time.",
    "One responsibility I do every day is keeping my room clean.",
    "One responsibility I do every day is being kind and respectful to others.",
    "One responsibility I do every day is following school rules and staying focused."
  ];

  const [completedEntries, setCompletedEntries] = useState([]);

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 15) {
      // Store completed entry
      const updatedEntries = [...completedEntries, { prompt: prompts[currentPrompt], text: journalEntry }];
      setCompletedEntries(updatedEntries);

      showCorrectAnswerFeedback(1, true);
      setJournalEntry("");

      if (currentPrompt < prompts.length - 1) {
        // Move to next prompt
        setTimeout(() => {
          setCurrentPrompt(currentPrompt + 1);
        }, 500);
      } else {
        // All prompts completed
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/playground-rules-story");
  };

  return (
    <GameShell
      title="Journal of Duty"
      subtitle="Write About Your Daily Responsibilities"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-37"
      gameType="educational"
      totalLevels={100}
      currentLevel={37}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Journal Entry {currentPrompt + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Today's Prompt:</p>
              <p className="text-white text-lg font-semibold">{prompts[currentPrompt]}</p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your reflection here... (at least 15 characters)"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 resize-none"
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
              {currentPrompt < prompts.length - 1
                ? "Submit & Next ➡️"
                : "Finish Journal 🏁"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Reflections!
            </h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
              {completedEntries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-purple-500/20 rounded-lg p-4 border border-white/20"
                >
                  <p className="text-white/70 text-sm mb-1">
                    Prompt {index + 1}:
                  </p>
                  <p className="text-white text-md font-semibold mb-2">
                    {entry.prompt}
                  </p>
                  <p className="text-white/90 italic">“{entry.text}”</p>
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Completing your duties daily makes you responsible, kind, and disciplined!
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

export default JournalOfDuty;
