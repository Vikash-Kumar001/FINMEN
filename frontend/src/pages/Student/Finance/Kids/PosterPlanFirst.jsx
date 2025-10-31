import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterPlanFirst = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Choose a poster: "Budget Saves Money."',
      choices: [
        { text: "Budget Saves Money 💰", correct: true },
        { text: "Spend Without Plan 🛍️", correct: false },
        { text: "Buy Now, Think Later 🛒", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Plan First, Buy Later."',
      choices: [
        { text: "Plan First, Buy Later 🎯", correct: true },
        { text: "Spend All Now 🎉", correct: false },
        { text: "Hide Money 🏺", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Smart Budget, Big Wins."',
      choices: [
        { text: "Smart Budget, Big Wins 📈", correct: true },
        { text: "Buy Toys Fast 🧸", correct: false },
        { text: "Give Money Away 🎁", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Plan Today, Thrive Tomorrow."',
      choices: [
        { text: "Plan Today, Thrive Tomorrow 🌟", correct: true },
        { text: "Spend Without Care 🛍️", correct: false },
        { text: "Keep Cash in Pocket 🎒", correct: false },
      ],
    },
    {
      question: 'Why do budgeting posters help kids?',
      choices: [
        { text: "Teach smart planning 📚", correct: true },
        { text: "Encourage spending 🛒", correct: false },
        { text: "Make budgeting fun 🎉", correct: false },
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
      title="Poster: Plan First"
      subtitle="Choose posters that promote budgeting!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-26"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Paintbrush className="mx-auto mb-4 w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-green-600 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-6">🏅</div>
            <h3 className="text-3xl font-bold mb-4">Budget Poster Pro!</h3>
            <p className="text-white/80 text-lg mb-6">
              You earned {coins} out of 5 for smart budgeting messages!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Budgeting leads to smart spending!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterPlanFirst;