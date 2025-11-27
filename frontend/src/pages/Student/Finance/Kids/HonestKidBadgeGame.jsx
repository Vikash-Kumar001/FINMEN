import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Star } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HonestKidBadgeGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-100";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "You find ₹10 on the playground. What’s the honest choice?",
      choices: [
        { text: "Keep it for yourself 🤫", correct: false },
         { text: "Give it to a teacher 🧑‍🏫", correct: true },
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
        { text: "Give it without expecting back 🎁", correct: false },
        { text: "Refuse to lend 😐", correct: false },
        { text: "Lend and agree on repayment 🤝", correct: true },
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
        { text: "It gets you more money 💰", correct: false },
        { text: "It lets you spend more 🛍️", correct: false },
        { text: "It earns trust and respect 😊", correct: true },
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

  const handleFinish = () => {
    navigate("/games/financial-literacy/kids");
  };

  return (
    <GameShell
      title="Badge: Honest Kid"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleFinish}
      nextEnabled={false}
      showGameOver={showResult}
      showConfetti={showResult && coins === stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-100"
      gameType="finance"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentStage + 1} of ${stages.length}`}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Score: {coins}/{stages.length}</span>
            </div>
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default HonestKidBadgeGame;