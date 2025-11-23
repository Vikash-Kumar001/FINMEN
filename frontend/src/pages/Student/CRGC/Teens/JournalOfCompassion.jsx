import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfCompassion = () => {
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
      text: "The kindest act I saw this week was ___",
      example: "Example: My neighbor helped an elderly woman carry groceries up her stairs without being asked.",
      reflection: "Noticing acts of kindness helps us appreciate the good in the world and inspires us to be kind too."
    },
    {
      id: 2,
      text: "A time I showed compassion to someone was ___",
      example: "Example: I listened to my friend who was upset about a family problem and offered support.",
      reflection: "Reflecting on our own compassionate acts helps reinforce positive behavior and builds self-awareness."
    },
    {
      id: 3,
      text: "Someone who has shown me compassion was ___",
      example: "Example: My teacher noticed I was struggling with a subject and offered extra help after class.",
      reflection: "Recognizing when others show us compassion helps us understand its value and encourages us to pay it forward."
    },
    {
      id: 4,
      text: "A situation where I could have been more compassionate was ___",
      example: "Example: I ignored a classmate who seemed lonely instead of inviting them to join my group.",
      reflection: "Acknowledging missed opportunities for compassion helps us grow and do better in the future."
    },
    {
      id: 5,
      text: "One way I can practice compassion this week is ___",
      example: "Example: I will check in with my grandparents who live far away to see how they're doing.",
      reflection: "Setting intentions for compassionate action helps us make kindness a regular part of our lives."
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
        title="Journal of Compassion"
        subtitle="Journal Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-7"
        gameType="civic-responsibility"
        totalLevels={10}
        currentLevel={7}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={10} // Max score is total number of questions (all correct)
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
            You're developing compassion!
          </div>
          <p className="text-white/80">
            Remember: Reflecting on compassion helps make it a natural part of your life!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Compassion"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Compassion Journal</span>
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

export default JournalOfCompassion;