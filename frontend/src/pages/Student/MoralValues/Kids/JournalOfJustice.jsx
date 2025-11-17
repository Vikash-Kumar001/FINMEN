import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfJustice = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [entry, setEntry] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const prompts = [
    "One fair thing I did this week was ___",
    "I helped someone equally by ___",
    "I shared something without favoritism: ___",
    "I treated everyone kindly by ___",
    "I stood up for fairness when ___"
  ];

  const handleSubmit = () => {
    if (entry.trim().length >= 5) {
      const fullEntry = prompts[currentPromptIndex].replace("___", entry);
      const updatedResponses = [...responses, fullEntry];
      setResponses(updatedResponses);
      setEntry("");
      showCorrectAnswerFeedback(1, true);

      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        setCoins(prompts.length);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/sharing-sweets-story");
  };

  const currentPrompt = prompts[currentPromptIndex];
  const fullEntry = entry.trim() ? currentPrompt.replace("___", entry) : "";

  return (
    <GameShell
      title="Journal of Justice"
      subtitle="Reflect on Your Fair Actions"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-47"
      gameType="educational"
      totalLevels={100}
      currentLevel={47}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Journal Prompt {currentPromptIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Prompt:</p>
              <p className="text-white text-lg font-semibold italic text-center">
                "{currentPrompt}"
              </p>
            </div>

            <div>
              <label className="text-white/80 text-sm mb-2 block">
                Complete the sentence (min 5 chars)
              </label>
              <input
                type="text"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="e.g., helped a friend equally"
                className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                maxLength={100}
              />
            </div>

            {entry.trim() && (
              <div className="bg-purple-500/20 rounded-lg p-4 mt-4">
                <p className="text-white/70 text-sm mb-1">Preview:</p>
                <p className="text-white text-lg font-semibold italic">"{fullEntry}"</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < 5}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                entry.trim().length >= 5
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              {currentPromptIndex === prompts.length - 1
                ? "Finish Journal ✨"
                : "Next Prompt ➡️"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Well Done on Fairness!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2 text-center">
                Your Journal Entries:
              </p>
              <ul className="text-white text-lg font-semibold italic space-y-2 text-left">
                {responses.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Reflecting on fairness helps you treat everyone equally and kindly. Keep it up!
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

export default JournalOfJustice;
