import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfLeadership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [entries, setEntries] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      text: "One leadership quality I have is ___",
      example: "Example: I'm a good listener, which helps me understand what my friends and teammates need.",
      reflection: "Recognizing your leadership qualities helps you leverage them effectively in group settings and civic activities."
    },
    {
      id: 2,
      text: "A time I showed leadership was when ___",
      example: "Example: I organized a fundraiser for our school library by coordinating with classmates and teachers.",
      reflection: "Reflecting on past leadership experiences helps you identify what works and build on your successes."
    },
    {
      id: 3,
      text: "I can improve my leadership by ___",
      example: "Example: I can work on being more confident when presenting my ideas to larger groups.",
      reflection: "Identifying areas for growth helps you develop into a more effective leader over time."
    },
    {
      id: 4,
      text: "A leader I admire is ___ because ___",
      example: "Example: I admire Jacinda Ardern because she showed empathy and decisive leadership during crises.",
      reflection: "Learning from leaders you admire can inspire and guide your own leadership development."
    },
    {
      id: 5,
      text: "How I can use leadership to help my community is ___",
      example: "Example: I can start a mentorship program to help younger students with their studies and confidence.",
      reflection: "Connecting leadership skills to community service creates positive impact and strengthens civic engagement."
    }
  ];

  const handleEntryChange = (text) => {
    setEntries({
      ...entries,
      [currentPrompt]: text
    });
  };

  const handleSubmit = () => {
    if (!entries[currentPrompt] || entries[currentPrompt].trim().length < 10) {
      setShowFeedback(true);
      return;
    }

    setCoins(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);
    setShowFeedback(false);

    setTimeout(() => {
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentPrompt = () => prompts[currentPrompt];

  if (gameFinished) {
    return (
      <GameShell
        title="Journal of Leadership"
        subtitle="Journal Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-97"
        gameType="civic-responsibility"
        totalLevels={100}
        currentLevel={97}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✍️</div>
          <h2 className="text-2xl font-bold mb-4">Great Reflection!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by completing your leadership journal!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're thinking about leadership!
          </div>
          <p className="text-white/80">
            Remember: Your leadership skills can make a positive difference in your community and beyond!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Leadership"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Leadership Journal</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {getCurrentPrompt().text}
            </h2>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
              <p className="text-white/80 italic">
                {getCurrentPrompt().example}
              </p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-white/80">
                {getCurrentPrompt().reflection}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={entries[currentPrompt] || ''}
              onChange={(e) => handleEntryChange(e.target.value)}
              placeholder="Write your response here..."
              className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {showFeedback && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300">
                Please write at least 10 characters before submitting.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!entries[currentPrompt] || entries[currentPrompt].trim().length < 10}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Entry
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfLeadership;