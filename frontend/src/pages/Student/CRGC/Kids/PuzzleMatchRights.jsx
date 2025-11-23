import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchRights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedRight, setSelectedRight] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledRights, setShuffledRights] = useState([]);
  const [shuffledCategories, setShuffledCategories] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      right: "School",
      emoji: "📚",
      category: "Education",
      categoryEmoji: "🏫",
      description: "Every child has the right to education and learning opportunities."
    },
    {
      id: 2,
      right: "Hospital",
      emoji: "🏥",
      category: "Healthcare",
      categoryEmoji: "⚕️",
      description: "Everyone has the right to medical care and treatment when sick or injured."
    },
    {
      id: 3,
      right: "Food",
      emoji: "🍎",
      category: "Basic Needs",
      categoryEmoji: "🍽️",
      description: "All people have the right to adequate nutrition and freedom from hunger."
    },
    {
      id: 4,
      right: "Home",
      emoji: "🏠",
      category: "Shelter",
      categoryEmoji: "🛌",
      description: "Everyone has the right to safe and adequate housing."
    },
    {
      id: 5,
      right: "Voice",
      emoji: "📢",
      category: "Expression",
      categoryEmoji: "💬",
      description: "People have the right to express their opinions and be heard."
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

    setShuffledRights(shuffleArray(puzzles.map(p => p.right)));
    setShuffledCategories(shuffleArray(puzzles.map(p => p.category)));
  }, []);

  const handleRightSelect = (right) => {
    if (selectedCategory) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.right === right && p.category === selectedCategory);
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
      setSelectedRight(null);
      setSelectedCategory(null);
    } else {
      setSelectedRight(right);
    }
  };

  const handleCategorySelect = (category) => {
    if (selectedRight) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.right === selectedRight && p.category === category);
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
      setSelectedRight(null);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isRightSelected = (right) => selectedRight === right;
  const isCategorySelected = (category) => selectedCategory === category;

  return (
    <GameShell
      title="Puzzle: Match Rights"
      subtitle={`Match rights to their categories! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-64"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={64}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={70} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rights column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Basic Rights</h3>
              <div className="space-y-4">
                {shuffledRights.map((right, index) => {
                  const puzzle = puzzles.find(p => p.right === right);
                  return (
                    <button
                      key={`right-${index}`}
                      onClick={() => handleRightSelect(right)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isRightSelected(right)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{right}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Categories column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Categories</h3>
              <div className="space-y-4">
                {shuffledCategories.map((category, index) => {
                  const puzzle = puzzles.find(p => p.category === category);
                  return (
                    <button
                      key={`category-${index}`}
                      onClick={() => handleCategorySelect(category)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isCategorySelected(category)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.categoryEmoji}</span>
                        <span className="text-white/90 text-lg">{category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedRight && selectedCategory && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedRight} → {selectedCategory}
              </p>
            </div>
          )}
          
          {selectedRight && !selectedCategory && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedRight}. Now select a category to match!
              </p>
            </div>
          )}
          
          {!selectedRight && selectedCategory && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedCategory}. Now select a right to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all rights to their categories!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchRights;