import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchRules = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledRules, setShuffledRules] = useState([]);
  const [shuffledCategories, setShuffledCategories] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      rule: "Seatbelt",
      emoji: "🚗",
      category: "Car Safety",
      categoryEmoji: "🛡️",
      description: "Wearing a seatbelt protects you in case of an accident."
    },
    {
      id: 2,
      rule: "Helmet",
      emoji: "🚴",
      category: "Bike Safety",
      categoryEmoji: "🛴",
      description: "Helmets protect your head when riding bikes or scooters."
    },
    {
      id: 3,
      rule: "Signal",
      emoji: "🚦",
      category: "Road Safety",
      categoryEmoji: "🛣️",
      description: "Using signals tells others your intentions when driving or walking."
    },
    {
      id: 4,
      rule: "Recycle",
      emoji: "♻️",
      category: "Environmental Rule",
      categoryEmoji: "🌱",
      description: "Recycling helps protect our environment for future generations."
    },
    {
      id: 5,
      rule: "Queue",
      emoji: "👥",
      category: "Social Rule",
      categoryEmoji: "🤝",
      description: "Waiting in line shows respect for others and creates order."
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

    setShuffledRules(shuffleArray(puzzles.map(p => p.rule)));
    setShuffledCategories(shuffleArray(puzzles.map(p => p.category)));
  }, []);

  const handleRuleSelect = (rule) => {
    if (selectedCategory) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.rule === rule && p.category === selectedCategory);
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
      setSelectedRule(null);
      setSelectedCategory(null);
    } else {
      setSelectedRule(rule);
    }
  };

  const handleCategorySelect = (category) => {
    if (selectedRule) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.rule === selectedRule && p.category === category);
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
      setSelectedRule(null);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isRuleSelected = (rule) => selectedRule === rule;
  const isCategorySelected = (category) => selectedCategory === category;

  return (
    <GameShell
      title="Puzzle: Match Rules"
      subtitle={`Match rules to their categories! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-74"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={74}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rules column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Safety Rules</h3>
              <div className="space-y-4">
                {shuffledRules.map((rule, index) => {
                  const puzzle = puzzles.find(p => p.rule === rule);
                  return (
                    <button
                      key={`rule-${index}`}
                      onClick={() => handleRuleSelect(rule)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isRuleSelected(rule)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{rule}</span>
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
          {selectedRule && selectedCategory && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedRule} → {selectedCategory}
              </p>
            </div>
          )}
          
          {selectedRule && !selectedCategory && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedRule}. Now select a category to match!
              </p>
            </div>
          )}
          
          {!selectedRule && selectedCategory && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedCategory}. Now select a rule to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all rules to their categories!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchRules;