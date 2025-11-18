import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GreenEnergyStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen sees solar panels on rooftops. What career works directly with this technology?",
      options: [
        {
          id: "a",
          text: "Renewable Energy Engineer",
          emoji: "☀️",
          description: "Perfect! Renewable energy engineers design and implement solar panel systems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fashion Designer",
          emoji: "👗",
          description: "Fashion designers focus on clothing rather than energy technology",
          isCorrect: false
        },
        {
          id: "c",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Chefs focus on food preparation rather than energy technology",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is renewable energy becoming increasingly important?",
      options: [
        {
          id: "a",
          text: "It's unlimited and environmentally friendly",
          emoji: "🌍",
          description: "Exactly! Renewable energy sources are sustainable and reduce environmental impact",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's the cheapest option in all cases",
          emoji: "💰",
          description: "While costs are decreasing, renewable energy isn't always the cheapest upfront",
          isCorrect: false
        },
        {
          id: "c",
          text: "It requires no technical knowledge",
          emoji: "❓",
          description: "Renewable energy actually requires significant technical expertise",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What skills are important for a career in renewable energy?",
      options: [
        {
          id: "a",
          text: "Engineering, problem-solving, and environmental science",
          emoji: "🔧",
          description: "Perfect! These skills are essential for designing and implementing renewable energy solutions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only artistic abilities",
          emoji: "🎨",
          description: "While creativity helps, technical and scientific skills are more crucial",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only physical strength",
          emoji: "💪",
          description: "Physical strength may help but technical knowledge is more important",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's a benefit of working in the renewable energy sector?",
      options: [
        {
          id: "a",
          text: "Contributing to a sustainable future",
          emoji: "🌱",
          description: "Exactly! Renewable energy careers directly contribute to environmental sustainability",
          isCorrect: true
        },
        {
          id: "b",
          text: "No job security",
          emoji: "❌",
          description: "The renewable energy sector is actually growing with strong job prospects",
          isCorrect: false
        },
        {
          id: "c",
          text: "Limited growth opportunities",
          emoji: "📉",
          description: "The sector is rapidly expanding with many growth opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can a teen prepare for a career in renewable energy?",
      options: [
        {
          id: "a",
          text: "Study science and math, and explore internships in the field",
          emoji: "📚",
          description: "Perfect! Strong foundations in STEM subjects and practical experience are key",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all technical subjects",
          emoji: "🚫",
          description: "Technical subjects are fundamental to renewable energy careers",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus only on entertainment",
          emoji: "🎮",
          description: "While balance is important, academic preparation is crucial for this field",
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
    navigate("/student/ehe/teens/quiz-emerging-careers");
  };

  return (
    <GameShell
      title="Green Energy Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-71"
      gameType="ehe"
      totalLevels={80}
      currentLevel={71}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">☀️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Renewable Energy Career</h3>
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

export default GreenEnergyStory;