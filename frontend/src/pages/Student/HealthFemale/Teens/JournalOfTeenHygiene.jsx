import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfTeenHygiene = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      text: "One hygiene challenge I overcame is ___"
    },
    {
      id: 2,
      text: "A new hygiene routine I started is ___"
    },
    {
      id: 3,
      text: "Something I learned about my body during puberty is ___"
    },
    {
      id: 4,
      text: "How I handle hygiene when traveling or away from home is ___"
    },
    {
      id: 5,
      text: "One product that helped me with hygiene is ___"
    }
  ];

  const handleEntryChange = (e) => {
    setCurrentEntry(e.target.value);
  };

  const handleSubmitEntry = () => {
    if (currentEntry.trim() !== '') {
      const newEntry = {
        prompt: prompts[currentPrompt].text,
        content: currentEntry,
        id: Date.now()
      };
      
      setEntries([...entries, newEntry]);
      setCurrentEntry('');
      
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
      } else {
        // Award points for completing all entries
        showCorrectAnswerFeedback(5, true);
        setGameFinished(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/health-female/teens/simulation-daily-routine");
  };

  return (
    <GameShell
      title="Journal of Teen Hygiene"
      subtitle={`Entry ${currentPrompt + 1} of ${prompts.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={entries.length> 0 ? entries.length : 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-47"
      gameType="health-female"
      totalLevels={10}
      currentLevel={7}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Entry {currentPrompt + 1}/{prompts.length}</span>
            <span className="text-yellow-400 font-bold">Entries: {entries.length}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-white text-xl font-bold mb-4">Reflect on your hygiene journey:</h2>
            <p className="text-white/90 text-lg bg-white/5 p-4 rounded-xl border border-white/10">
              {prompts[currentPrompt].text}
            </p>
          </div>

          <div className="mb-6">
            <textarea
              value={currentEntry}
              onChange={handleEntryChange}
              placeholder="Write your reflection here..."
              className="w-full h-32 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmitEntry}
              disabled={currentEntry.trim() === ''}
              className={`px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
                currentEntry.trim() === ''
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
              }`}
            >
              Submit Entry
            </button>
          </div>

          {entries.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white text-lg font-bold mb-3">Your Entries:</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <p className="text-white/80 text-sm italic">{entry.prompt}</p>
                    <p className="text-white mt-1">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfTeenHygiene;