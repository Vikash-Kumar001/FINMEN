import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Puzzle } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfJobs = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "Match: Farmer → Crops",
      choices: [
        { text: "Farmer = Crops 🌾", correct: true },
        { text: "Farmer = Knowledge 📚", correct: false },
        { text: "Farmer = Toys 🧸", correct: false },
      ],
    },
    {
      question: "Match: Teacher → Knowledge",
      choices: [
        { text: "Teacher = Knowledge 📚", correct: true },
        { text: "Teacher = Goods 🛍️", correct: false },
        { text: "Teacher = Crops 🌾", correct: false },
      ],
    },
    {
      question: "Match: Shopkeeper → Goods",
      choices: [
        { text: "Shopkeeper = Goods 🛍️", correct: true },
        { text: "Shopkeeper = Services 🔧", correct: false },
        { text: "Shopkeeper = Lessons 📖", correct: false },
      ],
    },
    {
      question: "Match: Doctor → Health",
      choices: [
        { text: "Doctor = Health 🩺", correct: true },
        { text: "Doctor = Food 🍎", correct: false },
        { text: "Doctor = Money 💰", correct: false },
      ],
    },
    {
      question: "Why do jobs provide value?",
      choices: [
        { text: "They meet people’s needs 📚", correct: true },
        { text: "They give free toys 🧸", correct: false },
        { text: "They make work fun 🎉", correct: false },
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
      title="Puzzle of Jobs"
      subtitle="Match jobs to what they provide!"
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
      gameId="finance-kids-144"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Puzzle className="mx-auto w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-blue-500 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Puzzle className="mx-auto w-16 h-16 text-purple-500 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Jobs Puzzle Master!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for matching jobs!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Jobs provide valuable services!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfJobs;