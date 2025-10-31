import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DecisionJournal = () => {
  const navigate = useNavigate();
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
      prompt: "Why I chose my snack today?"
    },
    {
      id: 2,
      prompt: "Decision on game to play?"
    },
    {
      id: 3,
      prompt: "Chose friend to help?"
    },
    {
      id: 4,
      prompt: "Picked book to read?"
    },
    {
      id: 5,
      prompt: "Chose activity after school?"
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
      title="Decision Journal"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-57"
      gameType="uvls"
      totalLevels={70}
      currentLevel={57}
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
                placeholder="Write your reason..." 
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
              {finalScore >= 3 ? "🎉 Decision Diarist!" : "💪 Journal More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You journaled {finalScore} decisions!
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

export default DecisionJournal;