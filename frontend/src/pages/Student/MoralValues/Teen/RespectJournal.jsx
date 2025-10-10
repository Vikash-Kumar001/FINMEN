import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectJournal = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompt = "This week I showed respect by...";

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 20) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-respect-teachers");
  };

  return (
    <GameShell
      title="Respect Journal"
      subtitle="Reflecting on Respectful Actions"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-16"
      gameType="moral"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">📖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Respect Reflection</h2>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Reflection Prompt:</p>
              <p className="text-white text-xl font-semibold">{prompt}</p>
              <p className="text-white/60 text-sm mt-2">
                Think about respectful actions: listening, helping, using polite words, etc.
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your story here... (minimum 20 characters)\n\nInclude: What did you do? Who was involved? How did it show respect?"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
              maxLength={250}
            />
            
            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/250 characters (min: 20)
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 20}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 20
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Journal Entry
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Thoughtful Reflection!
            </h2>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Entry:</p>
              <p className="text-white text-lg font-semibold italic">"{journalEntry}"</p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Reflecting on respectful actions helps us recognize and repeat them. Keep showing 
                respect to everyone you meet!
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

export default RespectJournal;

