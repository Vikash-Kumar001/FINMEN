import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleBankUses = () => {
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-44";
  const gameData = getGameDataById(gameId);

  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'What happens when you put money in a bank?',
      choices: [
        { text: "It's given to other people to spend freely 💸", correct: false },
        { text: "It's converted into gold bars and stored in a vault 🪙", correct: false },
        { text: "It's kept safe and can earn interest over time 💰", correct: true }
      ],
    },
    {
      question: 'When you take a loan from a bank, what are you doing?',
      choices: [
        { text: "Borrowing money you'll need to pay back with interest 📝", correct: true },
        { text: "Getting free money as a gift from the bank 🎁", correct: false },
        { text: "Trading your future earnings for cash today ⏳", correct: false },
      ],
    },
    {
      question: 'What can you do at an ATM besides withdraw cash?',
      choices: [
        { text: "Apply for a mortgage or car loan 🏠", correct: false },
        { text: "Check your balance and deposit checks/cash 📄", correct: true },
        { text: "Exchange foreign currency 🌍", correct: false },
      ],
    },
    {
      question: 'How does a savings account help your money grow?',
      choices: [
        { text: "By earning interest on your balance over time 📈", correct: true },
        { text: "By automatically investing in stocks and bonds 📊", correct: false },
        { text: "By giving you cashback on purchases 🛍️", correct: false },
      ],
    },
    {
      question: 'What is the main purpose of learning about banking?',
      choices: [
        { text: "To impress friends with banking knowledge 🎩", correct: false },
        { text: "To get rich quickly without working 💶", correct: false },
        { text: "To make smart money decisions and build a secure future 🧠", correct: true },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Puzzle: Bank Uses"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Match banking actions to their uses!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="bg-blue-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform"
                disabled={showResult}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleBankUses;