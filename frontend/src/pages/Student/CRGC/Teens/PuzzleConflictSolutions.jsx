import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleConflictSolutions = () => {
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
    { 
      id: 1, 
      left: "Listen", 
      emoji: "👂", 
      right: "Respect", 
      description: "Listening to others shows respect for their feelings and perspectives." 
    },
    { 
      id: 2, 
      left: "Apologize", 
      emoji: "🫂", 
      right: "Heal", 
      description: "Sincere apologies help heal hurt feelings and repair damaged relationships." 
    },
    { 
      id: 3, 
      left: "Shout", 
      emoji: "😠", 
      right: "Wrong", 
      description: "Shouting escalates conflicts and prevents constructive communication." 
    },
    { 
      id: 4, 
      left: "Compromise", 
      emoji: "🤝", 
      right: "Solution", 
      description: "Finding a middle ground helps both parties feel heard and satisfied." 
    },
    { 
      id: 5, 
      left: "Empathize", 
      emoji: "❤️", 
      right: "Connect", 
      description: "Understanding others' feelings creates emotional connections and trust." 
    }
  ];

  const handleMatch = (leftId, rightId) => {
    // Check if this is a correct match
    const pair = pairs.find(p => p.left === leftId);
    const isCorrect = pair && pair.right === rightId;
    
    // Update matches state
    const newMatches = { ...matches, [leftId]: rightId };
    setMatches(newMatches);
    
    // Check if all pairs are matched
    const allMatched = pairs.every(p => newMatches[p.left] === p.right);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      if (allMatched) {
        setTimeout(() => setCompleted(true), 1000);
      }
    } else if (allMatched) {
      // If all matched but some are incorrect, still complete the game
      setTimeout(() => setCompleted(true), 1000);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  if (completed) {
    return (
      <GameShell
        title="Puzzle: Conflict Solutions"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-44"
        gameType="civic-responsibility"
        totalLevels={50}
        currentLevel={44}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={50} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🧩</div>
          <h2 className="text-2xl font-bold mb-4">Well Done!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by matching conflict resolution strategies!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand effective conflict resolution!
          </div>
          <p className="text-white/80">
            Remember: Good communication and empathy are key to resolving conflicts!
          </p>
        </div>
      </GameShell>
    );
  }

  // Shuffle the right side options
  const shuffledRights = [...pairs].sort(() => Math.random() - 0.5);

  return (
    <GameShell
      title="Puzzle: Conflict Solutions"
      subtitle="Match conflict resolution strategies with their outcomes"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Conflict Resolution Puzzle</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              {pairs.map((pair) => (
                <div 
                  key={pair.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    matches[pair.left]
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{pair.emoji}</div>
                    <span className="text-white font-medium">{pair.left}</span>
                  </div>
                  {matches[pair.left] && (
                    <div className="mt-2 text-sm text-white/80">
                      Matched with: {matches[pair.left]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Right column - Outcomes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Outcomes</h3>
              {shuffledRights.map((pair) => (
                <div 
                  key={pair.id}
                  onClick={() => {
                    // Find the first unmatched left item
                    const unmatchedLeft = pairs.find(p => !matches[p.left]);
                    if (unmatchedLeft) {
                      handleMatch(unmatchedLeft.left, pair.right);
                    }
                  }}
                  className="p-4 rounded-xl border-2 bg-white/10 border-white/20 hover:bg-white/20 cursor-pointer transition-all"
                >
                  <span className="text-white font-medium">{pair.right}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feedback for matches */}
          <div className="mt-8 space-y-3">
            {Object.entries(matches).map(([left, right]) => {
              const pair = pairs.find(p => p.left === left);
              const isCorrect = pair && pair.right === right;
              
              return (
                <div 
                  key={left}
                  className={`p-3 rounded-lg ${
                    isCorrect 
                      ? 'bg-green-500/20 border border-green-500' 
                      : 'bg-red-500/20 border border-red-500'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-xl mr-2">{pair?.emoji}</div>
                    <span className="text-white">
                      {left} → {right} {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mt-1">{pair?.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleConflictSolutions;