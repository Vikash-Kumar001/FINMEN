import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIHelperJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "One safe way I use AI is when I ask it to explain homework.",
    "One safe way I use AI is when I ask it to help me learn something new.",
    "One safe way I use AI is when I use it to check my grammar or spelling.",
    "One safe way I use AI is when I use it to create art or stories responsibly.",
    "One safe way I use AI is when I ask it to give me study tips."
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      // Save answer
      const newAnswers = [...answers, journalEntry.trim()];
      setAnswers(newAnswers);

      // Reset input
      setJournalEntry("");

      // If not the last prompt → go to next
      if (currentPrompt < prompts.length - 1) {
        showCorrectAnswerFeedback(1, true); // 1 coin per question
        setCoins((prev) => prev + 1);
        setCurrentPrompt((prev) => prev + 1);
      } else {
        // Last prompt → finish
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/classroom-story3");
  };

  return (
    <GameShell
      title="AI Helper Journal"
      subtitle="Write About Safe AI Use"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-78"
      gameType="educational"
      totalLevels={100}
      currentLevel={78}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Share Your Safe AI Story ({currentPrompt + 1}/5)
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Prompt:</p>
              <p className="text-white text-xl font-semibold">
                {prompts[currentPrompt]}
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your answer here... (at least 10 characters)"
              className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 resize-none"
              maxLength={200}
            />

            <div className="text-white/50 text-sm mt-2 text-right">
              {journalEntry.length}/200 characters
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 10}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                journalEntry.trim().length >= 10
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentPrompt === prompts.length - 1
                ? "Submit Final Entry"
                : "Submit & Next"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Reflection!
            </h2>

            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Entries:</p>
              <ul className="list-decimal list-inside space-y-2 text-white text-lg font-medium">
                {answers.map((ans, i) => (
                  <li key={i} className="italic">
                    “{ans}”
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Using AI safely means thinking before you share, checking facts,
                and asking AI for help in ways that make you smarter and kinder!
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

export default AIHelperJournal;
