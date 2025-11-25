import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LogicPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-54";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [solves, setSolves] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      puzzle: "Red, Blue, ?",
      options: ["Green", "Yellow", "Purple"],
      correct: "Green"
    },
    {
      id: 2,
      puzzle: "1, 2, ?",
      options: ["3", "4", "5"],
      correct: "3"
    },
    {
      id: 3,
      puzzle: "Circle, Square, ?",
      options: ["Triangle", "Star", "Heart"],
      correct: "Triangle"
    },
    {
      id: 4,
      puzzle: "Apple, Banana, ?",
      options: ["Cherry", "Dog", "Car"],
      correct: "Cherry"
    },
    {
      id: 5,
      puzzle: "Dog, Cat, ?",
      options: ["Bird", "Car", "Tree"],
      correct: "Bird"
    }
  ];

  const handleSolve = (selected) => {
    const newSolves = [...solves, selected];
    setSolves(newSolves);

    const isCorrect = selected === questions[currentLevel].correct;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      const correctSolves = newSolves.filter((sel, idx) => sel === questions[idx].correct).length;
      setFinalScore(correctSolves);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setSolves([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Logic Puzzle"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-54"
      gameType="uvls"
      totalLevels={70}
      currentLevel={54}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Complete the pattern: {getCurrentLevel().puzzle}</p>
              {/* Drag and drop simulation */}
              <div className="flex flex-wrap gap-4">
                {getCurrentLevel().options.map(opt => (
                  <div key={opt} className="bg-blue-500 p-2 rounded" onClick={() => handleSolve(opt)}>{opt} 🧩</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Puzzle Solver!" : "💪 Solve More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You solved {finalScore} puzzles!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LogicPuzzle;