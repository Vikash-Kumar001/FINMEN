import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnDangers = () => {
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
      text: "Smoking can cause?",
      options: [
        {
          id: "a",
          text: "Lung damage and cancer",
          emoji: "🫁",
          description: "Smoking damages lung tissue and increases cancer risk",
          isCorrect: true
        },
        {
          id: "b",
          text: "Healthy teeth and gums",
          emoji: "🦷",
          description: "Smoking stains teeth and causes gum disease",
          isCorrect: false
        },
        {
          id: "c",
          text: "Improved athletic performance",
          emoji: "🏃",
          description: "Smoking reduces oxygen and impairs performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a major risk of alcohol use for teens?",
      options: [
        {
          id: "a",
          text: "Impaired brain development",
          emoji: "🧠",
          description: "The teen brain is still developing until mid-20s",
          isCorrect: true
        },
        {
          id: "b",
          text: "Better decision-making skills",
          emoji: "🤔",
          description: "Alcohol impairs judgment and decision-making",
          isCorrect: false
        },
        {
          id: "c",
          text: "Increased academic performance",
          emoji: "📚",
          description: "Alcohol negatively affects school performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which organ is most affected by alcohol?",
      options: [
        {
          id: "a",
          text: "Liver",
          emoji: "🍺",
          description: "The liver processes alcohol and can be damaged by it",
          isCorrect: true
        },
        {
          id: "b",
          text: "Heart",
          emoji: "❤️",
          description: "While affected, the liver bears the main burden",
          isCorrect: false
        },
        {
          id: "c",
          text: "Kidneys",
          emoji: "🫘",
          description: "These are less directly affected than the liver",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a consequence of drug use?",
      options: [
        {
          id: "a",
          text: "Brain chemistry disruption",
          emoji: "😵",
          description: "Drugs alter neurotransmitters and brain function",
          isCorrect: true
        },
        {
          id: "b",
          text: "Enhanced memory",
          emoji: "🧠",
          description: "Drugs typically impair memory and cognitive function",
          isCorrect: false
        },
        {
          id: "c",
          text: "Improved mental health",
          emoji: "😊",
          description: "Drugs often worsen mental health conditions",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why are teens particularly vulnerable to substance use?",
      options: [
        {
          id: "a",
          text: "Still-developing brain and risk-taking tendencies",
          emoji: "🧠",
          description: "The teen brain is more susceptible to addiction",
          isCorrect: true
        },
        {
          id: "b",
          text: "Greater self-control than adults",
          emoji: "💪",
          description: "Teens typically have less self-control than adults",
          isCorrect: false
        },
        {
          id: "c",
          text: "Natural need for risky experiences",
          emoji: "🎢",
          description: "While risk-taking is normal, it's not a natural need",
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
    navigate("/student/health-female/teens/reflex-teen-choice");
  };

  return (
    <GameShell
      title="Quiz on Dangers"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-82"
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

export default QuizOnDangers;