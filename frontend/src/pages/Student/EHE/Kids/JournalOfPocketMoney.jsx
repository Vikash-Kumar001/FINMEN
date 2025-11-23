import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfPocketMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      setIsSubmitted(true);
      setCoins(5); // Reward for completing the journal entry
      showCorrectAnswerFeedback(5, true);
      setTimeout(() => setGameFinished(true), 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  return (
    <GameShell
      title="Journal of Pocket Money"
      subtitle={isSubmitted ? "Great job!" : "Write about your money"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-27"
      gameType="ehe"
      totalLevels={10}
      currentLevel={27}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {!isSubmitted ? (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">
                Write: "I saved ___ from my allowance."
              </h2>
              <p className="text-white/80 mb-6">
                Think about how you saved money from your allowance and why. Write at least 10 words.
              </p>
              
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing your journal entry here..."
                className="w-full h-48 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-white/70 text-sm">
                  {journalEntry.length} characters
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={journalEntry.trim().length < 10}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Entry
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Your Journal Entry</h2>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6 text-left">
                <p className="text-white/90 whitespace-pre-wrap">{journalEntry}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                <p className="text-green-300 font-bold">
                  🎉 Excellent! You've completed your pocket money journal entry!
                </p>
                <p className="text-green-300 mt-2">
                  Tracking your savings helps you build good financial habits!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfPocketMoney;