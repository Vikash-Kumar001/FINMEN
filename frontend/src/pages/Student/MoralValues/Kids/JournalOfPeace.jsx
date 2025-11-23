import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfPeace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [entries, setEntries] = useState([]);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    { id: 1, text: "One time I forgave someone was ___." },
    { id: 2, text: "Peace means ___ to me." },
    { id: 3, text: "A time I chose kindness instead of anger was ___." },
    { id: 4, text: "I feel peaceful when ___." },
    { id: 5, text: "Forgiving others helps because ___." },
  ];

  const handleSubmit = () => {
    if (entry.trim().length >= 10) {
      const updatedEntries = [...entries, { prompt: prompts[currentPromptIndex].text, answer: entry }];
      setEntries(updatedEntries);
      setEntry("");
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);

      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/name-calling-story");
  };

  const currentPrompt = prompts[currentPromptIndex];

  return (
    <GameShell
      title="Journal of Peace"
      subtitle="Write About Forgiveness and Calm"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-87"
      gameType="journal"
      totalLevels={100}
      currentLevel={87}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">✍️</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Journal {currentPromptIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/70 text-sm mb-2">Prompt:</p>
              <p className="text-white text-lg font-semibold italic">
                "{currentPrompt.text}"
              </p>
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your peaceful thoughts here..."
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 min-h-[120px]"
              maxLength={300}
            />

            {entry.trim().length >= 10 && (
              <div className="bg-purple-500/20 rounded-lg p-4 mt-4">
                <p className="text-white/70 text-sm mb-1">Preview:</p>
                <p className="text-white text-lg font-semibold italic">
                  "{entry}"
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < 10}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                entry.trim().length >= 10
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPromptIndex < prompts.length - 1
                ? "Next Prompt →"
                : "Submit Final Reflection 🕊️"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🕊️</div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Beautiful Reflections!
            </h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {entries.map((item, index) => (
                <div
                  key={index}
                  className="bg-purple-500/20 rounded-lg p-4 border border-white/20"
                >
                  <p className="text-white/70 text-sm mb-1">
                    Prompt {index + 1}:
                  </p>
                  <p className="text-white font-semibold italic mb-2">
                    "{item.prompt}"
                  </p>
                  <p className="text-white/90 text-base">✏️ {item.answer}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Forgiveness brings peace to your heart. You chose calm over anger — that’s real strength.
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

export default JournalOfPeace;
