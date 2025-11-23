import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleGenderBarriers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState({});
  const [completed, setCompleted] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const pairs = [
    { id: 1, left: "Equal Pay", emoji: "✅", right: "Fair", description: "Equal pay for equal work is a fundamental principle of fairness and gender equality." },
    { id: 2, left: "Girls Out of School", emoji: "❌", right: "Wrong", description: "Denying education based on gender is a violation of human rights and limits potential." },
    { id: 3, left: "Women Leaders", emoji: "👍", right: "Positive", description: "Having women in leadership positions brings diverse perspectives and promotes equality." },
    { id: 4, left: "Career Limitations", emoji: "🚫", right: "Harmful", description: "Limiting career choices based on gender stereotypes prevents people from reaching their potential." },
    { id: 5, left: "Shared Responsibilities", emoji: "🤝", right: "Beneficial", description: "Sharing domestic and professional responsibilities equally benefits families and society." }
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
        title="Puzzle: Gender Barriers"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-24"
        gameType="civic-responsibility"
        totalLevels={30}
        currentLevel={24}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={30} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🧩</div>
          <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {pairs.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You've mastered gender equality concepts!
          </div>
          <p className="text-white/80">
            Remember: Breaking down gender barriers creates a more equitable society for everyone!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Puzzle: Gender Barriers"
      subtitle="Match the gender equality concepts with their evaluations"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Gender Equality Puzzle</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Concepts</h3>
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
              <h3 className="text-lg font-semibold text-white mb-4">Evaluations</h3>
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

export default PuzzleGenderBarriers;