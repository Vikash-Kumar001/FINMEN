import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleKindActs = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState({});
  const [completed, setCompleted] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const pairs = [
    { id: 1, left: "Help Elderly", emoji: "🧓", right: "Carry Bags", description: "Assisting elderly people with heavy items shows respect and care for our seniors." },
    { id: 2, left: "Help Animals", emoji: "🐕", right: "Feed", description: "Feeding stray animals demonstrates compassion for all living beings." },
    { id: 3, left: "Help Friends", emoji: "👂", right: "Listen", description: "Listening to friends who need to talk provides emotional support and strengthens relationships." },
    { id: 4, left: "Help Neighbors", emoji: "🏘️", right: "Check On", description: "Checking on neighbors, especially during difficult times, builds community bonds." },
    { id: 5, left: "Help Environment", emoji: "🌍", right: "Plant Trees", description: "Planting trees helps protect our planet for future generations." }
  ];

  const handleMatch = (pairId) => {
    if (matches[pairId]) return; // Already matched
    
    const newMatches = { ...matches, [pairId]: true };
    setMatches(newMatches);
    
    // Add coin for each correct match
    setCoins(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);
    
    // Check if all pairs are matched
    if (Object.keys(newMatches).length === pairs.length) {
      setTimeout(() => setCompleted(true), 1000);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  if (completed) {
    return (
      <GameShell
        title="Puzzle: Kind Acts"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teensonsibility-teens-4"
        gameType="civic-responsibility"
        totalLevels={10}
        currentLevel={4}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {pairs.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You've mastered kind acts!
          </div>
          <p className="text-white/80">
            Remember: Small acts of kindness make a big difference in the world!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Puzzle: Kind Acts"
      subtitle="Match the kind acts with their descriptions"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Kind Acts Puzzle</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              {pairs.map(pair => (
                <button
                  key={`left-${pair.id}`}
                  onClick={() => handleMatch(pair.id)}
                  disabled={matches[pair.id]}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    matches[pair.id]
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{pair.emoji}</div>
                    <span className="text-white font-medium">{pair.left}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Kind Responses</h3>
              {pairs.map(pair => (
                <button
                  key={`right-${pair.id}`}
                  onClick={() => handleMatch(pair.id)}
                  disabled={matches[pair.id]}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    matches[pair.id]
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-white font-medium">{pair.right}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Matched Pairs:</h3>
            <div className="space-y-3">
              {pairs.filter(pair => matches[pair.id]).map(pair => (
                <div key={`matched-${pair.id}`} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{pair.emoji}</div>
                    <div>
                      <p className="text-white font-medium">{pair.left} → {pair.right}</p>
                      <p className="text-white/80 text-sm mt-1">{pair.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleKindActs;