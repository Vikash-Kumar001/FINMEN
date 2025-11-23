import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodRoutineStory = () => {
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
      text: "During heavy flow days, what's the best pad changing routine?",
      options: [
        {
          id: "a",
          text: "Change every 3-4 hours or when soiled",
          emoji: "⏰",
          description: "Regular changing prevents leaks and reduces infection risk",
          isCorrect: true
        },
        {
          id: "b",
          text: "Change only once a day",
          emoji: "📅",
          description: "This increases infection and odor risk during heavy flow",
          isCorrect: false
        },
        {
          id: "c",
          text: "Change only when completely soaked",
          emoji: "🌊",
          description: "Waiting too long can cause leaks and discomfort",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to manage period pain?",
      options: [
        {
          id: "a",
          text: "Use hot water bottle and rest",
          emoji: "♨️",
          description: "Heat therapy and rest can effectively reduce cramping",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the pain and continue activities",
          emoji: "🏃",
          description: "Ignoring severe pain can worsen your condition",
          isCorrect: false
        },
        {
          id: "c",
          text: "Take any painkiller without consulting",
          emoji: "💊",
          description: "Medication should be taken as per instructions or advice",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you maintain hygiene during periods?",
      options: [
        {
          id: "a",
          text: "Wash intimate areas with mild soap and water",
          emoji: "🧼",
          description: "Gentle cleaning maintains pH balance and prevents infections",
          isCorrect: true
        },
        {
          id: "b",
          text: "Use harsh soaps and scrub vigorously",
          emoji: "🔥",
          description: "Harsh cleaning can disrupt natural pH and cause irritation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid cleaning altogether",
          emoji: "❌",
          description: "Poor hygiene increases infection risk during periods",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What type of clothing is best during heavy flow days?",
      options: [
        {
          id: "a",
          text: "Dark-colored, breathable fabrics",
          emoji: "👕",
          description: "Dark colors hide potential stains and breathable fabrics reduce discomfort",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tight synthetic materials",
          emoji: "🦺",
          description: "Tight clothing can cause discomfort and restrict airflow",
          isCorrect: false
        },
        {
          id: "c",
          text: "Light-colored cotton only",
          emoji: "👚",
          description: "Light colors may show stains more easily",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you experience severe period symptoms?",
      options: [
        {
          id: "a",
          text: "Consult a doctor or trusted adult",
          emoji: "👩‍⚕️",
          description: "Professional advice is important for severe symptoms",
          isCorrect: true
        },
        {
          id: "b",
          text: "Self-medicate with high doses",
          emoji: "💊",
          description: "Taking excessive medication without guidance can be harmful",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid telling anyone about the symptoms",
          emoji: "🤫",
          description: "Hiding severe symptoms can delay necessary treatment",
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
    navigate("/student/health-female/teens/debate-period-hygiene-schools");
  };

  return (
    <GameShell
      title="Period Routine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-45"
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

export default PeriodRoutineStory;