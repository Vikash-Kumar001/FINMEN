import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPreventiveHealth = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is an example of preventive health care?",
      options: [
        {
          id: "a",
          text: "Vaccines to prevent diseases",
          emoji: "💉",
          description: "Vaccination prevents infectious diseases",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignoring illness symptoms",
          emoji: "🙈",
          description: "This delays treatment and worsens conditions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Taking medicine only when sick",
          emoji: "💊",
          description: "This is treatment, not prevention",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the main goal of preventive health care?",
      options: [
        {
          id: "a",
          text: "To cure existing diseases",
          emoji: "🔧",
          description: "This is treatment, not prevention",
          isCorrect: false
        },
        {
          id: "b",
          text: "To prevent health problems before they start",
          emoji: "🛡️",
          description: "Prevention focuses on maintaining health",
          isCorrect: true
        },
        {
          id: "c",
          text: "To save money on medical bills",
          emoji: "💰",
          description: "While cost-effective, this isn't the primary goal",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which habit supports preventive health?",
      options: [
        {
          id: "a",
          text: "Regular exercise and balanced nutrition",
          emoji: "🥗",
          description: "Healthy lifestyle prevents chronic diseases",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skipping meals to lose weight",
          emoji: "🍽️",
          description: "This harms health and metabolism",
          isCorrect: false
        },
        {
          id: "c",
          text: "Staying up late regularly",
          emoji: "🌙",
          description: "Poor sleep weakens the immune system",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why are regular health screenings important?",
      options: [
        {
          id: "a",
          text: "To detect problems early when treatable",
          emoji: "🔍",
          description: "Early detection improves treatment outcomes",
          isCorrect: true
        },
        {
          id: "b",
          text: "To avoid seeing a doctor",
          emoji: "🏃",
          description: "Screenings require medical visits",
          isCorrect: false
        },
        {
          id: "c",
          text: "To prove you're healthy to others",
          emoji: "🧐",
          description: "Screenings are for personal health management",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a key benefit of preventive health care?",
      options: [
        {
          id: "a",
          text: "Reduced risk of chronic diseases",
          emoji: "📉",
          description: "Prevention significantly lowers disease risk",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eliminates all health risks",
          emoji: "✨",
          description: "Prevention reduces but doesn't eliminate risks",
          isCorrect: false
        },
        {
          id: "c",
          text: "Replaces need for doctors",
          emoji: "🚪",
          description: "Prevention works alongside medical care",
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
    navigate("/student/health-female/teens/reflex-preventive-care");
  };

  return (
    <GameShell
      title="Quiz on Preventive Health"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-72"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
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

export default QuizOnPreventiveHealth;