import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleNeedsWants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
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

  const handleSelect = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Puzzle of Needs/Wants"
      subtitle="Match items to Needs or Wants!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-64"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-green-500 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🧩🎉</div>
            <h3 className="text-3xl font-bold mb-4">Needs/Wants Puzzle Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for matching needs and wants!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Prioritize needs over wants!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleNeedsWants;