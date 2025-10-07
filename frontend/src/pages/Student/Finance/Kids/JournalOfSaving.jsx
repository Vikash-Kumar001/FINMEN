import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfSaving = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleSubmit = () => {
    if (journalEntry.trim().length > 10) {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
      
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/shop-story");
  };

  const handleTryAgain = () => {
    setJournalEntry("");
    setShowResult(false);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="Journal of Saving"
      subtitle="Write about your saving experience!"
      coins={coins}
      currentLevel={7}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={showResult && journalEntry.trim().length > 10}
      showGameOver={showResult && journalEntry.trim().length > 10}
      score={coins}
      gameId="finance-kids-journal-of-saving"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6">
                Write in your journal: "One thing I saved money for is ___"
              </p>
              
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing your journal entry here..."
                className="w-full h-40 p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={journalEntry.trim().length === 0}
                  className={`py-3 px-8 rounded-full font-bold transition-all ${
                    journalEntry.trim().length === 0
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }`}
                >
                  Submit Entry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {journalEntry.trim().length > 10 ? (
              <div>
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Reflection!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Writing about your saving goals helps you remember why saving is important!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+5 Coins</span>
                </div>
                <p className="text-white/80">
                  Keep up the good work on your saving journey!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Writing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Try writing more about what you saved money for and why it was important to you.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Write at least a few sentences about your saving experience.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfSaving;