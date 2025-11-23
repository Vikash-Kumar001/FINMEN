import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CourageJournal1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "Write about a time you stood up for someone being treated unfairly.",
    "Describe a moment when you faced your fears and acted bravely.",
    "Write about a situation where you told the truth even though it was hard.",
    "Describe a time you tried something new that scared you at first.",
    "Write about a moment when you helped someone even though others didn’t."
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 30) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNextPrompt = () => {
    if (promptIndex < prompts.length - 1) {
      setPromptIndex(promptIndex + 1);
      setJournalEntry("");
      setShowResult(false);
      setCoins(0);
    } else {
      handleNext(); // move to next game when last prompt is done
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/bravery-story");
  };

  return (
    <GameShell
      title="Courage Journal"
      subtitle="Reflecting on Acts of Bravery"
      onNext={handleNext}
      nextEnabled={showResult && promptIndex === prompts.length - 1}
      showGameOver={showResult && promptIndex === prompts.length - 1}
      score={coins}
      gameId="moral-teen-57"
      gameType="moral"
      totalLevels={100}
      currentLevel={57}
      showConfetti={showResult && promptIndex === prompts.length - 1}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">🦁</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Courage Reflection {promptIndex + 1} of {prompts.length}
            </h2>

            <div className="bg-orange-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-xl font-semibold">{prompts[promptIndex]}</p>
              <p className="text-white/60 text-sm mt-2">
                Think about a time when being brave helped you or someone else feel safe, strong, or proud.
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your story here... (minimum 30 characters)\n\nInclude: What happened? How did you feel? Why did it take courage?"
              className="w-full h-48 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 resize-none"
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
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Reflection
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Brave Reflection!
            </h2>

            <div className="bg-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Story:</p>
              <p className="text-white text-lg font-semibold italic">
                "{journalEntry}"
              </p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Every time you act with courage, you inspire others and make the world a kinder place.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>

            <button
              onClick={handleNextPrompt}
              className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:opacity-90"
            >
              {promptIndex < prompts.length - 1 ? "Next Prompt ➜" : "Finish Reflection"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CourageJournal1;
