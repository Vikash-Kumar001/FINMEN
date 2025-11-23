import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coins } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LemonadeStory = () => {
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
      question: "You earn ₹50 from a lemonade stand. What’s the smart choice?",
      choices: [
        { text: "Save half for supplies 🍋", correct: true },
        { text: "Spend all on toys 🧸", correct: false },
        { text: "Buy snacks 🍟", correct: false },
      ],
    },
    {
      question: "You need ₹20 for lemons. You have ₹15. What do you do?",
      choices: [
        { text: "Save ₹5 more 💰", correct: true },
        { text: "Borrow ₹5 🙈", correct: false },
        { text: "Skip buying lemons 🍋", correct: false },
      ],
    },
    {
      question: "A customer pays ₹10 instead of ₹5. What’s honest?",
      choices: [
        { text: "Return extra ₹5 🤝", correct: true },
        { text: "Keep the ₹10 💸", correct: false },
        { text: "Spend it on candy 🍬", correct: false },
      ],
    },
    {
      question: "You earn ₹30. Should you spend it all today?",
      choices: [
        { text: "No, save for next stand ✅", correct: true },
        { text: "Yes, buy games 🎮", correct: false },
        { text: "Give it away 🎁", correct: false },
      ],
    },
    {
      question: "Why is planning your lemonade stand earnings smart?",
      choices: [
        { text: "Keeps your stand running 🍋", correct: true },
        { text: "Lets you spend more 🛍️", correct: false },
        { text: "Gets you more customers 👥", correct: false },
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
      title="Lemonade Story"
      subtitle="Set up your lemonade stand wisely!"
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
      gameId="finance-kids-141"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Coins className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🍋🎉</div>
            <h3 className="text-3xl font-bold mb-4">Lemonade Tycoon!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 — great business sense!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Smart planning grows your earnings!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LemonadeStory;