import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ChoresStory = () => {
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
      text: "Teen refuses to help at home. Should she?",
      options: [
        {
          id: "a",
          text: "Yes, chores build responsibility and life skills",
          emoji: "✅",
          description: "Contributing to household tasks develops important skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, she's too busy with studies and friends",
          emoji: "❌",
          description: "Balance is important, and chores teach valuable lessons",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if she gets paid for each task",
          emoji: "💰",
          description: "Learning responsibility shouldn't be transactional",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a benefit of regularly doing household chores?",
      options: [
        {
          id: "a",
          text: "Develops time management and organizational skills",
          emoji: "⏰",
          description: "Managing tasks teaches valuable life skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Reduces time available for studying",
          emoji: "📚",
          description: "Efficient chore completion can actually improve time management",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eliminates the need for other responsibilities",
          emoji: "🚫",
          description: "Chores are one part of overall responsibility",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should chores be approached for maximum benefit?",
      options: [
        {
          id: "a",
          text: "With a positive attitude and attention to detail",
          emoji: "😊",
          description: "Mindful approach builds character and skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "As quickly as possible to get them over with",
          emoji: "🏃",
          description: "Rushing reduces learning opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when parents are watching",
          emoji: "👀",
          description: "Genuine effort is more important than appearance",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What life skill is developed through doing chores?",
      options: [
        {
          id: "a",
          text: "Self-reliance and independence",
          emoji: "💪",
          description: "Practical skills build confidence for adulthood",
          isCorrect: true
        },
        {
          id: "b",
          text: "Dependence on others for basic tasks",
          emoji: "👶",
          description: "Chores teach self-sufficiency, not dependence",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding responsibilities whenever possible",
          emoji: "😴",
          description: "Chores teach the opposite - taking responsibility",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important for teens to contribute to household tasks?",
      options: [
        {
          id: "a",
          text: "Prepares them for independent living",
          emoji: "🏠",
          description: "Practical experience is essential for adulthood",
          isCorrect: true
        },
        {
          id: "b",
          text: "To please their parents at all costs",
          emoji: "👨‍👩‍👧",
          description: "Learning life skills is more important than pleasing others",
          isCorrect: false
        },
        {
          id: "c",
          text: "To earn the right to more privileges",
          emoji: "🎁",
          description: "Responsibility should be its own reward",
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
    navigate("/student/health-female/teens/debate-discipline-freedom");
  };

  return (
    <GameShell
      title="Chores Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-95"
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

export default ChoresStory;