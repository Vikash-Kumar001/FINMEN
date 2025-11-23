import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfKindness = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    "Today I was kind to ___ by ___",
    "I made someone smile by ___",
    "I helped ___ by ___",
    "I shared something with ___",
    "I said something nice to ___"
  ];

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [person, setPerson] = useState("");
  const [action, setAction] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleSubmit = () => {
    if (person.trim().length >= 2 && action.trim().length >= 3) {
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
      setShowResult(true);
    }
  };

  const handleNextPrompt = () => {
    setPerson("");
    setAction("");
    setShowResult(false);
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
    } else {
      navigate("/student/moral-values/kids/lost-ball-story"); // Replace with actual next route
    }
  };

  const currentPrompt = prompts[currentPromptIndex];
  const fullEntry = `${currentPrompt.replace("___", person)} ${action}`;

  return (
    <GameShell
      title="Journal of Kindness"
      subtitle="Express Your Kind Acts"
      onNext={handleNextPrompt}
      nextEnabled={showResult}
      showGameOver={currentPromptIndex === prompts.length - 1 && showResult}
      score={coins}
      gameId="moral-kids-27"
      gameType="educational"
      totalLevels={100}
      currentLevel={27}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Write About Your Kindness</h2>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Complete the prompt:</p>
              <p className="text-white text-xl font-semibold">{currentPrompt}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Who were you kind to? (min 2 chars)</label>
                <input
                  type="text"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  placeholder="e.g., Mom, Friend..."
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">What did you do? (min 3 chars)</label>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., helped with homework, shared snack..."
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                  maxLength={100}
                />
              </div>
            </div>

            {person.trim() && action.trim() && (
              <div className="bg-purple-500/20 rounded-lg p-4 mt-4">
                <p className="text-white/70 text-sm mb-1">Preview:</p>
                <p className="text-white text-lg font-semibold italic">"{fullEntry}"</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={person.trim().length < 2 || action.trim().length < 3}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                person.trim().length >= 2 && action.trim().length >= 3
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Entry
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Kindness!
            </h2>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/70 text-sm mb-2">Your Entry:</p>
              <p className="text-white text-lg font-semibold italic">"{fullEntry}"</p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Acts of kindness brighten someone's day. Keep spreading kindness!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>

            <button
              onClick={handleNextPrompt}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
            >
              Next Prompt
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfKindness;
