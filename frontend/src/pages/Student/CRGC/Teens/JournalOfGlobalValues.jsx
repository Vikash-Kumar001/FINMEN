import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfGlobalValues = () => {
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
      text: "One way I can act like a global citizen is ___",
      example: "Example: I can learn about different cultures and traditions to better understand and appreciate diversity.",
      reflection: "Thinking about global citizenship helps us identify concrete actions we can take to contribute positively to our interconnected world."
    },
    {
      id: 2,
      text: "A global issue I care about is ___",
      example: "Example: Climate change affects everyone, and I can reduce my carbon footprint by using public transportation.",
      reflection: "Identifying global issues you care about is the first step toward making a meaningful impact in our interconnected world."
    },
    {
      id: 3,
      text: "How I can promote cultural understanding is ___",
      example: "Example: I can participate in cultural exchange programs or events that celebrate diversity in my community.",
      reflection: "Promoting cultural understanding helps build bridges between communities and creates a more inclusive society."
    },
    {
      id: 4,
      text: "One thing I learned about another culture is ___",
      example: "Example: I learned that in Japan, it's customary to bow as a sign of respect, which shows the importance of honoring others.",
      reflection: "Learning about other cultures enriches our perspective and helps us appreciate the diversity of human experiences."
    },
    {
      id: 5,
      text: "How I can contribute to global peace is ___",
      example: "Example: I can practice empathy and conflict resolution skills in my daily interactions to model peaceful behavior.",
      reflection: "Contributing to global peace starts with our individual actions and interactions in our local communities."
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
        title="Journal of Global Values"
        subtitle="Journal Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-87"
        gameType="civic-responsibility"
        totalLevels={90}
        currentLevel={87}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={90} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✍️</div>
          <h2 className="text-2xl font-bold mb-4">Great Reflection!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by completing your global values journal!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're thinking about global citizenship!
          </div>
          <p className="text-white/80">
            Remember: Your commitment to global values helps create a more connected and compassionate world!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Global Values"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Global Values Journal</span>
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

export default JournalOfGlobalValues;