import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenGrowthJournal = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-27";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const journalPrompts = [
    "One change I noticed in my body is...",
    "When I feel moody, I can help myself by...",
    "One thing I like about growing up is...",
    "I have questions about...",
    "I am proud of myself because..."
  ];

  const handleJournalSubmit = () => {
    if (journalEntry.trim().length >= 5) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setJournalEntry(""); // Clear for next prompt

      setTimeout(() => {
        if (currentPromptIndex < journalPrompts.length - 1) {
          setCurrentPromptIndex(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/teen-routine-simulation");
  };

  const currentPrompt = journalPrompts[currentPromptIndex];
  const wordCount = journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isLongEnough = wordCount >= 5;

  return (
    <GameShell
      title="Journal of Growth"
      subtitle={`Entry ${currentPromptIndex + 1} of ${journalPrompts.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={journalPrompts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📓</div>
            <h3 className="text-2xl font-bold text-white mb-2">My Growth Journal</h3>
            <p className="text-white/90 mb-4">
              Reflect on your journey through puberty.
            </p>
          </div>

          {!gameFinished ? (
            <>
              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-2">🌱</div>
                  <p className="text-white font-medium text-lg">{currentPrompt}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Type your thoughts here..."
                    className="w-full h-48 bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/50 transition-all"
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-white/60 text-sm">
                    {wordCount}/5 words
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-white/80">
                    {isLongEnough ? (
                      <span className="flex items-center text-green-400">
                        <span className="text-xl mr-2">✅</span>
                        Ready to submit.
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="text-xl mr-2">📝</span>
                        Write at least 5 words...
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleJournalSubmit}
                    disabled={!isLongEnough}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${isLongEnough
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    Submit Entry ✨
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🌟</div>
                <h3 className="text-3xl font-bold text-white mb-2">Journal Complete!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Growing up is a journey. Keep writing!
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">GROWTH MINDSET</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default TeenGrowthJournal;
