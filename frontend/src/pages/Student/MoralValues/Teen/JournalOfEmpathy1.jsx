import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfEmpathy1 = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "One time I understood someone’s feelings was when my friend was sad after losing a game.",
    "A time I showed empathy was when I comforted someone who felt left out.",
    "I once noticed someone upset — I listened to them instead of judging.",
    "When someone was angry, I tried to understand their side before reacting.",
    "A moment I felt proud of showing empathy was when I forgave a classmate after a fight."
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 30) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);

      if (currentPromptIndex < prompts.length - 1) {
        // move to next prompt
        setCurrentPromptIndex((prev) => prev + 1);
        setJournalEntry("");
      } else {
        // all prompts done
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/helping-hand-story");
  };

  return (
    <GameShell
      title="Journal of Empathy"
      subtitle="Understanding Others’ Feelings"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-27"
      gameType="moral"
      totalLevels={100}
      currentLevel={27}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">💞</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reflection {currentPromptIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-lg font-semibold">
                {prompts[currentPromptIndex]}
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your reflection here... (minimum 30 characters)"
              className="w-full h-44 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
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
              {currentPromptIndex < prompts.length - 1
                ? "Next Reflection"
                : "Submit Final Reflection"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Heartfelt Reflections Completed!
            </h2>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 You reflected deeply on all 5 empathy moments. Understanding and sharing others’ feelings shows your emotional maturity and kindness!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              Total Earned: {coins} Coins 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfEmpathy1;
