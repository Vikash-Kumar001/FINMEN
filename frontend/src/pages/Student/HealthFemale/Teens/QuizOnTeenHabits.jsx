import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnTeenHabits = () => {
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
      text: "Which builds long-term health?",
      options: [
        {
          id: "a",
          text: "Balanced diet and adequate sleep",
          emoji: "🥗",
          description: "Nutrition and rest are fundamental to health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skipping meals to lose weight",
          emoji: "🍽️",
          description: "This can lead to nutritional deficiencies",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eating only favorite foods",
          emoji: "🍟",
          description: "Limited nutrition doesn't support long-term health",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a benefit of regular exercise for teens?",
      options: [
        
        {
          id: "b",
          text: "Increased need for sleep",
          emoji: "😴",
          description: "Exercise actually improves sleep quality",
          isCorrect: false
        },
        {
          id: "a",
          text: "Improved mood and energy levels",
          emoji: "😊",
          description: "Physical activity releases endorphins that boost mood",
          isCorrect: true
        },
        {
          id: "c",
          text: "Reduced academic performance",
          emoji: "📉",
          description: "Exercise typically enhances cognitive function",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is hydration important for teens?",
      options: [
        {
          id: "a",
          text: "Supports brain function and physical performance",
          emoji: "🧠",
          description: "Water is essential for all bodily functions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes you feel full to avoid overeating",
          emoji: "🍽️",
          description: "While it can help, this isn't the primary benefit",
          isCorrect: false
        },
        {
          id: "c",
          text: "Replaces sugary drinks in the diet",
          emoji: "🥤",
          description: "This is a secondary benefit, not the primary reason",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does consistent study time benefit academic performance?",
      options: [
        
        {
          id: "b",
          text: "Eliminates the need for exams",
          emoji: "✅",
          description: "Exams are still necessary to assess learning",
          isCorrect: false
        },
        {
          id: "c",
          text: "Allows more time for entertainment",
          emoji: "🎮",
          description: "This is a side effect, not the primary benefit",
          isCorrect: false
        },
        {
          id: "a",
          text: "Builds knowledge retention and reduces stress",
          emoji: "📚",
          description: "Regular study habits improve learning outcomes",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What is the impact of screen time on teen health?",
      options: [
        {
          id: "a",
          text: "Excessive use can disrupt sleep and reduce activity",
          emoji: "📱",
          description: "Balance is key for healthy screen time habits",
          isCorrect: true
        },
        {
          id: "b",
          text: "Has no effect on physical or mental health",
          emoji: "😐",
          description: "Research shows both positive and negative effects",
          isCorrect: false
        },
        {
          id: "c",
          text: "Improves social connections in all situations",
          emoji: "👥",
          description: "Quality of interactions matters more than quantity",
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
    navigate("/student/health-female/teens/reflex-teen-habits");
  };

  return (
    <GameShell
      title="Quiz on Teen Habits"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-92"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
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

export default QuizOnTeenHabits;