import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyJournal = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const journalPrompts = [
    "One safety habit I follow is...",
    "To stay safe, I always...",
    "When I need help, I...",
    "Safety makes me feel...",
    "The most important safety rule is..."
  ];

  const currentPrompt = journalPrompts[0]; // Using first prompt for now

  const handleJournalSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      setGameFinished(true);
      showCorrectAnswerFeedback(5, true); // 5 coins for journal entry
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/dentist-story");
  };

  const wordCount = journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isLongEnough = wordCount >= 10;

  return (
    <GameShell
      title="Journal of Safety"
      subtitle="Write about your safety habits"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={gameFinished ? 5 : 0}
      gameId="health-male-kids-77"
      gameType="health-male"
      totalLevels={80}
      currentLevel={77}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">My Safety Journal</h3>
            <p className="text-white/90 mb-4">
              Writing about safety helps you remember important habits that keep you healthy
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">💭</div>
              <p className="text-white font-medium text-lg">{currentPrompt}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write about your safety habits... What do you do to stay safe? How does following safety rules make you feel? Be proud of your safe choices! 🛡️"
                className="w-full h-48 bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/50 transition-all"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-white/60 text-sm">
                {wordCount}/50 words
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-white/80">
                {isLongEnough ? (
                  <span className="flex items-center text-green-400">
                    <span className="text-xl mr-2">✅</span>
                    Excellent! You've shared your important safety habits!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="text-xl mr-2">📝</span>
                    Write at least 10 words to complete your journal entry
                  </span>
                )}
              </div>

              <button
                onClick={handleJournalSubmit}
                disabled={!isLongEnough}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  isLongEnough
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isLongEnough ? 'Submit Journal ✨' : 'Write More...'}
              </button>
            </div>
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">📖</div>
                <h3 className="text-3xl font-bold text-white mb-2">Journal Entry Complete!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Thank you for sharing your safety habits! Remembering safe choices helps you stay protected every day!
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">SAFETY WRITER</div>
                </div>
                <p className="text-white/80">
                  Your safety awareness makes you a smart and responsible kid! Keep it up! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default SafetyJournal;
