import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleBankUses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Match: Deposit → Safe.',
      choices: [
        { text: "Deposit = Safe 🔒", correct: true },
        { text: "Deposit = Spend 🛍️", correct: false },
        { text: "Deposit = Borrow 💸", correct: false },
      ],
    },
    {
      question: 'Match: Loan → Borrow.',
      choices: [
        { text: "Loan = Borrow 🤝", correct: true },
        { text: "Loan = Save 💰", correct: false },
        { text: "Loan = Withdraw 🏧", correct: false },
      ],
    },
    {
      question: 'Match: ATM → Withdraw.',
      choices: [
        { text: "ATM = Withdraw 🏧", correct: true },
        { text: "ATM = Deposit 📥", correct: false },
        { text: "ATM = Invest 📈", correct: false },
      ],
    },
    {
      question: 'Match: Savings Account → Grow Money.',
      choices: [
        { text: "Savings Account = Grow Money 📈", correct: true },
        { text: "Savings Account = Spend 🛒", correct: false },
        { text: "Savings Account = Lose Money 😞", correct: false },
      ],
    },
    {
      question: 'Why learn about bank uses?',
      choices: [
        { text: "Helps manage money wisely 📚", correct: true },
        { text: "Makes banks fun 🎉", correct: false },
        { text: "Gets you more toys 🧸", correct: false },
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
      title="Puzzle: Bank Uses"
      subtitle="Match banking actions to their uses!"
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
      gameId="finance-kids-84"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="bg-blue-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Bank Puzzle Master!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for solving bank puzzles!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Banks help manage money wisely!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleBankUses;