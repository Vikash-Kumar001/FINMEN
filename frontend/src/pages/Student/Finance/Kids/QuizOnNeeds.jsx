import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnNeeds = () => {
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
      question: "Which one is a need?",
      options: ["Food", "Fancy toy", "Chocolates"],
      correct: "Food",
    },
    {
      question: "What’s a need for school?",
      options: ["Books", "Video games", "Candy"],
      correct: "Books",
    },
    {
      question: "What’s a need to stay healthy?",
      options: ["Water", "Soda", "Ice cream"],
      correct: "Water",
    },
    {
      question: "What’s a need for safety?",
      options: ["Clothes", "Toys", "Movies"],
      correct: "Clothes",
    },
    {
      question: "Why prioritize needs over wants?",
      options: ["Ensures survival", "Gets more toys", "Makes you happy"],
      correct: "Ensures survival",
    },
  ];

  const handleAnswer = (choice) => {
    resetFeedback();
    if (choice === stages[currentStage].correct) {
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
      title="Quiz on Needs"
      subtitle="Test your knowledge about needs!"
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
      gameId="finance-kids-62"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-bold transition-transform hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-3xl font-bold mb-4">Needs Quiz Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for knowing needs!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Needs come first for survival!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnNeeds;