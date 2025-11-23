import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const IntegrityJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 Five Reflection Prompts
  const prompts = [
    "Write about one time you told a hard truth.",
    "Describe a moment when you admitted a mistake and took responsibility.",
    "Share a time you stood up for honesty, even when others didn’t.",
    "Reflect on a situation where you could have cheated or lied but chose not to.",
    "Write about how being truthful made you feel respected or trusted later.",
  ];

  const prompt = prompts[currentPromptIndex];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 30) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins((prev) => prev + 5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex((prev) => prev + 1);
      setJournalEntry("");
      setShowResult(false);
      setCoins(0);
    } else {
      navigate("/student/moral-values/teen/exam-cheating-story");
    }
  };

  return (
    <GameShell
      title="Integrity Journal"
      subtitle="Reflecting on Honest Choices"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={currentPromptIndex === prompts.length - 1 && showResult}
      score={totalCoins}
      gameId="moral-teen-7"
      gameType="moral"
      totalLevels={20}
      currentLevel={7}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">📖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Integrity Reflection {currentPromptIndex + 1} of {prompts.length}
            </h2>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-xl font-semibold">{prompt}</p>
              <p className="text-white/60 text-sm mt-2">
                Think deeply about your real experiences and lessons learned.
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Reflection
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
                💡 Every time you reflect on honesty, you grow stronger in character. 
                Keep writing, keep learning, and keep choosing truth!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold rounded-full"
            >
              {currentPromptIndex < prompts.length - 1 ? "Next Reflection ➜" : "Finish Journal 🏁"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IntegrityJournal;
