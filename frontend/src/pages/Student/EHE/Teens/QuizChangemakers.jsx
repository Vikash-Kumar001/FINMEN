import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizChangemakers = () => {
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
      text: "Which is a social entrepreneur's primary goal?",
      options: [
        {
          id: "a",
          text: "Profit only",
          emoji: "💰",
          description: "Traditional businesses focus on profit, but social entrepreneurs have a broader mission",
          isCorrect: false
        },
        {
          id: "b",
          text: "Social impact + profit",
          emoji: "🌍",
          description: "Exactly! Social entrepreneurs balance financial sustainability with social impact",
          isCorrect: true
        },
        {
          id: "c",
          text: "Fame and recognition",
          emoji: "🌟",
          description: "While recognition helps, it's not the primary goal of social entrepreneurship",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What makes social entrepreneurs different from traditional business owners?",
      options: [
        {
          id: "a",
          text: "Focus on solving social problems",
          emoji: "🌱",
          description: "Perfect! Social entrepreneurs prioritize addressing societal challenges",
          isCorrect: true
        },
        {
          id: "b",
          text: "They don't make any money",
          emoji: "❌",
          description: "Social entrepreneurs need financial sustainability to continue their work",
          isCorrect: false
        },
        {
          id: "c",
          text: "They only work for free",
          emoji: "🆓",
          description: "Social entrepreneurs run businesses that generate revenue",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which is a key characteristic of successful social entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Innovation in solving social problems",
          emoji: "💡",
          description: "Exactly! They find creative, sustainable solutions to societal challenges",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignoring community feedback",
          emoji: "🔇",
          description: "Successful social entrepreneurs deeply engage with the communities they serve",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying existing solutions",
          emoji: "📋",
          description: "While learning from others helps, innovation is key to addressing unique challenges",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do social entrepreneurs measure success?",
      options: [
        {
          id: "a",
          text: "Social impact metrics + financial sustainability",
          emoji: "📊",
          description: "Perfect! They track both social outcomes and business performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only stock prices",
          emoji: "📈",
          description: "Social entrepreneurs focus on broader measures of success beyond financial metrics",
          isCorrect: false
        },
        {
          id: "c",
          text: "Number of employees only",
          emoji: "👥",
          description: "While employment matters, it's not the sole measure of success",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a common challenge for social entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Balancing social mission with financial needs",
          emoji: "⚖️",
          description: "Exactly! Maintaining their social mission while ensuring financial sustainability is key",
          isCorrect: true
        },
        {
          id: "b",
          text: "Having too much funding",
          emoji: "💸",
          description: "Too much funding isn't typically a challenge for social entrepreneurs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Lack of any social problems to solve",
          emoji: "❓",
          description: "Unfortunately, there's no shortage of social challenges to address",
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
    navigate("/student/ehe/teens/reflex-teen-changemaker");
  };

  return (
    <GameShell
      title="Quiz on Changemakers"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-82"
      gameType="ehe"
      totalLevels={90}
      currentLevel={82}
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
            <div className="text-5xl mb-4">🦸</div>
            <h3 className="text-2xl font-bold text-white mb-2">Changemakers Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizChangemakers;