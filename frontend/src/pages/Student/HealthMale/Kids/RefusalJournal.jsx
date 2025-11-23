import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RefusalJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [journalEntry, setJournalEntry] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const journalPrompts = [
    "I will always say no to...",
    "When someone offers something harmful, I will...",
    "My body deserves...",
    "I choose health because...",
    "Saying no makes me feel..."
  ];

  const currentPrompt = journalPrompts[0]; // Using first prompt for now

  const handleJournalSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      setGameFinished(true);
      showCorrectAnswerFeedback(5, true); // 5 coins for journal entry
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/peer-story");
  };

  const wordCount = journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isLongEnough = wordCount >= 10;

  return (
    <GameShell
      title="Journal of Refusal"
      subtitle="Write about saying no to harmful substances"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={gameFinished ? 5 : 0}
      gameId="health-male-kids-87"
      gameType="health-male"
      totalLevels={90}
      currentLevel={87}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={90} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">My Refusal Journal</h3>
            <p className="text-white/90 mb-4">
              Writing about refusal helps you remember your strength to say no to harmful things
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">💭</div>
              <p className="text-white font-medium text-lg">{currentPrompt}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write about saying no to harmful substances... What will you refuse? Why is it important? Be proud of your commitment to health! 🚫"
                className="w-full h-48 bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/50 transition-all"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-white/60 text-sm">
                {wordCount}/50 words
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-white/80">
                {isLongEnough ? (
                  <span className="flex items-center text-green-400">
                    <span className="text-xl mr-2">✅</span>
                    Excellent! You've committed to saying no to harmful substances!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="text-xl mr-2">📝</span>
                    Write at least 10 words to complete your journal entry
                  </span>
                )}
              </div>

              <button
                onClick={handleJournalSubmit}
                disabled={!isLongEnough}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  isLongEnough
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isLongEnough ? 'Submit Journal ✨' : 'Write More...'}
              </button>
            </div>
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">📖</div>
                <h3 className="text-3xl font-bold text-white mb-2">Journal Entry Complete!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Thank you for your commitment! Writing about refusal strengthens your resolve to make healthy choices!
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">REFUSAL WRITER</div>
                </div>
                <p className="text-white/80">
                  Your words show real strength! Keep saying no to harmful substances! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default RefusalJournal;
