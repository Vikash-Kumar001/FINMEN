import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpecialistStory = () => {
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
      text: "A teen has persistent skin allergies. Should she visit a dermatologist?",
      options: [
        {
          id: "a",
          text: "Yes, a dermatologist specializes in skin conditions",
          emoji: "✅",
          description: "Specialists provide expert care for specific conditions",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, a general doctor is sufficient",
          emoji: "❌",
          description: "Complex cases benefit from specialist expertise",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if symptoms worsen",
          emoji: "⏳",
          description: "Early specialist consultation prevents complications",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When might you need to see a specialist?",
      options: [
        {
          id: "a",
          text: "For routine checkups only",
          emoji: "📋",
          description: "General doctors handle routine care",
          isCorrect: false
        },
        {
          id: "b",
          text: "For complex or specific health conditions",
          emoji: "🔍",
          description: "Specialists have advanced training in their fields",
          isCorrect: true
        },
        {
          id: "c",
          text: "Whenever you feel unwell",
          emoji: "🤒",
          description: "General doctors can assess and refer when needed",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the benefit of seeing the right specialist?",
      options: [
        {
          id: "a",
          text: "More expensive care",
          emoji: "💸",
          description: "Specialist care is about quality, not cost",
          isCorrect: false
        },
        {
          id: "b",
          text: "Expert knowledge and targeted treatment",
          emoji: "🎓",
          description: "Specialists focus on specific areas of medicine",
          isCorrect: true
        },
        {
          id: "c",
          text: "Longer waiting times",
          emoji: "⏱️",
          description: "Specialists often provide more efficient solutions",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do you get referred to a specialist?",
      options: [
        {
          id: "a",
          text: "By skipping your regular doctor",
          emoji: "🏃",
          description: "This bypasses important coordination of care",
          isCorrect: false
        },
        {
          id: "b",
          text: "Through your primary care doctor's referral",
          emoji: "👨‍⚕️",
          description: "Referrals ensure appropriate specialist care",
          isCorrect: true
        },
        {
          id: "c",
          text: "By choosing randomly from a list",
          emoji: "🎲",
          description: "Medical history and needs guide specialist selection",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you prepare for a specialist appointment?",
      options: [
        {
          id: "a",
          text: "Medical history and current symptoms",
          emoji: "📋",
          description: "Complete information helps accurate diagnosis",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only your insurance card",
          emoji: "💳",
          description: "Medical information is essential for care",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing - the specialist will figure it out",
          emoji: "🤷",
          description: "Patient participation improves care quality",
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
    navigate("/student/health-female/teens/debate-doctor-fear");
  };

  return (
    <GameShell
      title="Specialist Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-75"
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

export default SpecialistStory;