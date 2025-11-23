import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSelfEsteem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which approach builds confidence effectively?",
      options: [
        {
          id: "a",
          text: "Positive self-talk and self-acceptance",
          emoji: "😊",
          description: "Encouraging yourself promotes healthy self-esteem",
          isCorrect: true
        },
        {
          id: "b",
          text: "Negative comparisons with others",
          emoji: "😞",
          description: "Comparing yourself negatively damages self-worth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding challenges to prevent failure",
          emoji: "🏃",
          description: "Avoidance prevents growth and genuine confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the benefit of setting realistic goals?",
      options: [
        {
          id: "a",
          text: "They are easier to abandon",
          emoji: "🗑️",
          description: "Abandoning goals reduces self-confidence",
          isCorrect: false
        },
        {
          id: "b",
          text: "Achieving them builds genuine confidence",
          emoji: "🎯",
          description: "Success in realistic goals reinforces self-belief",
          isCorrect: true
        },
        {
          id: "c",
          text: "They prevent any progress",
          emoji: "🛑",
          description: "Realistic goals facilitate steady progress",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you handle mistakes?",
      options: [
        {
          id: "a",
          text: "View them as personal failures",
          emoji: "❌",
          description: "This mindset prevents growth and resilience",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learn from them as growth opportunities",
          emoji: "📈",
          description: "Mistakes are valuable learning experiences",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them completely",
          emoji: "🙈",
          description: "Ignoring mistakes prevents learning",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role do supportive relationships play in self-esteem?",
      options: [
        {
          id: "a",
          text: "They create dependency and weakness",
          emoji: "🧍",
          description: "Supportive relationships enhance independence",
          isCorrect: false
        },
        {
          id: "b",
          text: "They provide encouragement and validation",
          emoji: "🤗",
          description: "Healthy relationships boost confidence and well-being",
          isCorrect: true
        },
        {
          id: "c",
          text: "They are unnecessary for self-worth",
          emoji: "-alone",
          description: "Human connection is fundamental to mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is self-compassion important?",
      options: [
        {
          id: "a",
          text: "It makes you complacent and lazy",
          emoji: "😴",
          description: "Self-compassion encourages growth without harshness",
          isCorrect: false
        },
        {
          id: "b",
          text: "It prevents you from improving",
          emoji: "📉",
          description: "Self-compassion actually facilitates improvement",
          isCorrect: false
        },
        {
          id: "c",
          text: "It reduces self-criticism and promotes resilience",
          emoji: "🧘",
          description: "Treating yourself kindly improves mental health",
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
    navigate("/student/health-female/teens/reflex-confidence-check");
  };

  return (
    <GameShell
      title="Quiz on Self-Esteem"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-62"
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

export default QuizOnSelfEsteem;