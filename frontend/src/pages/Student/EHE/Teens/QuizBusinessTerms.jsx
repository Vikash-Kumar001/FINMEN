import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizBusinessTerms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What does 'profit' mean in business?",
      options: [
        {
          id: "a",
          text: "Money left after paying all costs",
          emoji: "💰",
          description: "Correct! Profit is what remains after all expenses are deducted from revenue.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Total money earned from sales",
          emoji: "💵",
          description: "That's revenue or sales, not profit. Profit is what's left after expenses.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Money spent on materials",
          emoji: "🛒",
          description: "That's cost or expenses, not profit.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is 'revenue' in business terms?",
      options: [
        {
          id: "a",
          text: "Total income from sales",
          emoji: "💳",
          description: "Exactly! Revenue is the total amount of money generated from sales.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Money paid to employees",
          emoji: "👥",
          description: "That's part of expenses, not revenue.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Profit after all costs",
          emoji: "📈",
          description: "That's profit, not revenue.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What does 'loss' mean in business?",
      options: [
        {
          id: "a",
          text: "When expenses exceed income",
          emoji: "🔻",
          description: "Perfect! A loss occurs when costs are higher than revenue.",
          isCorrect: true
        },
        {
          id: "b",
          text: "When income exceeds expenses",
          emoji: "🟢",
          description: "That's a profit situation, not a loss.",
          isCorrect: false
        },
        {
          id: "c",
          text: "When income equals expenses",
          emoji: "⚖️",
          description: "That's break-even, not a loss.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is 'overhead' in business?",
      options: [
        {
          id: "a",
          text: "Ongoing operating expenses",
          emoji: "🏢",
          description: "Correct! Overhead includes rent, utilities, salaries, and other fixed costs.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Money earned from sales",
          emoji: "🛍️",
          description: "That's revenue, not overhead.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Profit from investments",
          emoji: "📊",
          description: "That's investment income, not overhead costs.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What does 'break-even' point mean?",
      options: [
        {
          id: "a",
          text: "When revenue equals total costs",
          emoji: "⚖️",
          description: "Exactly! At break-even, there's no profit or loss - costs are covered.",
          isCorrect: true
        },
        {
          id: "b",
          text: "When revenue is double costs",
          emoji: "2️⃣",
          description: "That would be a 100% profit margin, not break-even.",
          isCorrect: false
        },
        {
          id: "c",
          text: "When costs exceed revenue",
          emoji: "📉",
          description: "That's a loss situation, not break-even.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/ehe/teens/reflex-teen-money");
  };

  return (
    <GameShell
      title="Quiz on Business Terms"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-22"
      gameType="ehe"
      totalLevels={30}
      currentLevel={22}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizBusinessTerms;