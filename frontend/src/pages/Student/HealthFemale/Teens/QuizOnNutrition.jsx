import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnNutrition = () => {
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
      text: "Which combination best supports healthy skin and energy?",
      options: [
        {
          id: "a",
          text: "Fruits and water",
          emoji: "🍎",
          description: "Fruits provide vitamins and water keeps skin hydrated",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only chips",
          emoji: "🍟",
          description: "Chips lack nutrients and can cause skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Soda and candy",
          emoji: "🥤",
          description: "High sugar content can cause skin breakouts",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which nutrient is most important for building strong bones?",
      options: [
        {
          id: "a",
          text: "Calcium",
          emoji: "🥛",
          description: "Calcium is essential for bone health and strength",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sugar",
          emoji: "🍬",
          description: "Sugar doesn't contribute to bone strength",
          isCorrect: false
        },
        {
          id: "c",
          text: "Salt",
          emoji: "🧂",
          description: "Excess salt can actually weaken bones",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you eat before sports or exercise?",
      options: [
        {
          id: "a",
          text: "Heavy meal with lots of fats",
          emoji: "🍖",
          description: "Heavy meals slow you down during exercise",
          isCorrect: false
        },
        {
          id: "b",
          text: "Light snack with carbs and protein",
          emoji: "🍌",
          description: "Provides energy without weighing you down",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing at all",
          emoji: "🚫",
          description: "No fuel means poor performance and fatigue",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which food group provides the most energy for daily activities?",
      options: [
        {
          id: "a",
          text: "Carbohydrates",
          emoji: "🍚",
          description: "Carbs are the body's primary energy source",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fats",
          emoji: "🧀",
          description: "Fats are important but not the primary energy source",
          isCorrect: false
        },
        {
          id: "c",
          text: "Vitamins",
          emoji: "💊",
          description: "Vitamins support functions but don't provide energy",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why are proteins important for teen girls?",
      options: [
        {
          id: "a",
          text: "Only for building muscles",
          emoji: "💪",
          description: "Proteins do more than just build muscles",
          isCorrect: false
        },
        {
          id: "b",
          text: "For growth, repair, and hormone production",
          emoji: "🧬",
          description: "Proteins support growth, tissue repair, and hormones during puberty",
          isCorrect: true
        },
        {
          id: "c",
          text: "To gain weight quickly",
          emoji: "⚖️",
          description: "Proteins support healthy growth, not just weight gain",
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
    navigate("/student/health-female/teens/reflex-food-check");
  };

  return (
    <GameShell
      title="Quiz on Nutrition"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-12"
      gameType="health-female"
      totalLevels={20}
      currentLevel={12}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nutrition Knowledge Quiz</h3>
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

export default QuizOnNutrition;