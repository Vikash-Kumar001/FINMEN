import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleNeedsWants = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-34";
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
      question: "Match: Water → Need, Candy → Want",
      choices: [
        { text: "Water = Need, Candy = Want 🥤🍬", correct: true },
        { text: "Water = Want, Candy = Need 🍬🥤", correct: false },
        { text: "Both are Needs 🥤🍬", correct: false },
      ],
    },
    {
      question: "Match: Shoes → Need, Video Game → Want",
      choices: [
        { text: "Shoes = Need, Video Game = Want 👟🎮", correct: true },
        { text: "Shoes = Want, Video Game = Need 🎮👟", correct: false },
        { text: "Both are Wants 👟🎮", correct: false },
      ],
    },
    {
      question: "Match: Food → Need, Toy Car → Want",
      choices: [
        { text: "Food = Need, Toy Car = Want 🍎🚗", correct: true },
        { text: "Food = Want, Toy Car = Need 🚗🍎", correct: false },
        { text: "Both are Needs 🍎🚗", correct: false },
      ],
    },
    {
      question: "Match: School Books → Need, Ice Cream → Want",
      choices: [
        { text: "School Books = Need, Ice Cream = Want 📚🍨", correct: true },
        { text: "School Books = Want, Ice Cream = Need 🍨📚", correct: false },
        { text: "Both are Wants 📚🍨", correct: false },
      ],
    },
    {
      question: "Why distinguish between needs and wants?",
      choices: [
        { text: "Helps prioritize spending 📚", correct: true },
        { text: "Makes buying toys fun 🧸", correct: false },
        { text: "Gets you more candy 🍬", correct: false },
      ],
    },
  ];

  const [answered, setAnswered] = useState(false);

  const handleSelect = (isCorrect) => {
    if (answered) return; // Prevent multiple clicks
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentStage === stages.length - 1;
    
    // Move to next question or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentStage((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Puzzle of Needs/Wants"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Match items to Needs or Wants!` : "Game Complete!"}
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
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <div className="text-4xl mb-4">🧩</div>
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-blue-500 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={answered || showResult}
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

export default PuzzleNeedsWants;