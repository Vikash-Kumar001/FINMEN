import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfService = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentEntry, setCurrentEntry] = useState(0);
  const [entries, setEntries] = useState([
    { id: 1, person: "", action: "" },
    { id: 2, person: "", action: "" },
    { id: 3, person: "", action: "" },
    { id: 4, person: "", action: "" },
    { id: 5, person: "", action: "" },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleChange = (field, value) => {
    setEntries((prev) =>
      prev.map((e, index) =>
        index === currentEntry ? { ...e, [field]: value } : e
      )
    );
  };

  const handleNextEntry = () => {
    if (entries[currentEntry].person.trim().length >= 3 && entries[currentEntry].action.trim().length >= 5) {
      if (currentEntry < entries.length - 1) {
        setCurrentEntry(currentEntry + 1);
      } else {
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/animal-care-story");
  };

  const current = entries[currentEntry];

  return (
    <GameShell
      title="Journal of Service"
      subtitle="Write About Helping Others"
      onNext={handleNextGame}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-77"
      gameType="educational"
      totalLevels={100}
      currentLevel={77}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Prompt {current.id} of 5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-2">
              <p className="text-white/70 text-sm">
                Today I helped someone by...
              </p>
            </div>

            <input
              type="text"
              value={current.person}
              onChange={(e) => handleChange("person", e.target.value)}
              placeholder="Who did you help? (min 3 chars)"
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 mb-2"
              maxLength={50}
            />
            <input
              type="text"
              value={current.action}
              onChange={(e) => handleChange("action", e.target.value)}
              placeholder="What did you do? (min 5 chars)"
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
              maxLength={100}
            />

            {current.person.trim() && current.action.trim() && (
              <div className="bg-purple-500/20 rounded-lg p-3 mt-3">
                <p className="text-white/70 text-sm">Preview:</p>
                <p className="text-white text-lg font-semibold italic">
                  "Today I helped {current.person} by {current.action}."
                </p>
              </div>
            )}

            <button
              onClick={handleNextEntry}
              disabled={
                current.person.trim().length < 3 ||
                current.action.trim().length < 5
              }
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                current.person.trim().length >= 3 &&
                current.action.trim().length >= 5
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentEntry === entries.length - 1
                ? "Finish Journal ✨"
                : "Next ➡️"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Wonderful Service Journal!
            </h2>

            {entries.map((entry) => (
              <div key={entry.id} className="bg-purple-500/20 rounded-lg p-4 mb-4">
                <p className="text-white/70 text-sm">Entry {entry.id}:</p>
                <p className="text-white text-lg font-semibold italic">
                  "Today I helped {entry.person} by {entry.action}."
                </p>
              </div>
            ))}

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Helping others makes the world a better place. Keep doing
                good deeds!
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

export default JournalOfService;
