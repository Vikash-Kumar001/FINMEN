import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsEnergyStory = () => {
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
      text: "After an intense sports session, you're thirsty and tired. What should you drink?",
      options: [
        {
          id: "a",
          text: "Water with a pinch of salt",
          emoji: "💧",
          description: "Rehydrates and replaces lost electrolytes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Energy drink",
          emoji: "🥤",
          description: "High in sugar and caffeine, not ideal for hydration",
          isCorrect: false
        },
        {
          id: "c",
          text: "Soda",
          emoji: "🥤",
          description: "High sugar content can dehydrate you further",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You've just finished playing badminton. What should you eat for recovery?",
      options: [
        {
          id: "a",
          text: "Banana and nuts",
          emoji: "🍌",
          description: "Banana provides potassium, nuts provide protein and healthy fats",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips and cola",
          emoji: "🍟",
          description: "Lacks nutrients needed for muscle recovery",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing, just rest",
          emoji: "😴",
          description: "Your body needs nutrients to recover properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Before a morning sports practice, what should you eat?",
      options: [
        {
          id: "a",
          text: "Light snack like idli or banana",
          emoji: "🍌",
          description: "Provides energy without weighing you down",
          isCorrect: true
        },
        {
          id: "b",
          text: "Heavy meal like dosa with sambar",
          emoji: "🍽️",
          description: "Heavy meals can make you sluggish during exercise",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip breakfast to lose weight",
          emoji: "🚫",
          description: "Skipping meals reduces energy and performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "During a long sports tournament, how often should you hydrate?",
      options: [
        {
          id: "a",
          text: "Only when feeling very thirsty",
          emoji: "🥵",
          description: "By the time you're thirsty, you're already dehydrated",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every 15-20 minutes",
          emoji: "⏰",
          description: "Regular hydration prevents dehydration and maintains performance",
          isCorrect: true
        },
        {
          id: "c",
          text: "Drink a lot at once during breaks",
          emoji: "🥤",
          description: "Large amounts at once can cause discomfort",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After sports, which combination helps muscle recovery best?",
      options: [
        {
          id: "a",
          text: "Protein and carbohydrates",
          emoji: "🥚",
          description: "Protein repairs muscles, carbs replenish energy stores",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only protein",
          emoji: "🥩",
          description: "Carbs are also needed to replenish energy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only carbohydrates",
          emoji: "🍞",
          description: "Protein is needed for muscle repair",
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
    navigate("/student/health-female/teens/junk-food-debate");
  };

  return (
    <GameShell
      title="Sports Energy Story"
      subtitle={`Level 15 of 20`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-15"
      gameType="health-female"
      totalLevels={20}
      currentLevel={15}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 15/20</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏃</div>
            <h3 className="text-2xl font-bold text-white mb-2">Sports Nutrition Story</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SportsEnergyStory;