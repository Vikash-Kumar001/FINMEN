import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnFoodGroups = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which of these is a good source of protein?",
      options: [
        {
          id: "a",
          text: "Dal (Lentils)",
          emoji: "🍛",
          description: "Correct! Dal is an excellent plant-based protein that helps build strong muscles.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips",
          emoji: "🍟",
          description: "Chips are not a good source of protein. They're mostly fat and salt.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ice cream",
          emoji: "🍦",
          description: "Ice cream has some protein from milk, but it's mostly sugar and fat.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which food group gives you energy for playing and studying?",
      options: [
        {
          id: "a",
          text: "Carbohydrates (Rice, Bread)",
          emoji: "🍚",
          description: "Exactly! Carbohydrates are your body's main source of energy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sweets",
          emoji: "🍰",
          description: "Sweets give quick energy but don't last long and aren't healthy.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Fried foods",
          emoji: "🍟",
          description: "Fried foods are heavy and don't give you the right kind of energy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which of these foods is rich in vitamins?",
      options: [
        {
          id: "a",
          text: "Apple",
          emoji: "🍎",
          description: "Right! Fruits like apples are packed with vitamins to keep you healthy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Candy",
          emoji: "🍬",
          description: "Candy doesn't have vitamins. It's mostly sugar.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Soda",
          emoji: "🥤",
          description: "Soda has no vitamins and can actually take vitamins away from your body.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which food group helps build strong bones?",
      options: [
        {
          id: "a",
          text: "Dairy (Milk, Cheese)",
          emoji: "🥛",
          description: "Perfect! Dairy products have calcium which makes bones strong.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips",
          emoji: "🥔",
          description: "Chips don't help build bones. They're just empty calories.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cookies",
          emoji: "🍪",
          description: "Cookies don't help bones. They're high in sugar and fat.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which of these is a healthy fat?",
      options: [
        {
          id: "a",
          text: "Nuts and Seeds",
          emoji: "🥜",
          description: "Excellent! Nuts and seeds have healthy fats that are good for your brain.",
          isCorrect: true
        },
        {
          id: "b",
          text: "French fries",
          emoji: "🍟",
          description: "French fries have unhealthy fats from deep frying.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ice cream",
          emoji: "🍦",
          description: "Ice cream has saturated fats which aren't as healthy.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Food Groups"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-12"
      gameType="health-female"
      totalLevels={15}
      currentLevel={12}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default QuizOnFoodGroups;