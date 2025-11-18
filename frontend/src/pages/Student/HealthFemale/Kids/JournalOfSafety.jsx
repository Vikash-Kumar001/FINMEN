import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfSafety = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const { showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const safetyHabits = [
    "washing hands before meals",
    "wearing a helmet when riding a bike",
    "using sunscreen when playing outside",
    "getting enough sleep each night",
    "eating fruits and vegetables daily",
    "visiting the doctor for checkups",
    "getting vaccinated on schedule",
    "brushing teeth twice a day",
    "drinking clean water",
    "avoiding strangers"
  ];

  const safetyPrompts = [
    "One safety habit I follow is ___.",
    "I stay safe by ___.",
    "My family helps me stay safe by ___.",
    "At school, we practice safety by ___.",
    "I protect my health by ___."
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length > 0) {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
      setTimeout(() => {
        setGameFinished(true);
        showAnswerConfetti();
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getRandomPrompts = () => {
    const shuffled = [...safetyPrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  const getRandomHabits = () => {
    const shuffled = [...safetyHabits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const suggestedPrompts = getRandomPrompts();
  const exampleHabits = getRandomHabits();

  return (
    <GameShell
      title="Journal of Safety"
      subtitle="Write about your safety habits"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-77"
      gameType="health-female"
      totalLevels={80}
      currentLevel={77}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Write about a safety habit you follow!
            </h2>
            <p className="text-white/80">
              "One safety habit I follow is ___"
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">
              My journal entry:
            </label>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="One safety habit I follow is... It helps me because... I feel good when I do this because..."
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Need ideas? Try writing about:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedPrompts.map((prompt, index) => (
                <span 
                  key={index}
                  className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm"
                >
                  {prompt}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-white font-semibold mr-2">Safety habits:</span>
              {exampleHabits.map((habit, index) => (
                <span 
                  key={index}
                  className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {habit}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={journalEntry.trim().length === 0}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
              journalEntry.trim().length > 0
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Journal Entry
          </button>

          {gameFinished && (
            <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-400 text-center">
              <p className="text-green-200">
                Great job! Writing about your safety habits helps you recognize healthy practices and build awareness.
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfSafety;