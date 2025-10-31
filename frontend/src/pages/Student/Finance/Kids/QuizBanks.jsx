import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizBanks = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "What is a bank?",
      options: ["Toy shop", "Place to keep money safe", "Ice cream shop"],
      correct: "Place to keep money safe",
    },
    {
      question: "What does a bank’s savings account do?",
      options: ["Gives you toys", "Grows your money", "Sells food"],
      correct: "Grows your money",
    },
    {
      question: "What can you do at a bank’s ATM?",
      options: ["Buy clothes", "Withdraw money", "Play games"],
      correct: "Withdraw money",
    },
    {
      question: "Why do banks offer loans?",
      options: ["To help you borrow money", "To give free money", "To sell toys"],
      correct: "To help you borrow money",
    },
    {
      question: "Why are banks safe for money?",
      options: ["They protect your savings", "They give you candy", "They hide money"],
      correct: "They protect your savings",
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
      title="Quiz on Banks"
      subtitle="Test your knowledge about banks!"
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
      gameId="finance-kids-82"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-full text-white font-bold transition-transform hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Bank Quiz Master!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for banking knowledge!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Banks keep and grow your money!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizBanks;