import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfRights = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [choices, setChoices] = useState([]);

  const puzzles = [
    {
      id: 1,
      text: "Match: Right to Safety → Safe Goods, Right to Information → Honest Label",
      options: [
        { id: "correct", text: "Match correctly", emoji: "✅", description: "Correct consumer rights", isCorrect: true },
        { id: "wrong", text: "Match wrong", emoji: "❌", description: "Incorrect pairing", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 2,
      text: "Match: Right to Choose → Options, Right to Redress → Refund",
      options: [
        { id: "correct", text: "Match correctly", emoji: "✅", description: "Right matches", isCorrect: true },
        { id: "wrong", text: "Match wrong", emoji: "❌", description: "Wrong pairing", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 3,
      text: "Match: Right to Education → Awareness, Right to Safety → Quality",
      options: [
        { id: "correct", text: "Match correctly", emoji: "✅", description: "Accurate matches", isCorrect: true },
        { id: "wrong", text: "Match wrong", emoji: "❌", description: "Incorrect", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 4,
      text: "Match: Right to Redress → Compensation, Right to Choose → Variety",
      options: [
        { id: "correct", text: "Match correctly", emoji: "✅", description: "Correct rights", isCorrect: true },
        { id: "wrong", text: "Match wrong", emoji: "❌", description: "Wrong types", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 5,
      text: "Match: Right to Information → Transparency, Right to Safety → Protection",
      options: [
        { id: "correct", text: "Match correctly", emoji: "✅", description: "Perfect pairing", isCorrect: true },
        { id: "wrong", text: "Match wrong", emoji: "❌", description: "Incorrect", isCorrect: false }
      ],
      reward: 7
    }
  ];

  const handleChoice = (selectedChoice) => {
    resetFeedback();
    const puzzle = puzzles[currentPuzzle];
    const isCorrect = puzzle.options.find(opt => opt.id === selectedChoice)?.isCorrect;

    setChoices([...choices, { puzzleId: puzzle.id, choice: selectedChoice, isCorrect }]);
    if (isCorrect) {
      setCoins(prev => prev + puzzle.reward);
      showCorrectAnswerFeedback(puzzle.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => setCurrentPuzzle(prev => prev + 1), 800);
    } else {
      const correctAnswers = [...choices, { puzzleId: puzzle.id, choice: selectedChoice, isCorrect }].filter(c => c.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentPuzzle(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Puzzle: Consumer Rights"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      coins={coins}
      currentLevel={currentPuzzle + 1}
      totalLevels={puzzles.length}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-teens-174"
      gameType="finance"
    >
      <div className="space-y-8 text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            <p className="text-xl mb-6">{puzzles[currentPuzzle].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {puzzles[currentPuzzle].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{opt.text}</h3>
                  <p className="text-white/90">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            {finalScore >= 3 ? (
              <>
                <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-3xl font-bold mb-4">Consumer Rights Puzzle Star!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct!</p>
                <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
                  +{coins} Coins
                </div>
                <p className="text-white/80 mt-4">Lesson: Know your consumer rights!</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct.</p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-transform hover:scale-105"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfRights;