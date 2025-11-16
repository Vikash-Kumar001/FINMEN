import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizHygiene = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which helps reduce acne?",
      options: [
        {
          id: "a",
          text: "Squeezing pimples",
          emoji: "💥",
          description: "Squeezing can cause scarring and spread infection",
          isCorrect: false
        },
        {
          id: "b",
          text: "Gentle wash",
          emoji: "🧼",
          description: "Gentle washing helps clean pores and reduce acne",
          isCorrect: true
        },
        {
          id: "c",
          text: "Strong soaps",
          emoji: "🔥",
          description: "Strong soaps can irritate skin and worsen acne",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Best way to handle body odor?",
      options: [
        {
          id: "a",
          text: "Daily deodorant and shower",
          emoji: "🚿",
          description: "Regular hygiene prevents body odor effectively",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it",
          emoji: "🤷",
          description: "Proper hygiene is important for health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only use perfume",
          emoji: "🌸",
          description: "Perfume masks but doesn't solve the cause",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How often should you change clothes?",
      options: [
        {
          id: "a",
          text: "Daily and after exercise",
          emoji: "👕",
          description: "Fresh clothes maintain good hygiene",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only when dirty",
          emoji: "👀",
          description: "Daily changes prevent bacteria buildup",
          isCorrect: false
        },
        {
          id: "c",
          text: "Once a week",
          emoji: "📅",
          description: "More frequent changes are needed",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is important for face care?",
      options: [
        {
          id: "a",
          text: "Using harsh scrubs",
          emoji: "🧽",
          description: "Gentle products are better for skin",
          isCorrect: false
        },
        {
          id: "b",
          text: "Never using moisturizer",
          emoji: "💧",
          description: "Moisturizing is important for all skin types",
          isCorrect: false
        },
        {
          id: "c",
          text: "Washing twice daily",
          emoji: "🧖",
          description: "Regular washing prevents clogged pores",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How to prevent athlete's foot?",
      options: [
        {
          id: "a",
          text: "Wear same socks multiple days",
          emoji: "🧦",
          description: "Clean, dry socks prevent fungal growth",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wear tight shoes",
          emoji: "👞",
          description: "Tight shoes can cause moisture buildup",
          isCorrect: false
        },
        {
          id: "c",
          text: "Keep feet dry and clean",
          emoji: "🦶",
          description: "Dryness prevents fungal infections",
          isCorrect: true
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
    navigate("/student/health-male/teens/reflex-smart-hygiene-43");
  };

  return (
    <GameShell
      title="Quiz on Hygiene"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-42"
      gameType="health-male"
      totalLevels={70}
      currentLevel={42}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
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

export default QuizHygiene;
