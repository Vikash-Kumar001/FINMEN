import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LunchBoxStory = () => {
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
      question: "You borrow a friend’s lunch. Do you return/share next day?",
      choices: [
        { text: "Yes, share or return 🍽️", correct: true },
        { text: "No, keep it to myself 😐", correct: false },
        { text: "Forget about it 🙈", correct: false },
      ],
    },
    {
      question: "Your friend shares lunch. How do you thank them?",
      choices: [
        { text: "Share something back 🤝", correct: true },
        { text: "Say nothing 😶", correct: false },
        { text: "Take more lunch 🍴", correct: false },
      ],
    },
    {
      question: "You have ₹10 for lunch. Friend needs ₹5. What do you do?",
      choices: [
        { text: "Share ₹5 with friend 💸", correct: true },
        { text: "Spend all on yourself 🍔", correct: false },
        { text: "Hide your money 💰", correct: false },
      ],
    },
    {
      question: "You borrow lunch money. When do you repay?",
      choices: [
        { text: "Next day as promised ✅", correct: true },
        { text: "Never repay 😞", correct: false },
        { text: "Spend it on snacks 🍟", correct: false },
      ],
    },
    {
      question: "Why is sharing lunch with friends important?",
      choices: [
        { text: "Builds trust and kindness 😊", correct: true },
        { text: "Gets you more food 🍽️", correct: false },
        { text: "Makes you popular 👥", correct: false },
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
      title="Lunch Box Story"
      subtitle="Make fair choices with lunch sharing!"
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
      gameId="finance-kids-105"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🍽️</div>
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
            <div className="text-6xl mb-4">🎉🍽️</div>
            <h3 className="text-3xl font-bold mb-4">Lunch Hero!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for fair sharing!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Sharing builds trust with friends!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LunchBoxStory;