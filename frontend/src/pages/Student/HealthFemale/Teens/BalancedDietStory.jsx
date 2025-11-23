import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BalancedDietStory = () => {
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
      text: "You're feeling hungry after school. What should you choose?",
      options: [
        {
          id: "a",
          text: "Instant noodles with no vegetables",
          emoji: "🍜",
          description: "Lacks nutrients and fiber needed for growth",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balanced plate with dal, rice, and vegetables",
          emoji: "🍛",
          description: "Provides protein, carbs, and vitamins for energy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Chips and cola",
          emoji: "🍟",
          description: "High in unhealthy fats and sugar, low in nutrients",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend offers you a burger every day. What do you do?",
      options: [
        {
          id: "a",
          text: "Accept every day for convenience",
          emoji: "🍔",
          description: "Daily fast food lacks variety and essential nutrients",
          isCorrect: false
        },
        {
          id: "b",
          text: "Sometimes, but balance with home-cooked meals",
          emoji: "📅",
          description: "Occasional treats are okay with a balanced diet",
          isCorrect: true
        },
        {
          id: "c",
          text: "Always refuse to be healthy",
          emoji: "🚫",
          description: "Complete refusal may lead to social issues",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During exam week, you're stressed. How do you eat?",
      options: [
        {
          id: "a",
          text: "Skip meals to study more",
          emoji: "📚",
          description: "Skipping meals reduces concentration and energy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eat comfort food like ice cream constantly",
          emoji: "🍦",
          description: "Excess sugar causes energy crashes",
          isCorrect: false
        },
        {
          id: "c",
          text: "Regular nutritious meals with brain foods",
          emoji: "🧠",
          description: "Proper nutrition supports brain function and focus",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You're at a party with lots of food options. What's your approach?",
      options: [
        {
          id: "a",
          text: "Only eat sweets and snacks",
          emoji: "🍰",
          description: "Missing out on nutritious options",
          isCorrect: false
        },
        {
          id: "b",
          text: "Try a variety including fruits and salads",
          emoji: "🥗",
          description: "Balanced choices support health even at parties",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid all food to stay slim",
          emoji: "📉",
          description: "Depriving yourself isn't healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your family mostly eats traditional Indian food. How do you benefit?",
      options: [
        {
          id: "a",
          text: "Ignore traditional foods for Western options",
          emoji: "🍟",
          description: "Missing out on nutrient-rich traditional foods",
          isCorrect: false
        },
        {
          id: "b",
          text: "Enjoy dal, roti, vegetables, and seasonal fruits",
          emoji: "🍛",
          description: "Traditional Indian diet is naturally balanced",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only eat rice and ignore other dishes",
          emoji: "🍚",
          description: "Need variety for complete nutrition",
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
    navigate("/student/health-female/teens/quiz-nutrition");
  };

  return (
    <GameShell
      title="Balanced Diet Story"
      subtitle={`Level 11 of 20`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-11"
      gameType="health-female"
      totalLevels={20}
      currentLevel={11}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 11/20</span>
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
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default BalancedDietStory;