import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MoneyHonestyQuizGame = () => {
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
      question: "Which is the honest choice if you find ₹10?",
      choices: [
        { text: "Return it to the owner 🤝", correct: true },
        { text: "Keep it quietly 🤫", correct: false },
        { text: "Spend it on snacks 🍟", correct: false },
      ],
    },
    {
      question: "You get ₹5 extra change. What’s the right thing to do?",
      choices: [
        { text: "Give back the extra 💸", correct: true },
        { text: "Buy candy 🍬", correct: false },
        { text: "Say nothing 😶", correct: false },
      ],
    },
    {
      question: "You borrow ₹20. What’s honest?",
      choices: [
        { text: "Repay it on time ✅", correct: true },
        { text: "Never repay 😞", correct: false },
        { text: "Spend more instead 🛍️", correct: false },
      ],
    },
    {
      question: "You break a ₹15 toy. What do you do?",
      choices: [
        { text: "Tell and offer to pay 🗣️", correct: true },
        { text: "Hide it 🧸", correct: false },
        { text: "Blame someone else 🙈", correct: false },
      ],
    },
    {
      question: "Why is honesty with money important?",
      choices: [
        { text: "It earns trust 😊", correct: true },
        { text: "It gets you more money 💰", correct: false },
        { text: "It lets you spend more 🛒", correct: false },
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
      title="Quiz on Money Honesty"
      subtitle="Which is the honest choice?"
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
      gameId="finance-kids-182"
      gameType="finance"
    >
      <div className="space-y-4 text-center text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="w-full px-6 py-3 rounded-full bg-white/20 hover:bg-yellow-500 transition-transform hover:scale-105"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Honesty Quiz Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 — honesty wins!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Honesty is the best choice!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MoneyHonestyQuizGame;