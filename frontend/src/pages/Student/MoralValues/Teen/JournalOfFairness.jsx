import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfFairness = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 5 fairness journal prompts
  const prompts = [
    "One injustice I noticed and wanted to fix was ___",
    "Describe a time when you saw someone treated unfairly. What did you do?",
    "Write about a time you shared something equally with others.",
    "When was the last time you stood up for fairness at school or home?",
    "What does being a fair person mean to you, and why is it important?"
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 30) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNextPrompt = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setJournalEntry("");
      setShowResult(false);
      setCoins(0);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/roleplay-justice-leader");
  };

  return (
    <GameShell
      title="Journal of Fairness"
      subtitle="Reflecting on Justice & Equality"
      onNext={handleNextPrompt}
      nextEnabled={showResult}
      showGameOver={showResult && currentPrompt === prompts.length - 1}
      score={coins}
      gameId="moral-teen-fairness-journal"
      gameType="moral"
      totalLevels={100}
      currentLevel={47}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto ">
            <div className="text-6xl mb-4 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Fairness Reflection {currentPrompt + 1}/5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-xl font-semibold">{prompts[currentPrompt]}</p>
              <p className="text-white/60 text-sm mt-2">
                Think about your experiences of fairness, equality, and justice...
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your story here... (minimum 30 characters)"
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
              Great Reflection!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Entry:</p>
              <p className="text-white text-lg font-semibold italic">"{journalEntry}"</p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Fairness means giving everyone equal chances and standing up against injustice. 
                You’ve taken another step toward being a responsible and kind person!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>

            {currentPrompt < prompts.length - 1 && (
              <button
                onClick={handleNextPrompt}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Prompt →
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfFairness;
