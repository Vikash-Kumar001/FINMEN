import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationDailyRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Morning Routine",
      description: "It's the start of a new day. What's your morning hygiene routine?",
      options: [
        {
          id: "a",
          text: "Brush teeth, wash face, shower if needed",
          emoji: "🌞",
          description: "Comprehensive morning care sets a fresh start to the day",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only brush teeth, skip washing face",
          emoji: "🦷",
          description: "Incomplete routine may lead to skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip hygiene completely to save time",
          emoji: "⏰",
          description: "Poor hygiene affects confidence and health throughout the day",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "School Day",
      description: "During school, you feel sweaty. What do you do?",
      options: [
        {
          id: "a",
          text: "Use wet wipes and change if possible",
          emoji: "🧻",
          description: "Maintaining freshness helps with confidence during school",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the feeling and continue",
          emoji: "😴",
          description: "Ignoring hygiene needs can affect comfort and social interactions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask to go home immediately",
          emoji: "🏠",
          description: "This is an extreme reaction to a normal situation",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Period Management",
      description: "You're at school during your period. What's your approach?",
      options: [
        {
          id: "a",
          text: "Regular checks and change during breaks",
          emoji: "🩹",
          description: "Proactive management prevents accidents and discomfort",
          isCorrect: true
        },
        {
          id: "b",
          text: "Change only once at lunch",
          emoji: "🍱",
          description: "Infrequent changes increase leak risk during heavy flow",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid drinking water to reduce flow",
          emoji: "❌",
          description: "Dehydration is unhealthy and doesn't effectively manage flow",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "After School",
      description: "You return home from school. What's your after-school routine?",
      options: [
        {
          id: "a",
          text: "Change clothes, wash hands, freshen up",
          emoji: "👕",
          description: "Refreshing after school helps with homework and relaxation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Continue in school clothes until dinner",
          emoji: "📚",
          description: "Wearing sweaty clothes for extended periods can cause skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Immediately lie down without changing",
          emoji: "🛋️",
          description: "This can transfer bacteria to bedding and cause odors",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Evening Routine",
      description: "It's bedtime. What's your nighttime hygiene routine?",
      options: [
        {
          id: "a",
          text: "Shower, wash face, brush teeth, change into clean PJs",
          emoji: "🛁",
          description: "Complete bedtime routine promotes good sleep and skin health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only brush teeth, skip shower",
          emoji: "🦷",
          description: "Incomplete routine may lead to body odor and skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip hygiene completely when tired",
          emoji: "😴",
          description: "Poor nighttime hygiene affects sleep quality and next day's comfort",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-freshness");
  };

  return (
    <GameShell
      title="Simulation: Daily Routine"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-48"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
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

export default SimulationDailyRoutine;