import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HabitChainPuzzle = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedChain, setSelectedChain] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      outcome: "Better health.",
      habits: ["Wake early", "Exercise", "Healthy breakfast", "Hydrate", "Sleep early"],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      id: 2,
      outcome: "Good grades.",
      habits: ["Study daily", "Review notes", "Practice tests", "Ask questions", "Rest well"],
      correctOrder: [0, 1, 2, 3, 4]
    },
{
  id: 3,
  outcome: "Save money.",
  habits: ["Track spending", "Budget", "Avoid impulse", "Save first", "Invest"],
  correctOrder: [0, 1, 2, 3, 4]
},
    {
      id: 4,
      outcome: "Learn instrument.",
      habits: ["Practice daily", "Lessons", "Listen music", "Perform", "Record progress"],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      id: 5,
      outcome: "Read more.",
      habits: ["Set time", "Choose books", "Join club", "Discuss", "Track books"],
      correctOrder: [0, 1, 2, 3, 4]
    }
  ];

  const handleHabitSelect = (index) => {
    if (!selectedChain.includes(index)) {
      setSelectedChain([...selectedChain, index]);
    }
  };

  const handleConfirm = () => {
    if (selectedChain.length !== 5) return;

    const puzzle = puzzles[currentPuzzle];
    const isCorrect = selectedChain.every((val, idx) => val === puzzle.correctOrder[idx]);
    
    const newResponses = [...responses, {
      puzzleId: puzzle.id,
      isCorrect
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedChain([]);
    
    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzle(prev => prev + 1);
      }, 1500);
    } else {
      const correctCount = newResponses.filter(r => r.isCorrect).length;
      if (correctCount >= 4) {
        setCoins(5);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const correctCount = responses.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Habit Chain Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      gameId="life-197"
      gameType="life"
      totalLevels={10}
      currentLevel={7}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Outcome: {puzzles[currentPuzzle].outcome}</p>
              
              <p className="text-white/90 mb-4 text-center">Link habits:</p>
              
              <div className="space-y-3 mb-6">
                {puzzles[currentPuzzle].habits.map((habit, index) => (
                  <button
                    key={index}
                    onClick={() => handleHabitSelect(index)}
                    disabled={selectedChain.includes(index)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedChain.includes(index)
                        ? 'bg-gray-500/50'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{habit}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-white mb-4">Current chain: {selectedChain.map(i => puzzles[currentPuzzle].habits[i]).join(" -> ")}</p>
              
              <button
                onClick={handleConfirm}
                disabled={selectedChain.length !== 5}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedChain.length === 5
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Chain
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🎉 Habit Chainer!" : "💪 More Coherent!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct chains: {correctCount} out of {puzzles.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use real student examples.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HabitChainPuzzle;