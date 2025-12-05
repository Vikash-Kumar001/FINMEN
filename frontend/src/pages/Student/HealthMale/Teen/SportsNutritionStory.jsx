import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SportsNutritionStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-15";
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
      text: "You have a big game tomorrow. What should you eat for dinner?",
      options: [
        {
          id: "b",
          text: "Pizza and soda",
          emoji: "🍕",
          description: "Too heavy and greasy.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Pasta and chicken",
          emoji: "🍝",
          description: "Carbs for energy, protein for muscles.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing",
          emoji: "🍽️",
          description: "You need fuel!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "It's game day morning. Breakfast time!",
      options: [
        {
          id: "c",
          text: "Spicy curry",
          emoji: "🌶️",
          description: "Might upset your stomach.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Oatmeal and fruit",
          emoji: "🥣",
          description: "Light and energetic.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Donuts",
          emoji: "🍩",
          description: "Sugar crash risk.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During the game break, you are thirsty.",
      options: [
        {
          id: "b",
          text: "Cola",
          emoji: "🥤",
          description: "Carbonation is bad during sports.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Milkshake",
          emoji: "🥛",
          description: "Too heavy to digest.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Water or Sports Drink",
          emoji: "💧",
          description: "Rehydrate electrolytes.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Game over! You won. Recovery meal?",
      options: [
        {
          id: "c",
          text: "Skip meal",
          emoji: "🚫",
          description: "Muscles need repair food.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Protein shake or meal",
          emoji: "🥩",
          description: "Helps muscle recovery.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cake",
          emoji: "🍰",
          description: "Celebration is okay, but eat real food first.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is hydration important?",
      options: [
        {
          id: "b",
          text: "To look cool",
          emoji: "😎",
          description: "Not the reason.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To gain weight",
          emoji: "⚖️",
          description: "Water has no calories.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Prevents cramps and fatigue",
          emoji: "⚡",
          description: "Keeps your body functioning.",
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
    navigate("/student/health-male/teens/junk-food-debate");
  };

  return (
    <GameShell
      title="Sports Nutrition Story"
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

export default SportsNutritionStory;
