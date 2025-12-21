import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterPlanFirst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-26";
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
  const [answered, setAnswered] = useState(false);

  const stages = [
    {
      question: "What is the first step in creating a budget?",
      choices: [
        { text: "Buy what you want immediately 🛍️", correct: false },
        { text: "List your income and expenses 📋", correct: true },
        { text: "Spend all your money 🎉", correct: false },
        { text: "Hide your money 🏺", correct: false }
      ],
    },
    {
      question: "What should you do if your expenses are higher than your income?",
      choices: [
        { text: "Ignore the problem 🙈", correct: false },
        { text: "Spend more money 🤑", correct: false },
        { text: "Find ways to reduce expenses or increase income 💡", correct: true },
        { text: "Give up on budgeting 🏃", correct: false }
      ],
    },
    {
      question: "Why is it important to track your spending?",
      choices: [
        { text: "To understand where your money goes 🔍", correct: true },
        { text: "To spend more freely 💳", correct: false },
        { text: "To avoid paying bills 📉", correct: false },
        { text: "To make budgeting more difficult 🤯", correct: false }
      ],
    },
    {
      question: "What is a good strategy for sticking to a budget?",
      choices: [
        { text: "Spend whenever you feel like it 🔄", correct: false },
        { text: "Avoid checking your bank account 🙅", correct: false },
        { text: "Set spending limits and review regularly 📊", correct: true },
        { text: "Use all your credit cards 🎴", correct: false }
      ],
    },
    {
      question: "What is the benefit of saving money before buying non-essential items?",
      choices: [
        { text: "You can spend more money overall 💸", correct: false },
        { text: "You will never enjoy anything 🙁", correct: false },
        { text: "You will become rich instantly 💰", correct: false },
        { text: "You can make thoughtful purchases without guilt ✅", correct: true },
      ],
    }
  ];

  const handleSelect = (isCorrect) => {
    if (answered) return; // Prevent multiple clicks
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentStage === stages.length - 1;
    
    // Move to next question or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentStage((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Budgeting Basics"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Test your budgeting knowledge!`}
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
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <Paintbrush className="mx-auto mb-4 w-8 h-8 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-green-600 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={answered || showResult}
              >
                <div className="text-lg font-semibold">{choice.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PosterPlanFirst;