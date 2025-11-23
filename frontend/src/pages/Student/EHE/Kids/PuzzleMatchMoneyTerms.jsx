import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchMoneyTerms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      term: "Earning",
      emoji: "💼",
      definition: "Work",
      definitionEmoji: "🔨",
      description: "Earning money comes from working or providing services."
    },
    {
      id: 2,
      term: "Spending",
      emoji: "💸",
      definition: "Shop",
      definitionEmoji: "🛒",
      description: "Spending is using money to buy things you need or want."
    },
    {
      id: 3,
      term: "Saving",
      emoji: "💰",
      definition: "Piggy Bank",
      definitionEmoji: "🐖",
      description: "Saving is putting money aside for future use."
    },
    {
      id: 4,
      term: "Budget",
      emoji: "📋",
      definition: "Plan",
      definitionEmoji: "📝",
      description: "A budget is a plan for how to use your money."
    },
    {
      id: 5,
      term: "Interest",
      emoji: "📈",
      definition: "Growth",
      definitionEmoji: "🌱",
      description: "Interest is the money your savings earn over time."
    }
  ];

  const handleTermSelect = (term) => {
    if (selectedDefinition) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.term === term && p.definition === selectedDefinition);
      if (puzzle) {
        // Correct match
        setMatchedPairs([...matchedPairs, puzzle.id]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all puzzles are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => setGameFinished(true), 1500);
        }
      }
      
      // Reset selection
      setSelectedTerm(null);
      setSelectedDefinition(null);
    } else {
      setSelectedTerm(term);
    }
  };

  const handleDefinitionSelect = (definition) => {
    if (selectedTerm) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.term === selectedTerm && p.definition === definition);
      if (puzzle) {
        // Correct match
        setMatchedPairs([...matchedPairs, puzzle.id]);
        setCoins(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
        
        // Check if all puzzles are matched
        if (matchedPairs.length + 1 === puzzles.length) {
          setTimeout(() => setGameFinished(true), 1500);
        }
      }
      
      // Reset selection
      setSelectedTerm(null);
      setSelectedDefinition(null);
    } else {
      setSelectedDefinition(definition);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isTermSelected = (term) => selectedTerm === term;
  const isDefinitionSelected = (definition) => selectedDefinition === definition;

  return (
    <GameShell
      title="Puzzle: Match Money Terms"
      subtitle={`Match terms to definitions! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-24"
      gameType="ehe"
      totalLevels={10}
      currentLevel={24}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Terms column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Terms</h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <button
                    key={`term-${puzzle.id}`}
                    onClick={() => handleTermSelect(puzzle.term)}
                    disabled={isMatched(puzzle.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMatched(puzzle.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isTermSelected(puzzle.term)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{puzzle.emoji}</span>
                      <span className="text-white/90 text-lg">{puzzle.term}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Definitions column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Definitions</h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <button
                    key={`definition-${puzzle.id}`}
                    onClick={() => handleDefinitionSelect(puzzle.definition)}
                    disabled={isMatched(puzzle.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMatched(puzzle.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isDefinitionSelected(puzzle.definition)
                        ? 'bg-blue-500/20 border-2 border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{puzzle.definitionEmoji}</span>
                      <span className="text-white/90 text-lg">{puzzle.definition}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedTerm && selectedDefinition && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedTerm} → {selectedDefinition}
              </p>
            </div>
          )}
          
          {selectedTerm && !selectedDefinition && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedTerm}. Now select a definition to match!
              </p>
            </div>
          )}
          
          {!selectedTerm && selectedDefinition && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedDefinition}. Now select a term to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all money terms to their definitions!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchMoneyTerms;