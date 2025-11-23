import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CostStory = () => {
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
      text: "A teen sells sandwiches. Ingredients cost ₹100, selling price is ₹200. What is the profit?",
      options: [
        {
          id: "a",
          text: "₹100 profit",
          emoji: "💰",
          description: "Correct! Profit = Selling Price - Cost Price = ₹200 - ₹100 = ₹100",
          isCorrect: true
        },
        {
          id: "b",
          text: "₹200 profit",
          emoji: "💸",
          description: "That's the selling price, not the profit. Profit is what's left after costs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "₹0 profit",
          emoji: "❌",
          description: "There is a profit since the selling price is higher than the cost.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "If the ingredients cost ₹150 and the selling price is ₹120, what happens?",
      options: [
        {
          id: "a",
          text: "₹30 loss",
          emoji: "📉",
          description: "Exactly! When costs exceed sales, it's a loss. Loss = ₹150 - ₹120 = ₹30",
          isCorrect: true
        },
        {
          id: "b",
          text: "₹30 profit",
          emoji: "📈",
          description: "A profit occurs when sales exceed costs, which isn't the case here.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Break-even",
          emoji: "⚖️",
          description: "Break-even happens when costs equal sales, not when costs exceed sales.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should the teen do to improve profit from sandwich sales?",
      options: [
        {
          id: "a",
          text: "Reduce ingredient costs or increase selling price",
          emoji: "✅",
          description: "Great! Either reducing costs or increasing prices improves profit margin.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Increase ingredient costs for better quality",
          emoji: "🛒",
          description: "Higher costs without increasing sales price reduces profit.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Lower the selling price to attract more customers",
          emoji: "🏷️",
          description: "Lowering price without reducing costs decreases profit per item.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to track costs in a business?",
      options: [
        {
          id: "a",
          text: "To understand profit and make informed decisions",
          emoji: "📊",
          description: "Perfect! Tracking costs helps determine profitability and plan for growth.",
          isCorrect: true
        },
        {
          id: "b",
          text: "To spend more money on unnecessary items",
          emoji: "💸",
          description: "Tracking costs should help control spending, not encourage it.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To ignore financial performance",
          emoji: "🙈",
          description: "Ignoring finances leads to poor business decisions and potential losses.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the break-even point in business?",
      options: [
        {
          id: "a",
          text: "When total revenue equals total costs",
          emoji: "⚖️",
          description: "Correct! At break-even, there's no profit or loss - costs are covered.",
          isCorrect: true
        },
        {
          id: "b",
          text: "When revenue is double the costs",
          emoji: "2️⃣",
          description: "That would be a 100% profit margin, not break-even.",
          isCorrect: false
        },
        {
          id: "c",
          text: "When costs exceed revenue",
          emoji: "🔻",
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
    navigate("/student/ehe/teens/quiz-business-terms");
  };

  return (
    <GameShell
      title="Cost Story"
      subtitle={`Level 21 of 30`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-21"
      gameType="ehe"
      totalLevels={30}
      currentLevel={21}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 21/30</span>
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

export default CostStory;