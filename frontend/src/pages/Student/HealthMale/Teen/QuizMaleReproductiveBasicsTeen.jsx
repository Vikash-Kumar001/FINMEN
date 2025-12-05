import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizMaleReproductiveBasicsTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which organ produces sperm in males?",
      options: [
        {
          id: "a",
          text: "Lungs",
          emoji: "🫁",
          description: "Lungs help with breathing, not sperm production",
          isCorrect: false
        },
        {
          id: "b",
          text: "Testes",
          emoji: "🫐",
          description: "Testes are the male reproductive organs that produce sperm",
          isCorrect: true
        },
        {
          id: "c",
          text: "Heart",
          emoji: "❤️",
          description: "Heart pumps blood, but doesn't produce sperm",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the main function of the penis during reproduction?",
      options: [
        {
          id: "a",
          text: "Produce sperm",
          emoji: "🏭",
          description: "Sperm is produced in the testes, not the penis",
          isCorrect: false
        },
        {
          id: "b",
          text: "Store urine",
          emoji: "💧",
          description: "Penis has multiple functions including reproduction",
          isCorrect: false
        },
        {
          id: "c",
          text: "Transfer sperm",
          emoji: "🔄",
          description: "Penis transfers sperm to the female reproductive system",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What causes puberty changes in teen boys?",
      options: [
        {
          id: "a",
          text: "Hormones",
          emoji: "🧬",
          description: "Hormones like testosterone drive puberty changes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Exercise",
          emoji: "💪",
          description: "Exercise is healthy but hormones cause puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Diet changes",
          emoji: "🍎",
          description: "Hormones, not diet, primarily cause puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Where does sperm production happen?",
      options: [
        {
          id: "a",
          text: "Kidneys",
          emoji: "🫘",
          description: "Kidneys filter blood, not related to sperm production",
          isCorrect: false
        },
        {
          id: "b",
          text: "Testes",
          emoji: "🥜",
          description: "Sperm is produced in the testes",
          isCorrect: true
        },
        {
          id: "c",
          text: "Bladder",
          emoji: "🚽",
          description: "Bladder stores urine, not involved in sperm production",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is semen?",
      options: [
        {
          id: "a",
          text: "A type of cell",
          emoji: "🔍",
          description: "Semen is a fluid, not a cell",
          isCorrect: false
        },
        {
          id: "b",
          text: "Just sperm",
          emoji: "🔬",
          description: "Semen contains more than just sperm",
          isCorrect: false
        },
        {
          id: "c",
          text: "Fluid containing sperm",
          emoji: "💦",
          description: "Semen is the fluid that carries sperm",
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
    navigate("/student/health-male/teens/reflex-awareness-teen");
  };

  return (
    <GameShell
      title="Quiz on Male Reproductive Basics"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 3}
      gameId="health-male-teen-32"
      gameType="health-male"
      totalLevels={100}
      currentLevel={32}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 32/100</span>
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

export default QuizMaleReproductiveBasicsTeen;
