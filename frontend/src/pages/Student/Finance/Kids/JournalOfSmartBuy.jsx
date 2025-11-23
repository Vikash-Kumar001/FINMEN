import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfSmartBuy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [journalEntry, setJournalEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const examples = [
    "One smart thing I bought was a water bottle instead of buying plastic bottles every day.",
    "I saved money by waiting for the laptop sale instead of buying it immediately.",
    "I compared prices at three stores before buying my school supplies.",
    "I made a shopping list and stuck to it, avoiding impulse purchases.",
    "I bought generic brands instead of name brands to save money."
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length < 10) return;
    
    setSubmitted(true);
    setFinalScore(1); // For journaling, we'll give credit for participation
    setShowResult(true);
    showCorrectAnswerFeedback(1, true);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setJournalEntry("");
    setSubmitted(false);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/kids/candy-offer-story");
  };

  return (
    <GameShell
      title="Journal of Smart Buy"
      subtitle={showResult ? "Journal Complete!" : "Write about a smart purchase you made"}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={finalScore}
      gameId="finance-kids-17"
      gameType="finance"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={7}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-3xl mx-auto">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Write about one smart purchase or spending decision you made
            </h3>
            
            <p className="text-white/90 mb-6">
              Think of a time when you made a smart spending choice. It could be comparing prices, 
              waiting for a sale, buying generic brands, or making a shopping list. Write 2-3 sentences 
              about what you did and why it was smart.
            </p>
            
            <div className="bg-purple-500/20 p-4 rounded-xl mb-6">
              <h4 className="font-bold text-purple-300 mb-2">Example Entries:</h4>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
            
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your journal entry here... (minimum 10 characters)"
              className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-white/80">
                {journalEntry.length}/10 characters
              </span>
              <button
                onClick={handleSubmit}
                disabled={journalEntry.trim().length < 10}
                className={`py-3 px-6 rounded-full font-bold transition-all ${
                  journalEntry.trim().length >= 10
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                    : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-4">Great Reflection!</h3>
            <p className="text-white/90 text-lg mb-4">
              You've written about a smart spending decision you made. 
              Reflecting on our choices helps us make better decisions in the future!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
              <span>+5 Coins</span>
            </div>
            <p className="text-white/80 mb-6">
              Your entry shows that you're thinking about your spending habits and learning from them.
            </p>
            
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <h4 className="font-bold text-blue-300 mb-2">Your Entry:</h4>
              <p className="text-white/90 italic">"{journalEntry}"</p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfSmartBuy;