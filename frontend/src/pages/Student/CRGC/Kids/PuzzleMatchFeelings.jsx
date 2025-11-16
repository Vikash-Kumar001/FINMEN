import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchFeelings = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledFeelings, setShuffledFeelings] = useState([]);
  const [shuffledExpressions, setShuffledExpressions] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      feeling: "Happy",
      emoji: "😊",
      expression: "Smile",
      expressionEmoji: "😄",
      description: "When we're happy, we naturally smile and our face lights up!"
    },
    {
      id: 2,
      feeling: "Sad",
      emoji: "😢",
      expression: "Cry",
      expressionEmoji: "💧",
      description: "When we're sad, we might cry or have tears in our eyes."
    },
    {
      id: 3,
      feeling: "Angry",
      emoji: "😠",
      expression: "Frown",
      expressionEmoji: "😡",
      description: "When we're angry, we often frown or have a stern expression."
    },
    {
      id: 4,
      feeling: "Surprised",
      emoji: "😲",
      expression: "Wide Eyes",
      expressionEmoji: "😱",
      description: "When we're surprised, our eyes open wide and our mouth might open."
    },
    {
      id: 5,
      feeling: "Scared",
      emoji: "😨",
      expression: "Tremble",
      expressionEmoji: "😰",
      description: "When we're scared, we might tremble or shake slightly."
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

    setShuffledFeelings(shuffleArray(puzzles.map(p => p.feeling)));
    setShuffledExpressions(shuffleArray(puzzles.map(p => p.expression)));
  }, []);

  const handleFeelingSelect = (feeling) => {
    if (selectedExpression) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.feeling === feeling && p.expression === selectedExpression);
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
      setSelectedFeeling(null);
      setSelectedExpression(null);
    } else {
      setSelectedFeeling(feeling);
    }
  };

  const handleExpressionSelect = (expression) => {
    if (selectedFeeling) {
      // Check if this is a correct match
      const puzzle = puzzles.find(p => p.feeling === selectedFeeling && p.expression === expression);
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
      setSelectedFeeling(null);
      setSelectedExpression(null);
    } else {
      setSelectedExpression(expression);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const isMatched = (id) => matchedPairs.includes(id);
  const isFeelingSelected = (feeling) => selectedFeeling === feeling;
  const isExpressionSelected = (expression) => selectedExpression === expression;

  return (
    <GameShell
      title="Puzzle: Match Feelings"
      subtitle={`Match feelings to expressions! ${matchedPairs.length}/${puzzles.length} matched`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-4"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={4}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feelings column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Feelings</h3>
              <div className="space-y-4">
                {shuffledFeelings.map((feeling, index) => {
                  const puzzle = puzzles.find(p => p.feeling === feeling);
                  return (
                    <button
                      key={`feeling-${index}`}
                      onClick={() => handleFeelingSelect(feeling)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isFeelingSelected(feeling)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.emoji}</span>
                        <span className="text-white/90 text-lg">{feeling}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Expressions column - shuffled */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Expressions</h3>
              <div className="space-y-4">
                {shuffledExpressions.map((expression, index) => {
                  const puzzle = puzzles.find(p => p.expression === expression);
                  return (
                    <button
                      key={`expression-${index}`}
                      onClick={() => handleExpressionSelect(expression)}
                      disabled={isMatched(puzzle.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isMatched(puzzle.id)
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : isExpressionSelected(expression)
                          ? 'bg-blue-500/20 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{puzzle.expressionEmoji}</span>
                        <span className="text-white/90 text-lg">{expression}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Feedback area */}
          {selectedFeeling && selectedExpression && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-center">
                Matching: {selectedFeeling} → {selectedExpression}
              </p>
            </div>
          )}
          
          {selectedFeeling && !selectedExpression && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedFeeling}. Now select an expression to match!
              </p>
            </div>
          )}
          
          {!selectedFeeling && selectedExpression && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30">
              <p className="text-blue-300 text-center">
                Selected: {selectedExpression}. Now select a feeling to match!
              </p>
            </div>
          )}
          
          {/* Completion message */}
          {gameFinished && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <p className="text-green-300 text-center font-bold">
                Great job! You matched all feelings to their expressions!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleMatchFeelings;