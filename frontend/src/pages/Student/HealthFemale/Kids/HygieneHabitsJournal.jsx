import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneHabitsJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const { showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const hygieneHabits = [
    "Daily bathing", "Regular hand washing", "Brushing teeth twice daily", 
    "Using deodorant", "Wearing clean clothes", "Trimming nails", 
    "Washing hair regularly", "Cleaning ears", "Foot care", "Oral hygiene"
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length > 0) {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
      setTimeout(() => {
        setGameFinished(true);
        showAnswerConfetti();
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getRandomHabits = () => {
    const shuffled = [...hygieneHabits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const suggestedHabits = getRandomHabits();

  return (
    <GameShell
      title="Journal: Hygiene Habits"
      subtitle="Write about personal hygiene"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-47"
      gameType="health-female"
      totalLevels={50}
      currentLevel={47}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    
      maxScore={50} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Write about a new hygiene habit you've learned!
            </h2>
            <p className="text-white/80">
              "One new hygiene habit I learned is ___"
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">
              My journal entry:
            </label>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="One new hygiene habit I learned is... It's important because... I will practice it by..."
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Need ideas? Try writing about:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedHabits.map((habit, index) => (
                <span 
                  key={index}
                  className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm"
                >
                  {habit}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={journalEntry.trim().length === 0}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
              journalEntry.trim().length > 0
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Journal Entry
          </button>

          {gameFinished && (
            <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-400 text-center">
              <p className="text-green-200">
                Great job! Writing about hygiene habits helps reinforce good practices.
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HygieneHabitsJournal;