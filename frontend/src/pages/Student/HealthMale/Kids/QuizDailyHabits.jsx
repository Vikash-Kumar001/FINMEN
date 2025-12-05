import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizDailyHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-92";
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
      text: "How much sleep do kids need?",
      options: [
        {
          id: "b",
          text: "2 hours",
          emoji: "⚡",
          description: "That's not nearly enough!",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "24 hours",
          emoji: "🐻",
          description: "You're not a hibernating bear!",
          isCorrect: false
        },
        {
          id: "a",
          text: "9-11 hours",
          emoji: "😴",
          description: "Your body grows when you sleep.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Why is exercise good?",
      options: [
        {
          id: "c",
          text: "It makes you tired",
          emoji: "😫",
          description: "It actually gives you more energy!",
          isCorrect: false
        },
        {
          id: "a",
          text: "It makes muscles strong",
          emoji: "💪",
          description: "Exercise keeps your heart and body healthy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's boring",
          emoji: "🥱",
          description: "Exercise can be fun games and sports!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When should you wash your hands?",
      options: [
        {
          id: "a",
          text: "Before eating and after bathroom",
          emoji: "🧼",
          description: "This stops germs from making you sick.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only on Sundays",
          emoji: "📅",
          description: "Germs are there every day.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Never",
          emoji: "🦠",
          description: "Yuck! You need to wash germs away.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a healthy snack?",
      options: [
        {
          id: "c",
          text: "Potato chips",
          emoji: "🥔",
          description: "Chips have too much salt and fat.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Carrots and hummus",
          emoji: "🥕",
          description: "Veggies give you vitamins!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cookies",
          emoji: "🍪",
          description: "Cookies are a treat, not a snack.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why do we drink water?",
      options: [
        {
          id: "b",
          text: "To float",
          emoji: "🏊",
          description: "We drink it to stay hydrated.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To change color",
          emoji: "🌈",
          description: "Water doesn't change your color.",
          isCorrect: false
        },
        {
          id: "a",
          text: "To keep our body working",
          emoji: "💧",
          description: "Every part of your body needs water.",
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
    navigate("/student/health-male/kids/reflex-habit-check");
  };

  return (
    <GameShell
      title="Quiz on Daily Habits"
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

export default QuizDailyHabits;
