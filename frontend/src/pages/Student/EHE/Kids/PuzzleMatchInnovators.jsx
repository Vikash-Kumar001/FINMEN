import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchInnovators = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedInnovator, setSelectedInnovator] = useState(null);
  const [selectedInvention, setSelectedInvention] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledInnovators, setShuffledInnovators] = useState([]);
  const [shuffledInventions, setShuffledInventions] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      innovator: "Edison",
      emoji: "💡",
      invention: "Bulb",
      inventionEmoji: "🔦",
      description: "Thomas Edison invented the practical incandescent light bulb."
    },
    {
      id: 2,
      innovator: "Wright Brothers",
      emoji: "✈️",
      invention: "Plane",
      inventionEmoji: "🛩️",
      description: "Orville and Wilbur Wright created the first successful airplane."
    },
    {
      id: 3,
      innovator: "Jobs",
      emoji: "📱",
      invention: "iPhone",
      inventionEmoji: "📲",
      description: "Steve Jobs revolutionized personal technology with the iPhone."
    },
    {
      id: 4,
      innovator: "Tesla",
      emoji: "⚡",
      invention: "AC Motor",
      inventionEmoji: "⚙️",
      description: "Nikola Tesla invented the alternating current motor."
    },
    {
      id: 5,
      innovator: "Curie",
      emoji: "⚛️",
      invention: "Radium",
      inventionEmoji: "🔬",
      description: "Marie Curie discovered radium and advanced atomic research."
    }
  ];

  // Shuffle arrays when component mounts
  useEffect(() => {
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledInnovators(shuffleArray(puzzles.map(p => p.innovator)));
    setShuffledInventions(shuffleArray(puzzles.map(p => p.invention)));
  }, []);

  const handleInnovatorSelect = (innovator) => {
    if (selectedInvention) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.innovator === innovator && p.invention === selectedInvention);
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
      setSelectedInnovator(null);
      setSelectedInvention(null);
    } else {
      setSelectedInnovator(innovator);
    }
  };

  const handleInventionSelect = (invention) => {
    if (selectedInnovator) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.innovator === selectedInnovator && p.invention === invention);
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
      setSelectedInnovator(null);
      setSelectedInvention(null);
    } else {
      setSelectedInvention(invention);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isInnovatorSelected = (innovator) => selectedInnovator === innovator;
  const isInventionSelected = (invention) => selectedInvention === invention;

  return (
    <GameShell
      title="Puzzle: Match Innovators"
      subtitle={`Match innovators to their inventions! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-34"
      gameType="ehe"
      totalLevels={10}
      currentLevel={34}
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
            {/* Innovators column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Innovators</h3>
              <div className="space-y-4">
                {shuffledInnovators.map((innovator, index) => {
                  const puzzle = puzzles.find(p => p.innovator === innovator);
                  return (
                    <button
                      key={`innovator-${index}`}
                      onClick={() => handleInnovatorSelect(innovator)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isInnovatorSelected(innovator)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{innovator}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Inventions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Inventions</h3>
              <div className="space-y-4">
                {shuffledInventions.map((invention, index) => {
                  const puzzle = puzzles.find(p => p.invention === invention);
                  return (
                    <button
                      key={`invention-${index}`}
                      onClick={() => handleInventionSelect(invention)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isInventionSelected(invention)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.inventionEmoji}</span>
                        <span className="text-white/90 text-lg">{invention}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedInnovator && selectedInvention && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedInnovator} → {selectedInvention}
              </p>
            </div>
          )}
          
          {selectedInnovator && !selectedInvention && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedInnovator}. Now select an invention to match!
              </p>
            </div>
          )}
          
          {!selectedInnovator && selectedInvention && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedInvention}. Now select an innovator to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all innovators to their inventions!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchInnovators;