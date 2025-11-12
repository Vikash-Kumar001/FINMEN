import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PetSittingStory = () => {
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
      question: "You care for a neighbor’s pet. Is this work?",
      choices: [
        { text: "Yes, it’s work 🐶", correct: true },
        { text: "No, it’s just fun 😺", correct: false },
        { text: "It’s a favor 🎁", correct: false },
      ],
    },
    {
      question: "You earn ₹20 pet sitting. What’s smart?",
      choices: [
        { text: "Save half for supplies 💰", correct: true },
        { text: "Spend all on candy 🍬", correct: false },
        { text: "Give it away 🎉", correct: false },
      ],
    },
    {
      question: "You forget to feed the pet. What do you do?",
      choices: [
        { text: "Tell the owner honestly 🗣️", correct: true },
        { text: "Hide it 🤫", correct: false },
        { text: "Blame someone else 🙈", correct: false },
      ],
    },
    {
      question: "You’re paid ₹10 extra by mistake. What’s right?",
      choices: [
        { text: "Return the extra ₹10 💸", correct: true },
        { text: "Keep it quietly 😶", correct: false },
        { text: "Spend it on toys 🧸", correct: false },
      ],
    },
    {
      question: "Why is pet sitting a good way to earn money?",
      choices: [
        { text: "Teaches responsibility 🐾", correct: true },
        { text: "Gets you more pets 🐱", correct: false },
        { text: "Makes you spend more 🛍️", correct: false },
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
      title="Pet Sitting Story"
      subtitle="Make smart choices while pet sitting!"
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
      gameId="finance-kids-148"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🐶</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-blue-500 px-8 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🐾🎉</div>
            <h3 className="text-3xl font-bold mb-4">Pet Sitting Pro!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for responsible choices!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Pet sitting teaches responsibility!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PetSittingStory;