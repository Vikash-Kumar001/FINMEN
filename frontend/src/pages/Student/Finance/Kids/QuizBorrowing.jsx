import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizBorrowing = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "What’s borrowing?",
      options: ["Taking without asking", "Using and returning", "Stealing"],
      correct: "Using and returning",
    },
    {
      question: "What should you do after borrowing a book?",
      options: ["Keep it forever", "Return it", "Sell it"],
      correct: "Return it",
    },
    {
      question: "Why is borrowing money from a bank okay?",
      options: ["You repay with interest", "It’s free money", "You don’t repay"],
      correct: "You repay with interest",
    },
    {
      question: "What happens if you don’t return borrowed items?",
      options: ["You lose trust", "You get more items", "You get rewards"],
      correct: "You lose trust",
    },
    {
      question: "Why is honest borrowing important?",
      options: ["Builds trust with others", "Gets you more toys", "Makes borrowing fun"],
      correct: "Builds trust with others",
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
      title="Quiz on Borrowing"
      subtitle="Test your knowledge about borrowing!"
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
      gameId="finance-kids-102"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-3xl font-bold mb-4">Borrowing Quiz Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for borrowing knowledge!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Borrow responsibly and return!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizBorrowing;