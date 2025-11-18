import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfJustice = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [entries, setEntries] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      text: "One unfair thing I noticed is ___",
      example: "Example: Not all students in my school have equal access to advanced courses or extracurricular activities.",
      reflection: "Recognizing injustice is the first step toward addressing it. Being aware of inequalities helps us become advocates for change."
    },
    {
      id: 2,
      text: "A way I can promote fairness is ___",
      example: "Example: I can treat all my classmates with respect regardless of their background or abilities.",
      reflection: "Promoting fairness starts with our individual actions. Small acts of kindness and respect can create a more inclusive environment."
    },
    {
      id: 3,
      text: "A social justice issue I care about is ___",
      example: "Example: I care about educational equity because all children deserve quality learning opportunities regardless of their zip code.",
      reflection: "Identifying issues you care about helps focus your efforts and motivates sustained involvement in creating positive change."
    },
    {
      id: 4,
      text: "Someone who inspires me to fight for justice is ___",
      example: "Example: Malala Yousafzai inspires me because she risked her life to advocate for girls' education worldwide.",
      reflection: "Learning about justice champions helps us understand effective approaches to advocacy and inspires us to take action."
    },
    {
      id: 5,
      text: "One change I want to see in my community is ___",
      example: "Example: I want to see more mentorship programs that connect high school students with younger kids who need support.",
      reflection: "Envisioning specific changes helps translate concern into actionable goals and creates a roadmap for making a difference."
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
        title="Journal of Justice"
        subtitle="Journal Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-67"
        gameType="civic-responsibility"
        totalLevels={70}
        currentLevel={67}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✍️</div>
          <h2 className="text-2xl font-bold mb-4">Great Reflection!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by completing your justice journal!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're thinking about fairness and justice!
          </div>
          <p className="text-white/80">
            Remember: Reflecting on justice issues helps you become a more aware and active citizen!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Justice"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Justice Journal</span>
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

export default JournalOfJustice;