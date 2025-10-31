import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHonesty = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "Who is honest?",
      options: ["Gives correct change", "Cheats customer", "Lies"],
      correct: "Gives correct change",
    },
    {
      question: "What does an honest shopkeeper do?",
      options: ["Charges fair prices", "Overcharges", "Hides products"],
      correct: "Charges fair prices",
    },
    {
      question: "How does honesty help in shopping?",
      options: ["Builds trust", "Gets you free items", "Makes you spend more"],
      correct: "Builds trust",
    },
    {
      question: "What’s an honest way to borrow?",
      options: ["Return on time", "Keep it forever", "Borrow more"],
      correct: "Return on time",
    },
    {
      question: "Why is honesty important in money matters?",
      options: ["It earns trust", "It gets you toys", "It makes you famous"],
      correct: "It earns trust",
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
      title="Quiz on Honesty"
      subtitle="Test your knowledge about honesty!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-162"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <ClipboardCheck className="mx-auto w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-white font-bold transition-transform hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <ClipboardCheck className="mx-auto w-16 h-16 text-green-500 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Honesty Quiz Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for honesty knowledge!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Honesty builds trust!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnHonesty;