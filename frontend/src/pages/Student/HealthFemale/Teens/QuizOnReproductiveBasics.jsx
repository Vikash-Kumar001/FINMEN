import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnReproductiveBasics = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which organ in the female body releases eggs?",
      options: [
        {
          id: "a",
          text: "Ovaries",
          emoji: "🥚",
          description: "Correct! The ovaries are responsible for releasing eggs during ovulation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stomach",
          emoji: "🍽️",
          description: "Not quite. The stomach helps with digestion, not reproduction.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Heart",
          emoji: "❤️",
          description: "This is incorrect. The heart pumps blood throughout the body.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the name of the monthly process where the uterus sheds its lining?",
      options: [
        {
          id: "a",
          text: "Menstruation",
          emoji: "🩸",
          description: "Correct! Menstruation is the monthly shedding of the uterine lining.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Digestion",
          emoji: "🍽️",
          description: "This is incorrect. Digestion is the process of breaking down food.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Respiration",
          emoji: "💨",
          description: "Not quite. Respiration is the process of breathing.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which hormone is primarily responsible for female reproductive development?",
      options: [
        {
          id: "a",
          text: "Estrogen",
          emoji: "♀️",
          description: "Correct! Estrogen is the primary female sex hormone responsible for reproductive development.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Testosterone",
          emoji: "♂️",
          description: "This is the primary male sex hormone, not female.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Insulin",
          emoji: "💉",
          description: "This hormone regulates blood sugar levels, not reproductive development.",
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
    navigate("/student/health-female/teens/reflex-teen-awareness");
  };

  return (
    <GameShell
      title="Quiz on Reproductive Basics"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-32"
      gameType="health-female"
      totalLevels={40}
      currentLevel={32}
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
            <h2 className="text-2xl font-bold text-white mb-4">
              {getCurrentQuestion().text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.question === currentQuestion) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.question === currentQuestion)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.question === currentQuestion)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnReproductiveBasics;