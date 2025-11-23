import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeedbackJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [journals, setJournals] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [journalEntry, setJournalEntry] = useState(""); // State for tracking journal entry
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      prompt: "Feedback I got and learned?"
    },
    {
      id: 2,
      prompt: "Teacher said, I improved?"
    },
    {
      id: 3,
      prompt: "Friend advised, I tried?"
    },
    {
      id: 4,
      prompt: "Parent suggested, outcome?"
    },
    {
      id: 5,
      prompt: "What I learned from mistake?"
    }
  ];

  const handleJournal = () => {
    const newJournals = [...journals, journalEntry];
    setJournals(newJournals);

    const isValid = journalEntry.trim().length > 0;
    if (isValid) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setJournalEntry(""); // Reset entry for next level
      }, isValid ? 800 : 0);
    } else {
      const validJournals = newJournals.filter(j => j.trim().length > 0).length;
      setFinalScore(validJournals);
      if (validJournals >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setJournals([]);
    setCoins(0);
    setFinalScore(0);
    setJournalEntry(""); // Reset entry
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Feedback Journal"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-67"
      gameType="uvls"
      totalLevels={70}
      currentLevel={67}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">{getCurrentLevel().prompt}</p>
              <textarea 
                placeholder="Write your reflection..." 
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
              ></textarea>
              <button 
                onClick={handleJournal} 
                className="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={journalEntry.trim().length === 0} // Disable if entry is empty
              >
                Submit Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Feedback Learner!" : "💪 Reflect More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You reflected {finalScore} times!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeedbackJournal;