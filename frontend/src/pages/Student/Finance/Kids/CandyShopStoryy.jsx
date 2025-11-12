import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyShopStoryy = () => {
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
      question: "Shopkeeper charges ₹20 instead of ₹10. Do you check the bill?",
      choices: [
        { text: "Yes, I check the bill 📜", correct: true },
        { text: "No, I just pay 💸", correct: false },
        { text: "Ask a friend to check 👥", correct: false },
      ],
    },
    {
      question: "You have ₹50. The candy costs ₹15. How much change should you get?",
      choices: [
        { text: "₹35", correct: true },
        { text: "₹25", correct: false },
        { text: "₹40", correct: false },
      ],
    },
    {
      question: "The shopkeeper gives ₹30 change instead of ₹35. What do you do?",
      choices: [
        { text: "Politely ask for the correct change 🗣️", correct: true },
        { text: "Take the ₹30 and leave 🚶", correct: false },
        { text: "Buy more candy 🍬", correct: false },
      ],
    },
    {
      question: "You want to buy two candies at ₹10 each. Can you afford it with ₹15?",
      choices: [
        { text: "No, I need ₹20 💰", correct: true },
        { text: "Yes, I have enough 😊", correct: false },
        { text: "Ask for a discount 🎟️", correct: false },
      ],
    },
    {
      question: "What’s the best way to shop smartly?",
      choices: [
        { text: "Check prices and bills carefully 🧾", correct: true },
        { text: "Buy everything you see 🛒", correct: false },
        { text: "Only shop with friends 👨‍👩‍👧", correct: false },
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
      title="Candy Shop Story"
      subtitle="Make smart choices at the candy shop!"
      coins={coins}
      currentLevel={stage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      gameId="finance-kids-161"
      gameType="finance"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
    >
      <div className="space-y-8 text-white text-center">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-6">{stages[stage].question}</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {stages[stage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">🍬🛒🎉</div>
            <h3 className="text-3xl font-bold mb-4">Smart Shopper!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — great job checking those bills!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">
              Lesson: Always check prices and bills to shop wisely.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CandyShopStoryy;