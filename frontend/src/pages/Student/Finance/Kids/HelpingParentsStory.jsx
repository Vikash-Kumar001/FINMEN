import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Coins } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HelpingParentsStory = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "Your parents need ₹50 for groceries. You have ₹20. What do you do?",
      choices: [
        { text: "Give your ₹20 to help 🥕", correct: true },
        { text: "Keep it for candy 🍬", correct: false },
        { text: "Ignore their request 😐", correct: false },
      ],
    },
    {
      question: "You earn ₹10 helping at home. Should you save it?",
      choices: [
        { text: "Yes, add to savings 💰", correct: true },
        { text: "Spend it on toys 🧸", correct: false },
        { text: "Give it away 🎁", correct: false },
      ],
    },
    {
      question: "Your parents ask you to buy milk for ₹15. You have ₹20. What’s next?",
      choices: [
        { text: "Buy milk and return change 🧀", correct: true },
        { text: "Buy candy with change 🍭", correct: false },
        { text: "Keep all ₹20 🤫", correct: false },
      ],
    },
    {
      question: "You find ₹10. Parents say to be honest. What do you do?",
      choices: [
        { text: "Try to find the owner 🕵️", correct: true },
        { text: "Spend it on snacks 🍟", correct: false },
        { text: "Hide it in your pocket 🧥", correct: false },
      ],
    },
    {
      question: "Helping parents with money makes you feel…",
      choices: [
        { text: "Proud and responsible 😊", correct: true },
        { text: "Sad for less money 😔", correct: false },
        { text: "Nothing special 😐", correct: false },
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
      title="Helping Parents Story"
      subtitle="Helping family counts as experience and earning."
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
      gameId="finance-kids-145"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Heart className="mx-auto w-10 h-10 text-pink-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">👨‍👩‍👧🎉</div>
            <h3 className="text-3xl font-bold mb-4">Family Helper!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — awesome teamwork!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Helping family builds trust and responsibility!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HelpingParentsStory;