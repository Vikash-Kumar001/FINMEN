import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPuberty = () => {
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
      text: "Which is a puberty sign in girls?",
      options: [
        {
          id: "a",
          text: "Breast development",
          emoji: "🤱",
          description: "One of the first signs of puberty in girls",
          isCorrect: true
        },
        {
          id: "b",
          text: "Menstruation",
          emoji: "🩸",
          description: "A later sign of puberty in girls",
          isCorrect: true
        },
        {
          id: "c",
          text: "Both A and B",
          emoji: "✅",
          description: "Both are signs of puberty in girls",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "At what age does puberty typically begin for girls?",
      options: [
        {
          id: "a",
          text: "8-13 years",
          emoji: "📅",
          description: "Most girls begin puberty between 8-13 years old",
          isCorrect: true
        },
        {
          id: "b",
          text: "14-16 years",
          emoji: "⏰",
          description: "This is later than typical puberty onset",
          isCorrect: false
        },
        {
          id: "c",
          text: "5-7 years",
          emoji: "👶",
          description: "This is too early for typical puberty onset",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What hormone triggers puberty in girls?",
      options: [
        {
          id: "a",
          text: "Estrogen",
          emoji: "💊",
          description: "Estrogen is the primary hormone that triggers female puberty",
          isCorrect: true
        },
        {
          id: "b",
          text: "Testosterone",
          emoji: "🧪",
          description: "Testosterone is primarily a male hormone",
          isCorrect: false
        },
        {
          id: "c",
          text: "Insulin",
          emoji: "💉",
          description: "Insulin regulates blood sugar, not puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which physical change happens last during female puberty?",
      options: [
        {
          id: "a",
          text: "Breast development",
          emoji: "🤱",
          description: "Usually one of the first changes",
          isCorrect: false
        },
        {
          id: "b",
          text: "Menstruation",
          emoji: "🩸",
          description: "Usually one of the last major changes",
          isCorrect: true
        },
        {
          id: "c",
          text: "Height growth spurt",
          emoji: "📏",
          description: "Usually happens in the middle of puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How long does female puberty typically last?",
      options: [
        {
          id: "a",
          text: "2-3 years",
          emoji: "⏱️",
          description: "Too short for complete puberty",
          isCorrect: false
        },
        {
          id: "b",
          text: "4-5 years",
          emoji: "📅",
          description: "Most girls complete puberty in 4-5 years",
          isCorrect: true
        },
        {
          id: "c",
          text: "6-8 years",
          emoji: "⏳",
          description: "This is longer than typical puberty duration",
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
    navigate("/student/health-female/teens/reflex-puberty-basics");
  };

  return (
    <GameShell
      title="Quiz on Puberty"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-22"
      gameType="health-female"
      totalLevels={30}
      currentLevel={22}
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
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Puberty Knowledge Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizOnPuberty;