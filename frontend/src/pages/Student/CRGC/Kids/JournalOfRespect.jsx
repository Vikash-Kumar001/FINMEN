import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';

const JournalOfRespect = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (journalEntry.trim()) {
      setEntrySubmitted(true);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  if (!gameStarted) {
    return (
      <GameShell
        title="Journal of Respect"
        subtitle="Loading..."
        backPath="/games/civic-responsibility/kids"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-white">Opening your journal...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Journal of Respect"
      subtitle="Share Your Thoughts"
      onNext={handleNext}
      nextEnabled={entrySubmitted}
      nextButtonText="Back to Games"
      showGameOver={entrySubmitted}
      score={entrySubmitted ? 5 : 0}
      gameId="civic-responsibility-kids-17"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={17}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            My Respect Journal
          </h2>
          
          {!entrySubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-amber-50/10 p-6 rounded-xl border border-amber-100/20">
                <p className="text-lg text-white/90 mb-4">
                  Complete the sentence:
                </p>
                <p className="text-2xl font-bold text-amber-300 mb-6">
                  "I showed respect today by 
                  <span className="text-white">________________</span>"
                </p>
                <input
                  type="text"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105"
              >
                📝 Submit My Journal Entry
              </button>
            </form>
          ) : (
            <div className="text-center p-8 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl border border-amber-500/30">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-amber-300 mb-2">Great Reflection!</h3>
              <p className="text-white/90 mb-2">You've earned:</p>
              <div className="inline-flex items-center bg-amber-500/30 px-4 py-2 rounded-full mb-4">
                <span className="text-yellow-300 font-bold mr-2">+5</span>
                <span className="text-white">Coins</span>
              </div>
              <p className="text-white/80 mt-4">
                "{journalEntry}" is a wonderful act of respect!
              </p>
            </div>
          )}
          
          {!entrySubmitted && (
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-300 text-sm">💡 Tip: Think about times you treated others with respect, included someone, or stood up for fairness.</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default JournalOfRespect;