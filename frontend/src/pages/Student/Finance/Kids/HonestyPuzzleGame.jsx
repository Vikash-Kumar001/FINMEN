import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HonestyPuzzleGame = () => {
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
      question: "Match: Return Money → ?",
      choices: [
        { text: "Good 😊", correct: true },
        { text: "Wrong 😞", correct: false },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Keep Extra Change → ?",
      choices: [
        { text: "Wrong 😞", correct: true },
        { text: "Good 😊", correct: false },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Tell Truth About Spending → ?",
      choices: [
        { text: "Good 😊", correct: true },
        { text: "Wrong 😞", correct: false },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Borrow Without Asking → ?",
      choices: [
        { text: "Wrong 😞", correct: true },
        { text: "Good 😊", correct: false },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Save Honestly for Goals → ?",
      choices: [
        { text: "Good 😊", correct: true },
        { text: "Wrong 😞", correct: false },
        { text: "Neutral 😐", correct: false },
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
      title="Puzzle of Honesty"
      subtitle="Match the right choices!"
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
      gameId="finance-kids-184"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-6 py-3 rounded-full w-full hover:scale-105 transition-transform"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Puzzle Master!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — honesty wins!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Matching honest choices builds great habits!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HonestyPuzzleGame;