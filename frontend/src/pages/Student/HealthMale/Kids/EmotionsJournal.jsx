import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionsJournal = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const journalPrompts = [
    "One feeling I had today was...",
    "When I feel happy, I...",
    "When I'm sad, it helps to...",
    "Something that makes me angry is...",
    "I feel scared when...",
    "My favorite feeling is... because..."
  ];

  const currentPrompt = journalPrompts[0]; // Using first prompt for now

  const handleJournalSubmit = () => {
    if (journalEntry.trim().length >= 10) {
      setGameFinished(true);
      showCorrectAnswerFeedback(5, true); // 5 coins for journal entry
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/anger-story");
  };

  const wordCount = journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isLongEnough = wordCount >= 10;

  return (
    <GameShell
      title="Journal of Emotions"
      subtitle="Write about your feelings"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={gameFinished ? 5 : 0}
      gameId="health-male-kids-57"
      gameType="health-male"
      totalLevels={60}
      currentLevel={57}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">My Emotions Journal</h3>
            <p className="text-white/90 mb-4">
              Writing about feelings helps you understand them better
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
                placeholder="Write about your feelings here... Be honest and share what's in your heart! ❤️"
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
                    Great! You've written enough to share your feelings!
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
                  Thank you for sharing your feelings! Writing about emotions helps you understand yourself better!
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">EMOTIONS WRITER</div>
                </div>
                <p className="text-white/80">
                  Your words matter! Keep journaling about your feelings! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default EmotionsJournal;
