import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizTeenEntrepreneurs = () => {
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
      text: "Which quality do teen entrepreneurs typically show?",
      options: [
        {
          id: "a",
          text: "Risk-taking",
          emoji: "🎢",
          description: "Correct! Teen entrepreneurs often take calculated risks to pursue their ideas",
          isCorrect: true
        },
        {
          id: "b",
          text: "Doing nothing",
          emoji: "🛋️",
          description: "Entrepreneurs are action-oriented, not passive",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do successful teen entrepreneurs focus on?",
      options: [
        {
          id: "a",
          text: "Solving real problems",
          emoji: "🔧",
          description: "Exactly! Successful entrepreneurs identify and solve genuine problems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Making quick money",
          emoji: "💸",
          description: "While financial success is important, focusing on problem-solving leads to sustainable success",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How do teen entrepreneurs typically learn?",
      options: [
        {
          id: "a",
          text: "Through trial and error",
          emoji: "🧪",
          description: "Correct! Learning through experimentation is a key entrepreneurial trait",
          isCorrect: true
        },
        {
          id: "b",
          text: "By avoiding challenges",
          emoji: "😴",
          description: "Entrepreneurs embrace challenges as learning opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's important for teen entrepreneurs when starting out?",
      options: [
        {
          id: "a",
          text: "Starting small and learning",
          emoji: "🌱",
          description: "Perfect! Starting small allows for learning and iteration without major risk",
          isCorrect: true
        },
        {
          id: "b",
          text: "Going big immediately",
          emoji: "🚀",
          description: "While ambition is good, starting small reduces risk and builds experience",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What helps teen entrepreneurs succeed?",
      options: [
        {
          id: "a",
          text: "Persistence and adaptability",
          emoji: "💪",
          description: "Exactly! Persistence through challenges and adaptability to change are key success factors",
          isCorrect: true
        },
        {
          id: "b",
          text: "Giving up easily",
          emoji: "🏳️",
          description: "Entrepreneurship requires resilience and the ability to overcome setbacks",
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
    navigate("/student/ehe/teens/reflex-teen-entrepreneur");
  };

  return (
    <GameShell
      title="Quiz on Teen Entrepreneurs"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-42"
      gameType="ehe"
      totalLevels={50}
      currentLevel={42}
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
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Entrepreneur Quiz</h3>
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

export default QuizTeenEntrepreneurs;