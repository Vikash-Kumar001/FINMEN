import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenGrowthJournal = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      title: "My First Puberty Change",
      prompt: "Write about the first puberty change you noticed. How did it make you feel?",
      placeholder: "Example: I noticed my voice changing and felt surprised..."
    },
    {
      id: 2,
      title: "Handling Changes",
      prompt: "What puberty change was hardest to handle? How did you deal with it?",
      placeholder: "Example: Acne made me self-conscious but I learned to wash my face gently..."
    },
    {
      id: 3,
      title: "Asking for Help",
      prompt: "Did you talk to anyone about puberty changes? Who and what did you learn?",
      placeholder: "Example: I asked my parents and learned it's normal..."
    },
    {
      id: 4,
      title: "Feeling Confident",
      prompt: "How has understanding puberty helped you feel more confident?",
      placeholder: "Example: Knowing changes are normal made me less worried..."
    },
    {
      id: 5,
      title: "Advice to Others",
      prompt: "What advice would you give to someone going through puberty?",
      placeholder: "Example: Be patient and talk to trusted adults..."
    }
  ];

  const handleSubmitEntry = () => {
    if (journalEntry.trim().length < 10) {
      alert("Please write at least 10 characters about your experience!");
      return;
    }

    const newEntry = {
      prompt: currentPrompt,
      content: journalEntry,
      timestamp: new Date().toLocaleString()
    };

    setEntries([...entries, newEntry]);
    showCorrectAnswerFeedback(1, true);

    if (currentPrompt < prompts.length - 1) {
      setTimeout(() => {
        setCurrentPrompt(prev => prev + 1);
        setJournalEntry("");
        setShowPrompt(true);
      }, 1500);
    } else {
      setGameFinished(true);
    }
  };

  const getCurrentPrompt = () => prompts[currentPrompt];

  const handleNext = () => {
    navigate("/student/health-male/teens/teen-routine-simulation");
  };

  return (
    <GameShell
      title="Journal of Teen Growth (Teen)"
      subtitle={`Entry ${currentPrompt + 1} of ${prompts.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={entries.length * 5}
      gameId="health-male-teen-27"
      gameType="health-male"
      totalLevels={100}
      currentLevel={27}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 27/100</span>
            <span className="text-yellow-400 font-bold">Coins: {entries.length * 5}</span>
          </div>

          {showPrompt && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-4">
                  {getCurrentPrompt().title}
                </h3>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl mb-4">
                  <p className="font-medium">📝 Journal Prompt</p>
                </div>
              </div>

              <p className="text-white text-lg mb-6">
                {getCurrentPrompt().prompt}
              </p>

              <div className="mb-6">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder={getCurrentPrompt().placeholder}
                  className="w-full h-32 p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-white/60 text-sm mt-2">
                  Write at least 10 characters about your experience...
                </p>
              </div>

              <button
                onClick={handleSubmitEntry}
                disabled={journalEntry.trim().length < 10}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
              >
                Submit Journal Entry 📖
              </button>
            </>
          )}

          {entries.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-bold mb-3">Your Journal Entries:</h4>
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-2">
                      {prompts[entry.prompt].title}
                    </h5>
                    <p className="text-white/90 text-sm">{entry.content}</p>
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

export default TeenGrowthJournal;
