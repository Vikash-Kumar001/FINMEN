import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PiggyBank = () => {
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
      question: "Piggy bank earns no interest. Bank account does. Which is better?",
      choices: [
        { text: "Bank account 🏦", correct: true },
        { text: "Piggy bank 🐷", correct: false },
        { text: "Under mattress 🛏️", correct: false },
      ],
    },
    {
      question: "You have ₹50. Where should you save to grow it?",
      choices: [
        { text: "Bank savings account 💰", correct: true },
        { text: "Jar at home 🏺", correct: false },
        { text: "Spend it 🛍️", correct: false },
      ],
    },
    {
      question: "Bank offers 5% interest. Piggy bank offers 0%. Choose wisely.",
      choices: [
        { text: "Bank for interest 📈", correct: true },
        { text: "Piggy bank for fun 🐷", correct: false },
        { text: "Give it away 🎁", correct: false },
      ],
    },
    {
      question: "You save ₹100 in a bank. It grows to ₹105. Why?",
      choices: [
        { text: "Bank pays interest 📊", correct: true },
        { text: "Piggy bank magic 🪄", correct: false },
        { text: "You added more money 💸", correct: false },
      ],
    },
    {
      question: "Why is a bank better than a piggy bank?",
      choices: [
        { text: "Safe and grows money 🔒", correct: true },
        { text: "Looks cooler 🐷", correct: false },
        { text: "Easier to carry 🎒", correct: false },
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
      title="Piggy Bank Story"
      subtitle="Choose where your money grows better!"
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
      gameId="finance-kids-125"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 text-center text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🐷🏦</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-xl font-bold transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🐷🏦🎉</div>
            <h3 className="text-3xl font-bold mb-4">Savings Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 — smart banking choices!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Banks grow your money safely!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PiggyBank;