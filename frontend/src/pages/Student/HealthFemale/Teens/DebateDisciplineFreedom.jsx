import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateDisciplineFreedom = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does discipline give freedom or restrict it?",
      options: [
        {
          id: "a",
          text: "Gives freedom by creating structure and choices",
          emoji: "🔓",
          description: "Self-discipline enables meaningful decisions and opportunities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Restricts freedom by imposing limitations",
          emoji: "🔒",
          description: "This view misses the long-term benefits of discipline",
          isCorrect: false
        },
        {
          id: "c",
          text: "Has no effect on personal freedom",
          emoji: "😐",
          description: "Discipline directly impacts the quality of our choices",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How does financial discipline lead to freedom?",
      options: [
        {
          id: "a",
          text: "Enables future choices through savings and planning",
          emoji: "💰",
          description: "Financial discipline creates options and security",
          isCorrect: true
        },
        {
          id: "b",
          text: "Prevents enjoyment of current opportunities",
          emoji: "😢",
          description: "Responsible spending still allows for enjoyment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eliminates the need to work or earn money",
          emoji: "🛌",
          description: "Discipline typically increases earning potential",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the relationship between discipline and time management?",
      options: [
        {
          id: "a",
          text: "Discipline creates more free time through efficiency",
          emoji: "⏰",
          description: "Effective time use increases available choices",
          isCorrect: true
        },
        {
          id: "b",
          text: "Discipline makes schedules too rigid and stressful",
          emoji: "😰",
          description: "Flexible discipline actually reduces stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Discipline eliminates spontaneous opportunities",
          emoji: "🚫",
          description: "Good planning creates space for spontaneity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does health discipline contribute to personal freedom?",
      options: [
        {
          id: "a",
          text: "Provides energy and longevity for pursuing goals",
          emoji: "🏃",
          description: "Good health expands life possibilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Limits enjoyable experiences and social activities",
          emoji: "🍷",
          description: "Healthy habits can enhance social experiences",
          isCorrect: false
        },
        {
          id: "c",
          text: "Requires too much time and effort to be worthwhile",
          emoji: "⏳",
          description: "Investment in health pays dividends in energy and time",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is self-discipline considered a form of self-respect?",
      options: [
        {
          id: "a",
          text: "Shows commitment to personal growth and values",
          emoji: "🌟",
          description: "Self-discipline reflects self-worth and priorities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Demonstrates superiority over others",
          emoji: "👑",
          description: "Self-discipline is about personal development, not comparison",
          isCorrect: false
        },
        {
          id: "c",
          text: "Proves ability to follow external rules",
          emoji: "📋",
          description: "True discipline comes from internal motivation",
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
    navigate("/student/health-female/teens/journal-teen-habits");
  };

  return (
    <GameShell
      title="Debate: Discipline = Freedom?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-96"
      gameType="health-female"
      totalLevels={10}
      currentLevel={6}
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

export default DebateDisciplineFreedom;