import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfResolution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "1️⃣ One time I resolved a conflict was when my friend and I argued over something small.",
    "2️⃣ I once had a disagreement at school, but I found a peaceful way to solve it.",
    "3️⃣ A moment when I chose to talk calmly instead of getting angry was...",
    "4️⃣ I helped two classmates become friends again after a misunderstanding.",
    "5️⃣ I once said sorry first even though it was hard, and it helped us make peace.",
  ];

  const handleNextPrompt = () => {
    if (journalEntry.trim().length >= 30) {
      const updatedEntries = [...entries, journalEntry];
      setEntries(updatedEntries);
      setJournalEntry("");

      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        // All prompts done
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/teen/roleplay-mediator");
  };

  return (
    <GameShell
      title="Journal of Resolution"
      subtitle="Reflecting on Conflict & Peace"
      onNext={handleNextGame}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-87"
      gameType="moral"
      totalLevels={100}
      currentLevel={87}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? ( 
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">🕊️</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reflection {currentPromptIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg font-semibold mb-2 text-center">
                {prompts[currentPromptIndex]}
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
              onClick={handleNextPrompt}
              disabled={journalEntry.trim().length < 30}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 30
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPromptIndex < prompts.length - 1
                ? "Next Reflection ➜"
                : "Finish Journal 🕊️"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Peaceful Resolution!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Reflections:</p>
              <ul className="space-y-3">
                {entries.map((entry, i) => (
                  <li
                    key={i}
                    className="text-white text-base italic bg-white/10 p-3 rounded-lg border border-white/20"
                  >
                    <span className="font-semibold text-purple-300">
                      {prompts[i]}
                    </span>
                    <br />
                    “{entry}”
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Great job! Resolving conflicts peacefully shows emotional
                intelligence and maturity. You chose peace over pride — that’s
                the mark of a true leader!
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

export default JournalOfResolution;
