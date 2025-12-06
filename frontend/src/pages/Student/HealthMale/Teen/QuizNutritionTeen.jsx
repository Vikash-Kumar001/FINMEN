import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizNutritionTeen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-12";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which nutrient helps build muscles?",
      options: [
        {
          id: "b",
          text: "Sugar",
          emoji: "🍬",
          description: "Sugar gives quick energy, not muscle.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Protein",
          emoji: "🥩",
          description: "Protein is the building block of muscle.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Fat",
          emoji: "🥑",
          description: "Fat protects organs, doesn't build muscle.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What gives you long-lasting energy?",
      options: [
        {
          id: "c",
          text: "Candy",
          emoji: "🍭",
          description: "Short burst, then crash.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Complex Carbs (Oats, Rice)",
          emoji: "🌾",
          description: "Slow-release energy for the day.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Soda",
          emoji: "🥤",
          description: "Just sugar water.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is Calcium important?",
      options: [
        {
          id: "b",
          text: "For better eyesight",
          emoji: "👀",
          description: "That's Vitamin A.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Strong bones and teeth",
          emoji: "🦴",
          description: "Crucial for growing teens.",
          isCorrect: true
        },
        {
          id: "c",
          text: "To stop sweating",
          emoji: "💦",
          description: "Calcium doesn't affect sweat.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which food is a 'Junk Food'?",
      options: [
        {
          id: "c",
          text: "Banana",
          emoji: "🍌",
          description: "Nature's snack!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Grilled Fish",
          emoji: "🐟",
          description: "Healthy protein.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deep Fried Chips",
          emoji: "🍟",
          description: "High in bad fats and salt.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What happens if you skip meals?",
      options: [
        {
          id: "b",
          text: "You get stronger",
          emoji: "💪",
          description: "You need fuel to be strong.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing",
          emoji: "🤷",
          description: "Your body will react.",
          isCorrect: false
        },
        {
          id: "a",
          text: "You get tired and lose focus",
          emoji: "😫",
          description: "Your brain needs food to work.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

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
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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
