import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfPeerSupport = () => {
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
      text: "I helped a bullied friend by ___",
      example: "Example: I invited them to sit with my friends at lunch and checked in with them daily.",
      reflection: "Helping a bullied friend shows empathy and can make a significant positive difference in their life."
    },
    {
      id: 2,
      text: "A time I stood up to a bully was ___",
      example: "Example: I told a classmate to stop making fun of someone's accent and included the victim in our conversation.",
      reflection: "Standing up to bullies takes courage but helps create a safer environment for everyone."
    },
    {
      id: 3,
      text: "I created a more inclusive environment by ___",
      example: "Example: I made sure everyone in my group project had a chance to contribute and share their ideas.",
      reflection: "Creating inclusive environments helps everyone feel valued and respected."
    },
    {
      id: 4,
      text: "I learned about being a better friend through ___",
      example: "Example: I realized that listening without judgment is more helpful than giving advice immediately.",
      reflection: "Learning about friendship helps us build stronger, more supportive relationships."
    },
    {
      id: 5,
      text: "One way I can prevent bullying in the future is ___",
      example: "Example: I will speak up immediately when I witness bullying and report it to adults.",
      reflection: "Taking proactive steps to prevent bullying helps create a culture of respect and kindness."
    }
  ];

  const [entryText, setEntryText] = useState("");

  const handleEntrySubmit = () => {
    if (entryText.trim().length < 10) return; // Minimum length check
    
    const newEntries = { ...entries, [currentPrompt]: entryText };
    setEntries(newEntries);
    setEntryText("");
    
    // Award coins for each entry
    setCoins(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentPrompt = () => prompts[currentPrompt];

  if (gameFinished) {
    return (
      <GameShell
        title="Journal of Peer Support"
        subtitle="Journal Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-37"
        gameType="civic-responsibility"
        totalLevels={40}
        currentLevel={37}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={40} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✍️</div>
          <h2 className="text-2xl font-bold mb-4">Journal Complete!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {prompts.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're developing peer support skills!
          </div>
          <p className="text-white/80">
            Remember: Supporting peers creates positive change in your community!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Peer Support"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Peer Support Journal</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {getCurrentPrompt().text}
            </h2>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
              <p className="text-blue-300 font-medium">💡 {getCurrentPrompt().example}</p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <p className="text-purple-300">{getCurrentPrompt().reflection}</p>
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Write your response here..."
              className="w-full h-32 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleEntrySubmit}
            disabled={entryText.trim().length < 10 || showFeedback}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              entryText.trim().length >= 10 && !showFeedback
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            Submit Entry
          </button>

          {showFeedback && (
            <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
              <p className="text-green-300 font-semibold">Great reflection! 👏</p>
            </div>
          )}

          {entries[currentPrompt] && (
            <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-white/80">Your entry:</p>
              <p className="text-white mt-2">{entries[currentPrompt]}</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfPeerSupport;