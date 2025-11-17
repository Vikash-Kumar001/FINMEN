import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalDiscipline = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "One self-discipline habit I’m proud of is ___",
    "A routine I stick to every day that builds my discipline is ___",
    "One challenge I overcame through discipline was ___",
    "A time I resisted temptation and stayed focused on my goal ___",
    "One area I want to improve my self-discipline in is ___",
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 30) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt((prev) => prev + 1);
      setJournalEntry("");
      setShowResult(false);
    } else {
      // Navigate to next game after all 5 reflections
      navigate("/student/moral-values/teen/roleplay-group-leader");
    }
  };

  return (
    <GameShell
      title="Journal of Discipline"
      subtitle="Reflecting on Self-Discipline"
      score={coins}
      totalLevels={100}
      currentLevel={37}
      gameId="moral-teen-37"
      gameType="moral"
      backPath="/games/moral-values/teens"
      showConfetti={showResult}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reflection {currentPrompt + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPrompt]}
              </p>
              <p className="text-white/60 text-sm mt-2">
                Think deeply and write a meaningful reflection for this prompt...
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your reflection here... (minimum 30 characters)"
              className="w-full h-48 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={300}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/300 characters (min: 30)
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 30}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 30
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
              Insightful Reflection!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Reflection:</p>
              <p className="text-white text-lg font-semibold italic">
                "{journalEntry}"
              </p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Reflecting on self-discipline helps you recognize your
                strengths and build better habits. Each reflection brings
                personal growth!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
              You earned +5 Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentPrompt === prompts.length - 1
                ? "Finish Journal"
                : "Next Reflection"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalDiscipline;
