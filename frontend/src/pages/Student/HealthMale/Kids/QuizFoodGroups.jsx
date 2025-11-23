import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizFoodGroups = () => {
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
      text: "Which food gives you protein for strong muscles?",
      options: [
        {
          id: "b",
          text: "Rice",
          emoji: "🍚",
          description: "Rice gives energy but not protein",
          isCorrect: false
        },
        {
          id: "a",
          text: "Dal (lentils)",
          emoji: "🍛",
          description: "Dal is rich in protein for muscle building",
          isCorrect: true
        },
        {
          id: "c",
          text: "Chocolate",
          emoji: "🍫",
          description: "Chocolate has sugar but no protein",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What food group gives you energy to play?",
      options: [
        {
          id: "c",
          text: "Vegetables",
          emoji: "🥕",
          description: "Vegetables give vitamins, not energy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Bread and rice",
          emoji: "🍞",
          description: "Carbohydrates give you energy to run and play",
          isCorrect: true
        },
        {
          id: "a",
          text: "Milk",
          emoji: "🥛",
          description: "Milk gives calcium but not quick energy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which food has vitamins to keep you healthy?",
      options: [
        {
          id: "a",
          text: "Fruits",
          emoji: "🍎",
          description: "Fruits are full of vitamins and minerals",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips",
          emoji: "🥔",
          description: "Chips have salt and oil but no vitamins",
          isCorrect: false
        },
        {
          id: "c",
          text: "Candy",
          emoji: "🍬",
          description: "Candy has sugar but no healthy vitamins",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What food group helps build strong bones?",
      options: [
        {
          id: "c",
          text: "Meat",
          emoji: "🥩",
          description: "Meat gives protein but not strong bones",
          isCorrect: false
        },
        {
          id: "b",
          text: "Dairy products",
          emoji: "🧀",
          description: "Milk, cheese, yogurt give calcium for bones",
          isCorrect: true
        },
        {
          id: "a",
          text: "Bread",
          emoji: "🍞",
          description: "Bread gives energy but not bone strength",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which food protects you from getting sick?",
      options: [
        {
          id: "b",
          text: "Soda",
          emoji: "🥤",
          description: "Soda has sugar but no protective nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Pizza",
          emoji: "🍕",
          description: "Pizza is tasty but not protective",
          isCorrect: false
        },
        {
          id: "a",
          text: "Vegetables",
          emoji: "🥬",
          description: "Vegetables boost your immune system",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(3, true);
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
    navigate("/student/health-male/kids/reflex-healthy-choice");
  };

  return (
    <GameShell
      title="Quiz on Food Groups"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-male-kids-12"
      gameType="health-male"
      totalLevels={20}
      currentLevel={12}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 3}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nutrition Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizFoodGroups;
