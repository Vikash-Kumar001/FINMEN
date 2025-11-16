import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleAntiBullyingMatch = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledActions, setShuffledActions] = useState([]);
  const [shuffledValues, setShuffledValues] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      action: "Speak Up",
      emoji: "🗣️",
      value: "Courage",
      valueEmoji: "🦸",
      description: "Speaking up against bullying takes courage and helps protect others!"
    },
    {
      id: 2,
      action: "Support Friend",
      emoji: "🤝",
      value: "Care",
      valueEmoji: "❤️",
      description: "Supporting a friend who is being bullied shows you care about them!"
    },
    {
      id: 3,
      action: "Ignore Bully",
      emoji: "🚫",
      value: "Wrong",
      valueEmoji: "❌",
      description: "Ignoring a bully is the wrong approach - it allows the behavior to continue!"
    },
    {
      id: 4,
      action: "Tell Adult",
      emoji: "📢",
      value: "Right",
      valueEmoji: "✅",
      description: "Telling a trusted adult is the right thing to do when you see bullying!"
    },
    {
      id: 5,
      action: "Include Everyone",
      emoji: "👥",
      value: "Kindness",
      valueEmoji: "😊",
      description: "Including everyone in activities shows kindness and prevents exclusion!"
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

    setShuffledActions(shuffleArray(puzzles.map(p => p.action)));
    setShuffledValues(shuffleArray(puzzles.map(p => p.value)));
  }, []);

  const handleActionSelect = (action) => {
    if (selectedValue) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.action === action && p.value === selectedValue);
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
      setSelectedAction(null);
      setSelectedValue(null);
    } else {
      setSelectedAction(action);
    }
  };

  const handleValueSelect = (value) => {
    if (selectedAction) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.action === selectedAction && p.value === value);
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
      setSelectedAction(null);
      setSelectedValue(null);
    } else {
      setSelectedValue(value);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isActionSelected = (action) => selectedAction === action;
  const isValueSelected = (value) => selectedValue === value;

  return (
    <GameShell
      title="Puzzle: Anti-Bullying Match"
      subtitle={`Match actions to values! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-34"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={34}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Actions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Actions</h3>
              <div className="space-y-4">
                {shuffledActions.map((action, index) => {
                  const puzzle = puzzles.find(p => p.action === action);
                  return (
                    <button
                      key={`action-${index}`}
                      onClick={() => handleActionSelect(action)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isActionSelected(action)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{action}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Values column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Values</h3>
              <div className="space-y-4">
                {shuffledValues.map((value, index) => {
                  const puzzle = puzzles.find(p => p.value === value);
                  return (
                    <button
                      key={`value-${index}`}
                      onClick={() => handleValueSelect(value)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isValueSelected(value)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.valueEmoji}</span>
                        <span className="text-white/90 text-lg">{value}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedAction && selectedValue && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedAction} → {selectedValue}
              </p>
            </div>
          )}
          
          {selectedAction && !selectedValue && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedAction}. Now select a value to match!
              </p>
            </div>
          )}
          
          {!selectedAction && selectedValue && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedValue}. Now select an action to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all anti-bullying actions to their values!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleAntiBullyingMatch;