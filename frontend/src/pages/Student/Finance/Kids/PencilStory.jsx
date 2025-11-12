import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PencilStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 for this game
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "You borrow a pencil from a friend. Do you return it?",
      choices: [
        { text: "Yes, return it ✏️", correct: true },
        { text: "No, keep it 😐", correct: false },
        { text: "Lose it 🙈", correct: false },
      ],
    },
    {
      question: "You need a pencil but have none. What do you do?",
      choices: [
        { text: "Ask to borrow and return 🤝", correct: true },
        { text: "Take one without asking 🤫", correct: false },
        { text: "Skip writing ✍️", correct: false },
      ],
    },
    {
      question: "You break a borrowed pencil. What’s honest?",
      choices: [
        { text: "Replace it with a new one ✅", correct: true },
        { text: "Hide it 🧸", correct: false },
        { text: "Blame someone else 🙈", correct: false },
      ],
    },
    {
      question: "Your friend lends you ₹5 for a pencil. What do you do?",
      choices: [
        { text: "Repay the ₹5 💸", correct: true },
        { text: "Spend it on candy 🍬", correct: false },
        { text: "Forget to repay 😞", correct: false },
      ],
    },
    {
      question: "Why is returning borrowed items important?",
      choices: [
        { text: "Builds trust with friends 😊", correct: true },
        { text: "Gets you more pencils ✏️", correct: false },
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
      title="Pencil Story"
      subtitle="Make honest choices with borrowed items!"
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
      gameId="finance-kids-101"
      gameType="finance"
      showGameOver={showResult}
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">✏️</div>
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
            <div className="text-6xl mb-4">🎉✏️</div>
            <h3 className="text-3xl font-bold mb-4">Pencil Hero!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for honest choices!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Honesty with borrowed items builds trust!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PencilStory;