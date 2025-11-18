import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DisciplineStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You skip all chores and homework. Should you change this?",
      options: [
        {
          id: "a",
          text: "No, it's too much work",
          emoji: "😩",
          description: "Chores build responsibility and life skills",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, chores build responsibility",
          emoji: "💪",
          description: "Discipline and responsibility lead to personal growth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Maybe later",
          emoji: "⏰",
          description: "Building good habits now prevents problems later",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How does completing chores help teens?",
      options: [
        {
          id: "c",
          text: "Teaches time management",
          emoji: "⏱️",
          description: "Managing chores improves organization skills",
          isCorrect: true
        },
        {
          id: "a",
          text: "Wastes time",
          emoji: "⏳",
          description: "Chores teach valuable life skills",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only makes parents happy",
          emoji: "😊",
          description: "Chores benefit personal development too",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What happens when teens avoid all responsibilities?",
      options: [
        {
          id: "a",
          text: "More freedom",
          emoji: "🆓",
          description: "Avoiding responsibilities creates more problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Builds character and skills",
          emoji: "⭐",
          description: "Facing responsibilities develops maturity",
          isCorrect: true
        },
        {
          id: "c",
          text: "No consequences",
          emoji: "🤷",
          description: "Responsibilities prepare for adult life",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should parents encourage teen discipline?",
      options: [
        {
          id: "b",
          text: "Set clear expectations",
          emoji: "📋",
          description: "Clear guidelines help teens understand responsibilities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Do everything for them",
          emoji: "🧹",
          description: "Teens need to learn independence",
          isCorrect: false
        },
        {
          id: "a",
          text: "Give no chores",
          emoji: "✅",
          description: "Age-appropriate responsibilities are important",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the benefit of self-discipline for teens?",
      options: [
        {
          id: "a",
          text: "Greater independence",
          emoji: "🦅",
          description: "Discipline leads to freedom and self-reliance",
          isCorrect: true
        },
        {
          id: "c",
          text: "More restrictions",
          emoji: "🔒",
          description: "Self-discipline actually increases personal freedom",
          isCorrect: false
        },
        {
          id: "b",
          text: "Less work",
          emoji: "😌",
          description: "Discipline requires effort but brings rewards",
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
    navigate("/student/health-male/teens/discipline-equals-freedom-debate");
  };

  return (
    <GameShell
      title="Discipline Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-95"
      gameType="health-male"
      totalLevels={100}
      currentLevel={95}
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

export default DisciplineStory;
