import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizNutritionTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which nutrient helps muscles grow stronger?",
      options: [
        {
          id: "a",
          text: "Sugar",
          emoji: "🍬",
          description: "Sugar gives quick energy but doesn't build muscles",
          isCorrect: false
        },
        {
          id: "b",
          text: "Salt",
          emoji: "🧂",
          description: "Salt adds flavor but doesn't help muscle growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Protein",
          emoji: "🥚",
          description: "Protein builds and repairs muscles",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What gives you energy for sports and games?",
      options: [
        {
          id: "a",
          text: "Carbohydrates",
          emoji: "🍞",
          description: "Carbs provide fuel for physical activities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fats only",
          emoji: "🧈",
          description: "Fats are needed but carbs give quick energy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Water only",
          emoji: "💧",
          description: "Water hydrates but doesn't provide energy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which vitamin helps your eyes and immune system?",
      options: [
        {
          id: "a",
          text: "Vitamin A",
          emoji: "🥕",
          description: "Vitamin A supports vision and immunity",
          isCorrect: true
        },
        {
          id: "b",
          text: "Vitamin K",
          emoji: "🥬",
          description: "Vitamin K helps blood clotting",
          isCorrect: false
        },
        {
          id: "c",
          text: "Vitamin E",
          emoji: "🥜",
          description: "Vitamin E protects cells but not specifically eyes",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What mineral makes your bones strong?",
      options: [
        {
          id: "a",
          text: "Iron",
          emoji: "🩸",
          description: "Iron is important for blood, not bones",
          isCorrect: false
        },
        {
          id: "b",
          text: "Calcium",
          emoji: "🥛",
          description: "Calcium is essential for strong bones and teeth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sodium",
          emoji: "🧂",
          description: "Sodium affects blood pressure, not bone strength",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is breakfast important?",
      options: [
        {
          id: "a",
          text: "It's not important",
          emoji: "❌",
          description: "Breakfast provides energy for the day",
          isCorrect: false
        },
        {
          id: "b",
          text: "It boosts energy and focus",
          emoji: "⚡",
          description: "Breakfast improves concentration and energy levels",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's just a social meal",
          emoji: "👥",
          description: "Breakfast has real health benefits",
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
    navigate("/student/health-male/teens/reflex-diet-check");
  };

  return (
    <GameShell
      title="Quiz on Nutrition"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 3}
      gameId="health-male-teen-12"
      gameType="health-male"
      totalLevels={100}
      currentLevel={12}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 12/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 3}</span>
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

export default QuizNutritionTeen;
