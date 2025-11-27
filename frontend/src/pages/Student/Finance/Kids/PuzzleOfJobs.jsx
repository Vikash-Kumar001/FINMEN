import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Puzzle } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleOfJobs = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-74";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "Match: Farmer",
      choices: [
        { text: "Crops 🌾", correct: true },
        { text: "Knowledge 📚", correct: false },
        { text: "Toys 🧸", correct: false },
      ],
    },
    {
      question: "Match: Teacher",
      choices: [
        { text: "Goods 🛍️", correct: false },
        { text: "Knowledge 📚", correct: true },
        { text: "Crops 🌾", correct: false },
      ],
    },
    {
      question: "Match: Shopkeeper",
      choices: [
        { text: "Services 🔧", correct: false },
        { text: "Lessons 📖", correct: false },
        { text: "Goods 🛍️", correct: true },
      ],
    },
    {
      question: "Match: Doctor",
      choices: [
        { text: "Food 🍎", correct: false },
        { text: "Health 🩺", correct: true },
        { text: "Money 💰", correct: false },
      ],
    },
    {
      question: "Why do jobs provide value?",
      choices: [
        { text: "They meet people’s needs 📚", correct: true },
        { text: "They give free toys 🧸", correct: false },
        { text: "They make work fun 🎉", correct: false },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Puzzle of Jobs"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Match jobs to what they provide!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <Puzzle className="mx-auto w-10 h-10 text-purple-500 mb-4" />
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-blue-500 transition-transform hover:scale-105"
                disabled={showResult}
              >
                <div className="text-lg font-semibold">{choice.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleOfJobs;   