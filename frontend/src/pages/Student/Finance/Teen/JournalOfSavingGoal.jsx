import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfSavingGoal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-7";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [journalEntry, setJournalEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const examples = [
    "One big thing I want to save for is a car so I can be independent and drive to college.",
    "I'm saving for a laptop for my online classes and future career in graphic design.",
    "My goal is to save for a house down payment so I can have my own place after graduation.",
    "I want to save for travel experiences to see different cultures and broaden my horizons.",
    "I'm saving for emergency funds so I don't have to rely on credit cards when unexpected expenses arise."
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
    navigate("/student/finance/teen/simulation-monthly-money");
  };

  return (
    <GameShell
      title="Journal of Saving Goal"
      subtitle={showResult ? "Journal Complete!" : "Write about your saving goal"}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={finalScore}
      gameId="finance-teens-7"
      gameType="finance"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={7}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={20} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-3xl mx-auto">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Write about one big thing you want to save money for
            </h3>
            
            <p className="text-white/90 mb-6">
              Think of a significant goal that requires saving money over time. It could be education, 
              a car, a house, travel, emergency funds, or starting a business. Write 2-3 sentences 
              about what you want to save for and why it's important to you.
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
              You've written about an important saving goal. 
              Having clear goals helps you stay motivated to save!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
              <span>+5 Coins</span>
            </div>
            <p className="text-white/80 mb-6">
              Your entry shows that you're thinking about your financial future and setting meaningful goals.
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

export default JournalOfSavingGoal;