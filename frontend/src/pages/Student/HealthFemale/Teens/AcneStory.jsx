import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AcneStory = () => {
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
      text: "You notice pimples appearing on your face. What should you do?",
      options: [
        {
          id: "a",
          text: "Wash face gently twice a day",
          emoji: "🧼",
          description: "Gentle cleansing helps prevent acne without irritating skin",
          isCorrect: true
        },
        {
          id: "b",
          text: "Squeeze and pop the pimples",
          emoji: "💥",
          description: "Squeezing can cause infection and scarring",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the pimples completely",
          emoji: "😴",
          description: "Ignoring acne won't make it go away and may worsen",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which foods might worsen acne?",
      options: [
        {
          id: "a",
          text: "Fried and sugary foods",
          emoji: "🍟",
          description: "High sugar and fried foods may contribute to acne",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fresh fruits and vegetables",
          emoji: "🍎",
          description: "These are generally good for skin health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Water and milk",
          emoji: "🥛",
          description: "These are generally good for skin health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you care for acne-prone skin?",
      options: [
        {
          id: "a",
          text: "Use gentle, non-comedogenic products",
          emoji: "🧴",
          description: "Non-comedogenic products won't clog pores",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scrub face vigorously to remove oil",
          emoji: "🔥",
          description: "Harsh scrubbing can irritate skin and worsen acne",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use multiple acne products at once",
          emoji: "🧪",
          description: "Using too many products can irritate skin",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When should you see a doctor about acne?",
      options: [
        {
          id: "a",
          text: "If acne is severe or doesn't improve",
          emoji: "👨‍⚕️",
          description: "Professional help is needed for persistent or severe acne",
          isCorrect: true
        },
        {
          id: "b",
          text: "For any small pimple",
          emoji: "🔴",
          description: "Most minor acne can be managed with good skincare",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never - acne always goes away alone",
          emoji: "🚫",
          description: "Some acne requires professional treatment",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can stress affect acne?",
      options: [
        {
          id: "a",
          text: "Stress can worsen acne breakouts",
          emoji: "😰",
          description: "Stress hormones can increase oil production",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stress has no effect on skin",
          emoji: "😐",
          description: "Stress can impact many body systems including skin",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stress always improves acne",
          emoji: "😌",
          description: "Stress typically worsens rather than improves acne",
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
    navigate("/student/health-female/teens/puberty-debate");
  };

  return (
    <GameShell
      title="Acne Story"
      subtitle={`Level 25 of 30`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-25"
      gameType="health-female"
      totalLevels={30}
      currentLevel={25}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 25/30</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔴</div>
            <h3 className="text-2xl font-bold text-white mb-2">Acne Care Story</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default AcneStory;