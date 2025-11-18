import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleJusticeHeroes = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState({});
  const [completed, setCompleted] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const pairs = [
    { 
      id: 1, 
      left: "Mahatma Gandhi", 
      emoji: "🕊️", 
      right: "Freedom", 
      description: "Mahatma Gandhi led India to independence through nonviolent resistance, showing that peaceful protest can achieve freedom." 
    },
    { 
      id: 2, 
      left: "Martin Luther King", 
      emoji: "✊", 
      right: "Equality", 
      description: "Martin Luther King Jr. championed civil rights and racial equality in America through peaceful demonstrations and powerful speeches." 
    },
    { 
      id: 3, 
      left: "Malala", 
      emoji: "📖", 
      right: "Education", 
      description: "Malala Yousafzai advocates for girls' education worldwide and became the youngest Nobel Prize laureate for her efforts." 
    },
    { 
      id: 4, 
      left: "Nelson Mandela", 
      emoji: "🔓", 
      right: "Justice", 
      description: "Nelson Mandela fought against apartheid in South Africa and became a symbol of justice and reconciliation." 
    },
    { 
      id: 5, 
      left: "Rosa Parks", 
      emoji: "🚌", 
      right: "Rights", 
      description: "Rosa Parks sparked the civil rights movement by refusing to give up her bus seat, standing up for equal rights." 
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
        title="Puzzle: Justice Heroes"
        subtitle="Puzzle Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-64"
        gameType="civic-responsibility"
        totalLevels={70}
        currentLevel={64}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-2xl font-bold mb-4">Well Done!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by matching justice heroes!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You know your justice champions!
          </div>
          <p className="text-white/80">
            Remember: These heroes showed that one person can make a difference in fighting for justice and equality!
          </p>
        </div>
      </GameShell>
    );
  }

  // Shuffle the right side options
  const shuffledRights = [...pairs].sort(() => Math.random() - 0.5);

  return (
    <GameShell
      title="Puzzle: Justice Heroes"
      subtitle="Match justice heroes with their contributions"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Justice Heroes Puzzle</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Heroes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Heroes</h3>
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
            
            {/* Right column - Contributions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contributions</h3>
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

export default PuzzleJusticeHeroes;