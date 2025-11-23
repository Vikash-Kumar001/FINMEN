import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GiftMoneyStory = () => {
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
      question: "You got ₹100 as gift money. What’s the first thing to do?",
      choices: [
        { text: "Spend it all on toys 🎮", correct: false },
        { text: "Save some for later 🏦", correct: true },
        { text: "Buy snacks 🍟", correct: false },
      ],
    },
    {
      question: "You want new shoes for ₹80. You have ₹50. What’s smart?",
      choices: [
        { text: "Save ₹30 more 💰", correct: true },
        { text: "Borrow ₹30 🙈", correct: false },
        { text: "Buy a toy instead 🧸", correct: false },
      ],
    },
    {
      question: "You saved ₹20. A sale offers shoes for ₹70. Can you buy them?",
      choices: [
        { text: "No, need ₹50 more 📉", correct: true },
        { text: "Yes, I have enough 😊", correct: false },
        { text: "Ask for a discount 🎟️", correct: false },
      ],
    },
    {
      question: "Your friend suggests spending all your gift money. What do you say?",
      choices: [
        { text: "No, I’ll save some ✅", correct: true },
        { text: "Okay, let’s spend it 🎉", correct: false },
        { text: "I’ll give it to you 🎁", correct: false },
      ],
    },
    {
      question: "Why is saving gift money a good idea?",
      choices: [
        { text: "Helps buy bigger things later 🚀", correct: true },
        { text: "Lets you spend more now 🛍️", correct: false },
        { text: "Makes you buy candy 🍬", correct: false },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
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
      title="Gift Money Story"
      subtitle="You got gift money. Spend wisely!"
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
      gameId="finance-kids-68"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🎉💰</div>
            <h3 className="text-3xl font-bold mb-4">Wise Spender!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — great planning!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Saving gift money helps you plan better!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GiftMoneyStory;