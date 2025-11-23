import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfTeenEquality = () => {
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
      text: "One gender stereotype I want to break is ___",
      example: "Example: The idea that boys can't show emotions or that girls aren't good at math.",
      reflection: "Breaking gender stereotypes helps create a more inclusive world where everyone can be themselves."
    },
    {
      id: 2,
      text: "A time I witnessed gender inequality was ___",
      example: "Example: When I saw someone being treated differently because of their gender in school or sports.",
      reflection: "Recognizing gender inequality is the first step toward addressing it and creating change."
    },
    {
      id: 3,
      text: "One way I can promote gender equality is ___",
      example: "Example: By treating everyone with respect regardless of their gender and challenging unfair treatment.",
      reflection: "Small actions can make a big difference in promoting gender equality in our daily lives."
    },
    {
      id: 4,
      text: "A role model who promotes gender equality is ___",
      example: "Example: Malala Yousafzai, who advocates for girls' education, or a teacher who encourages all students equally.",
      reflection: "Role models inspire us to stand up for what's right and work toward a more equitable society."
    },
    {
      id: 5,
      text: "Something I've learned about gender equality is ___",
      example: "Example: That gender equality benefits everyone, not just one gender, and creates stronger communities.",
      reflection: "Learning about gender equality helps us understand how to build a fairer world for all."
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
        title="Journal of Teen Equality"
        subtitle="Journal Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-27"
        gameType="civic-responsibility"
        totalLevels={30}
        currentLevel={27}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={30} // Max score is total number of questions (all correct)
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
            You're developing equality awareness!
          </div>
          <p className="text-white/80">
            Remember: Reflecting on gender equality helps make it a natural part of your life!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Teen Equality"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Equality Journal</span>
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

export default JournalOfTeenEquality;