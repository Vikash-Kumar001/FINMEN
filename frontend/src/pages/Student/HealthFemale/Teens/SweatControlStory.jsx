import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SweatControlStory = () => {
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
      text: "After playing sports, should you shower immediately?",
      options: [
        {
          id: "a",
          text: "Yes, showering helps remove sweat and bacteria",
          emoji: "🚿",
          description: "Showering after sports prevents body odor and skin infections",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, wait until later to shower",
          emoji: "⏰",
          description: "Delaying a shower allows bacteria to multiply on your skin",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if you're visibly sweaty",
          emoji: "👀",
          description: "Bacteria can grow even when you don't feel sweaty",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to dry off after showering?",
      options: [
        {
          id: "a",
          text: "Use a clean, dry towel",
          emoji: "🧻",
          description: "A clean towel prevents transferring bacteria to your skin",
          isCorrect: true
        },
        {
          id: "b",
          text: "Air dry without towel",
          emoji: "💨",
          description: "Air drying can leave you feeling cold and uncomfortable",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use the same towel multiple days",
          emoji: "🔄",
          description: "Reusing towels can transfer bacteria and cause odors",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How often should you wash your sports clothes?",
      options: [
        {
          id: "a",
          text: "After every use",
          emoji: "👕",
          description: "Washing after each use prevents bacteria buildup",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once a week regardless of use",
          emoji: "📅",
          description: "Wearing unwashed clothes can cause odors and skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when they smell bad",
          emoji: "👃",
          description: "Bacteria can grow even before you notice odors",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What type of clothing is best for sports?",
      options: [
        {
          id: "a",
          text: "Moisture-wicking fabrics",
          emoji: "👕",
          description: "These fabrics pull sweat away from skin, keeping you dry",
          isCorrect: true
        },
        {
          id: "b",
          text: "Heavy cotton materials",
          emoji: "🧵",
          description: "Cotton absorbs sweat but stays wet, causing discomfort",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tight synthetic materials",
          emoji: "🦺",
          description: "Tight clothing can restrict movement and cause chafing",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you manage sweat during long sports sessions?",
      options: [
        {
          id: "a",
          text: "Take breaks and stay hydrated",
          emoji: "💧",
          description: "Hydration helps regulate body temperature and reduces excessive sweating",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid drinking water to reduce sweating",
          emoji: "❌",
          description: "Dehydration can make you feel worse and affect performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Apply more deodorant during activity",
          emoji: "🧴",
          description: "This doesn't effectively control sweat during activity",
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
    navigate("/student/health-female/teens/quiz-teen-hygiene");
  };

  return (
    <GameShell
      title="Sweat Control Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-41"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
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

export default SweatControlStory;