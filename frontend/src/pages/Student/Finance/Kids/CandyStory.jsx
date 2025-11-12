import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyStory = () => {
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
      question: "You have ₹20. Spend all on candy or plan for 2 days?",
      choices: [
        { text: "Spend all on candy 🍬", correct: false },
        { text: "Plan for 2 days 🗓️", correct: true },
        { text: "Give it to a friend 🎁", correct: false },
      ],
    },
    {
      question: "You can buy 1 candy for ₹5. How many can you get with ₹15?",
      choices: [
        { text: "3 candies 🍭", correct: true },
        { text: "2 candies 🍬", correct: false },
        { text: "4 candies 🍫", correct: false },
      ],
    },
    {
      question: "A candy costs ₹10, but you have ₹8. What’s the best choice?",
      choices: [
        { text: "Save ₹2 more 💰", correct: true },
        { text: "Borrow ₹2 🙈", correct: false },
        { text: "Ask for a discount 🎟️", correct: false },
      ],
    },
    {
      question: "You saved ₹10 for candy. A sale offers 2 for ₹15. What do you do?",
      choices: [
        { text: "Stick to one candy ✅", correct: true },
        { text: "Buy two candies 🛒", correct: false },
        { text: "Spend all on snacks 🍟", correct: false },
      ],
    },
    {
      question: "Why is planning your candy budget smart?",
      choices: [
        { text: "Ensures you enjoy longer 😊", correct: true },
        { text: "Lets you spend everything 🛍️", correct: false },
        { text: "Makes you buy more candy 🍬", correct: false },
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

  const handleFinish = () => {
    navigate("/games/financial-literacy/kids");
  };

  return (
    <GameShell
      title="Candy Story"
      subtitle="Plan your money wisely!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      gameId="finance-kids-41"
      gameType="finance"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center text-white">
            <div className="text-4xl mb-4">🍬</div>
            <h3 className="text-2xl font-bold mb-4">
              {stages[currentStage].question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6">🍬🎉</div>
            <h3 className="text-3xl font-bold text-white mb-4">Candy Master!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — awesome planning!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              <span>+{coins} Coins</span>
            </div>
            <p className="text-white/80 mb-6">
              Lesson: Planning your budget brings more joy than spending fast!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CandyStory;