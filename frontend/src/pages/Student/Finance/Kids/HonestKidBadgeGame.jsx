import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Star } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HonestKidBadgeGame = () => {
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
      question: "You find ₹10 on the playground. What’s the honest choice?",
      choices: [
        { text: "Give it to a teacher 🧑‍🏫", correct: true },
        { text: "Keep it for yourself 🤫", correct: false },
        { text: "Spend it on snacks 🍟", correct: false },
      ],
    },
    {
      question: "You’re given extra change at a shop. What do you do?",
      choices: [
        { text: "Return the extra change 💸", correct: true },
        { text: "Buy more candy 🍬", correct: false },
        { text: "Say nothing 😶", correct: false },
      ],
    },
    {
      question: "Your friend asks to borrow ₹5. What’s a fair deal?",
      choices: [
        { text: "Lend and agree on repayment 🤝", correct: true },
        { text: "Give it without expecting back 🎁", correct: false },
        { text: "Refuse to lend 😐", correct: false },
      ],
    },
    {
      question: "You break a toy worth ₹20. What’s honest?",
      choices: [
        { text: "Tell your parents and offer to pay 🗣️", correct: true },
        { text: "Hide the broken toy 🧸", correct: false },
        { text: "Blame someone else 🙈", correct: false },
      ],
    },
    {
      question: "Why does honesty with money matter?",
      choices: [
        { text: "It earns trust and respect 😊", correct: true },
        { text: "It gets you more money 💰", correct: false },
        { text: "It lets you spend more 🛍️", correct: false },
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
      title="Badge: Honest Kid"
      subtitle="Handle 5 honest money cases to earn your badge."
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
      gameId="finance-kids-190"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Star className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Star className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Honest Kid Badge Earned!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — you’re a true honest kid!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Honesty is the best way to handle money!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HonestKidBadgeGame;