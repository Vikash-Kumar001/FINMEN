import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BirthdayMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stage, setStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "You get ₹100 as birthday money. What will you do?",
      choices: [
        { text: "Spend all on toys and candies 🎮🍬", correct: false },
        { text: "Give it all to mom for safekeeping 👩‍👧", correct: false },
        { text: "Split it: some for fun, some for saving 💡🏦", correct: true },
      ],
    },
    {
      question: "What does ‘split wisely’ mean?",
      choices: [
        { text: "Spend half on friends' gifts 🎁", correct: false },
        { text: "Keep some for savings and some for fun 🎯", correct: true },
        { text: "Buy only needs, no wants 🛒", correct: false },
      ],
    },
    {
      question: "Saving a part of your gift money helps you…",
      choices: [
        { text: "Buy bigger things later 🚀", correct: true },
        { text: "Forget about the money 😅", correct: false },
        { text: "Spend more now 🛍️", correct: false },
      ],
    },
    {
      question: "If you want to buy something big later, what’s smart?",
      choices: [
        { text: "Save small amounts regularly 💰", correct: true },
        { text: "Borrow from friends 🙈", correct: false },
        { text: "Wait for next birthday 🎂", correct: false },
      ],
    },
    {
      question: "What’s a balanced decision?",
      choices: [
        { text: "Enjoy a treat and save the rest 🧁🏦", correct: true },
        { text: "Spend all today 🎉", correct: false },
        { text: "Save everything, no fun 😔", correct: false },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setCoins((c) => c + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (stage < stages.length - 1) {
      setTimeout(() => setStage((s) => s + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Birthday Money Story"
      subtitle="Make smart choices with your birthday money!"
      coins={coins}
      currentLevel={stage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      gameId="finance-kids-45"
      gameType="finance"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 text-white text-center">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6">{stages[stage].question}</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {stages[stage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">🎂💰🎉</div>
            <h3 className="text-3xl font-bold mb-4">Wise Birthday Choices!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — that’s balanced budgeting!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">
              Lesson: Always balance your needs, wants, and savings.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BirthdayMoney;