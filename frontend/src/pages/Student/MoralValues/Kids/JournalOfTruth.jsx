import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfTruth = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🔹 5 prompts (one for each round)
  const prompts = [
    "One time I told the truth was...",
    "I felt proud when I was honest because...",
    "Telling the truth helps others by...",
    "A time I could have lied but didn’t was...",
    "I think honesty is important because...",
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 15) {
      showCorrectAnswerFeedback(1, true);
      const updatedEntries = [...entries, journalEntry.trim()];
      setEntries(updatedEntries);
      setJournalEntry("");

      if (currentPrompt < prompts.length - 1) {
        // move to next prompt
        setCurrentPrompt(currentPrompt + 1);
        setCoins(coins + 1);
      } else {
        // finished all 5
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/candy-shop-story");
  };

  return (
    <GameShell
      title="Journal of Truth"
      subtitle="Complete 5 Short Honesty Reflections"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-7"
      gameType="educational"
      totalLevels={20}
      currentLevel={7}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500">
            <div className="text-6xl mb-4 text-center">📖</div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Journal {currentPrompt + 1} of 5
            </h2>
            <p className="text-white/70 text-center mb-6">
              Reflect and write your honest thoughts
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Prompt:</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPrompt]}
              </p>
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
              {currentPrompt < 4
                ? "Submit & Next ✍️"
                : "Finish Journal 🏆"}
            </button>

            <div className="text-white/60 text-sm mt-4 text-center">
              Progress: {currentPrompt + 1}/5
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Great Job, Honest Writer!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2 text-center">
                Your Journal Entries:
              </p>
              <ul className="space-y-2">
                {entries.map((entry, i) => (
                  <li
                    key={i}
                    className="text-white text-base bg-white/10 rounded-lg p-3"
                  >
                    <span className="text-yellow-300 font-bold">
                      {i + 1}.
                    </span>{" "}
                    {entry}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4 text-center">
              <p className="text-white text-sm">
                💡 You wrote 5 reflections on truth and honesty! That’s
                amazing — keep spreading honesty everywhere!
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

export default JournalOfTruth;
