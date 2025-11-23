import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHygiene = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which practice best prevents body odor?",
      options: [
        {
          id: "a",
          text: "Bathing daily with soap",
          emoji: "🧼",
          description: "Correct! Regular bathing with soap removes bacteria that cause body odor.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wearing the same clothes multiple days",
          emoji: "👕",
          description: "Wearing the same clothes multiple days can trap bacteria and sweat, leading to body odor.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Using perfume to cover smells",
          emoji: "🌸",
          description: "Perfume only masks odors temporarily. Proper hygiene is needed to prevent them.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should you wash your hair?",
      options: [
        {
          id: "a",
          text: "2-3 times per week for most hair types",
          emoji: "💇‍♀️",
          description: "Exactly! Washing 2-3 times per week keeps hair clean without stripping natural oils.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Every day",
          emoji: "🚿",
          description: "Daily washing can strip hair of natural oils, making it dry and brittle.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Once a month",
          emoji: "📅",
          description: "Once a month is not frequent enough and can lead to buildup of oils and dirt.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to keep your teeth healthy?",
      options: [
        {
          id: "a",
          text: "Brush twice daily and floss regularly",
          emoji: "🦷",
          description: "Perfect! Brushing twice daily and flossing removes plaque and prevents cavities.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Brush only when teeth feel dirty",
          emoji: "😬",
          description: "Waiting until teeth feel dirty means plaque has already built up, increasing cavity risk.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use mouthwash but skip brushing",
          emoji: "🪥",
          description: "Mouthwash complements brushing but cannot remove plaque like brushing and flossing can.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to trim your nails regularly?",
      options: [
        {
          id: "a",
          text: "Prevents dirt buildup and reduces infection risk",
          emoji: "💅",
          description: "Correct! Short, clean nails prevent dirt accumulation and reduce infection risk.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes fingers look longer",
          emoji: "📏",
          description: "While well-groomed nails look nice, the primary health benefit is preventing dirt buildup.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for appearance, not health",
          emoji: "✨",
          description: "Nail trimming is primarily for health reasons - preventing dirt buildup and infection risk.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best practice for foot hygiene?",
      options: [
        {
          id: "a",
          text: "Wash feet daily and keep them dry",
          emoji: "🦶",
          description: "Great choice! Daily washing and keeping feet dry prevents odor and fungal infections.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wear the same socks multiple days",
          emoji: "🧦",
          description: "Wearing the same socks multiple days traps moisture and bacteria, causing odor and infections.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only wash feet when they look dirty",
          emoji: "👀",
          description: "Feet can harbor bacteria even when they don't look dirty. Regular washing is important.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Hygiene"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-42"
      gameType="health-female"
      totalLevels={50}
      currentLevel={42}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default QuizOnHygiene;