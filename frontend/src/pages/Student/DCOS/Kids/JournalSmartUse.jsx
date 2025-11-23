import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalSmartUse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntries, setJournalEntries] = useState([]);
  const [entry, setEntry] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompts = [
    "Today I used tech to learn about...",
    "I discovered something new online about...",
    "I watched an educational video about...",
    "I used a learning app or website to study...",
    "Technology helped me understand ___ better today."
  ];

  const handleSubmit = () => {
    if (entry.trim().length >= 10) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
      setJournalEntries((prev) => [...prev, entry]);
      setShowFeedback(true);
    }
  };

  const handleNextPrompt = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt((prev) => prev + 1);
      setEntry("");
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/reflex-reading");
  };

  return (
    <GameShell
      title="Journal of Smart Use"
      subtitle="Reflect on How You Used Tech Wisely"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-98"
      gameType="educational"
      totalLevels={100}
      currentLevel={98}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-6xl mb-4 text-center">💻</div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Prompt {currentPrompt + 1} of {prompts.length}
              </h2>

              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white/70 text-sm mb-2">Your Prompt:</p>
                <p className="text-white text-xl font-semibold">
                  {prompts[currentPrompt]}
                </p>
              </div>

              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your journal entry here... (at least 10 characters)"
                className="w-full h-40 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
                maxLength={200}
              />

              <div className="text-white/50 text-sm mt-2 text-right">
                {entry.length}/200 characters
              </div>

              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < 10}
                className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                  entry.trim().length >= 10
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Submit Journal Entry
              </button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Great Reflection!
              </h2>

              <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
                <p className="text-white/70 text-sm mb-2">Your Entry:</p>
                <p className="text-white text-lg font-semibold italic">
                  "{entry}"
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold mb-4">
                +1 Coin Earned 🪙
              </p>

              <button
                onClick={handleNextPrompt}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentPrompt < prompts.length - 1
                  ? "Next Prompt →"
                  : "Finish Journal ✨"}
              </button>
            </div>
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Smart Tech Journal
            </h2>
            <div className="space-y-3 mb-6 text-left">
              {journalEntries.map((j, i) => (
                <div
                  key={i}
                  className="bg-blue-500/20 rounded-lg p-3 text-white text-sm"
                >
                  <span className="font-bold">Prompt {i + 1}:</span> {prompts[i]}
                  <br />
                  <span className="italic text-white/80">"{j}"</span>
                </div>
              ))}
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              You earned {coins} Coins! 🪙
            </p>
            <p className="text-white/70 mt-4">
              Excellent! You reflected on 5 ways you used technology wisely. 🌈
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalSmartUse;
