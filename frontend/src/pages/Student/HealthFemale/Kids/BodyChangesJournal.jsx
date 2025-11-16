import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BodyChangesJournal = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const { showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const bodyChanges = [
    "Growth spurts", "Voice changes", "Body hair growth", "Acne", 
    "Mood swings", "Increased appetite", "Better coordination", "Improved strength"
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

  const getRandomChanges = () => {
    const shuffled = [...bodyChanges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const suggestedChanges = getRandomChanges();

  return (
    <GameShell
      title="Journal of Body Changes"
      subtitle="Write about your body development"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-27"
      gameType="health-female"
      totalLevels={30}
      currentLevel={27}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Write about one body change you've noticed!
            </h2>
            <p className="text-white/80">
              Share what you've observed and how you feel about it.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">
              My journal entry:
            </label>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="One body change I noticed is... It happened when... I feel about it because..."
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Need ideas? Try writing about:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedChanges.map((change, index) => (
                <span 
                  key={index}
                  className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {change}
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
                Great job! Writing about body changes helps you understand and accept your development.
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BodyChangesJournal;