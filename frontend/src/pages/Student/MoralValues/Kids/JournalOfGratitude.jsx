import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfGratitude = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // Five gratitude prompts
  const prompts = [
    "Today I thanked ___ for ___",
    "I am grateful to ___ because ___",
    "I appreciate ___ for helping me with ___",
    "Someone who made me smile today was ___ because ___",
    "I feel lucky to have ___ in my life because ___"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [person, setPerson] = useState("");
  const [reason, setReason] = useState("");
  const [entries, setEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleSubmit = () => {
    if (person.trim().length >= 3 && reason.trim().length >= 5) {
      const newEntry = `Prompt ${currentPrompt + 1}: ${prompts[currentPrompt]
        .replace("___", person)
        .replace("___", reason)}`;
      setEntries([...entries, newEntry]);
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);

      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(currentPrompt + 1);
        setPerson("");
        setReason("");
      } else {
        setShowResult(true);
      }
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/playground-respect-story");
  };

  const fullEntry = prompts[currentPrompt]
    .replace("___", person || "___")
    .replace("___", reason || "___");

  return (
    <GameShell
      title="Journal of Gratitude"
      subtitle="Express Your Thanks"
      onNext={handleNextGame}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-17"
      gameType="educational"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">📖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Gratitude Poster {currentPrompt + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Complete the sentence:</p>
              <p className="text-white text-xl font-semibold">{prompts[currentPrompt]}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  Who did you thank? (min 3 chars)
                </label>
                <input
                  type="text"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  placeholder="e.g., Mom, Teacher, Friend..."
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">
                  For what? (min 5 chars)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., helping me, making lunch..."
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                  maxLength={100}
                />
              </div>
            </div>

            {person.trim() && reason.trim() && (
              <div className="bg-purple-500/20 rounded-lg p-4 mt-4">
                <p className="text-white/70 text-sm mb-1">Preview:</p>
                <p className="text-white text-lg font-semibold italic">"{fullEntry}"</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={person.trim().length < 3 || reason.trim().length < 5}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                person.trim().length >= 3 && reason.trim().length >= 5
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPrompt < prompts.length - 1
                ? "Next Poster"
                : "Finish Journals"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Wonderful Gratitude Journal!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your 5 Entries:</p>
              <ul className="list-disc list-inside text-white space-y-2">
                {entries.map((entry, i) => (
                  <li key={i} className="italic">{entry}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Saying thank you makes people feel appreciated and happy. Keep being grateful!
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

export default JournalOfGratitude;
