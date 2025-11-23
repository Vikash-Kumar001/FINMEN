import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OilySkinStory = () => {
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
      text: "Should you wash your face more often if it's oily?",
      options: [
        {
          id: "a",
          text: "Wash twice daily with gentle cleanser",
          emoji: "🧴",
          description: "Regular gentle washing helps control oil without irritation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wash every hour to stay clean",
          emoji: "⏱️",
          description: "Over-washing can strip natural oils and increase oil production",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid washing to prevent dryness",
          emoji: "❌",
          description: "Not washing allows oil and dirt to build up, causing more breakouts",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should you wash your face during puberty?",
      options: [
        {
          id: "a",
          text: "Every hour to keep clean",
          emoji: "⏱️",
          description: "Over-washing can strip natural oils and increase oil production",
          isCorrect: false
        },
        {
          id: "b",
          text: "Twice daily - morning and night",
          emoji: "⏰",
          description: "Twice daily washing helps control oil without over-drying",
          isCorrect: true
        },
        {
          id: "c",
          text: "Once a day is enough",
          emoji: "📅",
          description: "Once daily may not be sufficient to control oil during puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What type of products should you use for oily skin?",
      options: [
        {
          id: "a",
          text: "Heavy creams and oils",
          emoji: "🧴",
          description: "Heavy products can clog pores and increase oiliness",
          isCorrect: false
        },
        {
          id: "b",
          text: "Oil-free, non-comedogenic products",
          emoji: "💧",
          description: "These products won't clog pores and are designed for oily skin",
          isCorrect: true
        },
        {
          id: "c",
          text: "Any product available",
          emoji: "🛍️",
          description: "Not all products are suitable for oily skin types",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should you handle acne during puberty?",
      options: [
        {
          id: "a",
          text: "Squeeze pimples to remove them",
          emoji: "💥",
          description: "Squeezing can cause scarring and spread bacteria",
          isCorrect: false
        },
        {
          id: "b",
          text: "Gentle cleansing and spot treatment",
          emoji: "🔬",
          description: "Proper treatment helps manage acne without irritating skin",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore acne completely",
          emoji: "🙈",
          description: "Untreated acne can worsen and cause scarring",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a good moisturizing approach for oily skin?",
      options: [
        {
          id: "a",
          text: "No moisturizer needed",
          emoji: "❌",
          description: "Skipping moisturizer can cause skin to produce more oil",
          isCorrect: false
        },
        {
          id: "b",
          text: "Heavy, rich creams",
          emoji: "🧴",
          description: "Heavy creams can clog pores and increase oiliness",
          isCorrect: false
        },
        {
          id: "c",
          text: "Light, oil-free moisturizer",
          emoji: "✨",
          description: "Even oily skin needs hydration, but with lightweight products",
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
    navigate("/student/health-female/teens/hygiene-confidence-debate");
  };

  return (
    <GameShell
      title="Oily Skin Story"
      subtitle={`Level 5 of 10`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-5"
      gameType="health-female"
      totalLevels={10}
      currentLevel={5}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 5/10</span>
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

export default OilySkinStory;