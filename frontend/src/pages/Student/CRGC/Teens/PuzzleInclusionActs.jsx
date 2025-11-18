import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleInclusionActs = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState({});
  const [completed, setCompleted] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const pairs = [
    { id: 1, left: "Invite", emoji: "🎒", right: "New Student", description: "Inviting new students helps them feel welcomed and included in the school community." },
    { id: 2, left: "Listen", emoji: "👥", right: "Everyone", description: "Listening to everyone's ideas and opinions shows respect and creates an inclusive environment." },
    { id: 3, left: "Share", emoji: "🤝", right: "Team", description: "Sharing responsibilities and resources with your team promotes fairness and cooperation." },
    { id: 4, left: "Include", emoji: "🎈", right: "All Activities", description: "Making sure all activities are accessible to everyone helps create an inclusive community." },
    { id: 5, left: "Respect", emoji: "🙏", right: "Different Views", description: "Respecting different views and perspectives helps build understanding and tolerance." }
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
        title="Puzzle: Inclusion Acts"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-14"
        gameType="civic-responsibility"
        totalLevels={20}
        currentLevel={14}
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
            You've mastered inclusion acts!
          </div>
          <p className="text-white/80">
            Remember: Small acts of inclusion make a big difference in creating welcoming communities!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Puzzle: Inclusion Acts"
      subtitle="Match the inclusion acts with their descriptions"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Inclusion Acts Puzzle</span>
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
              <h3 className="text-lg font-semibold text-white mb-4">Responses</h3>
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

export default PuzzleInclusionActs;