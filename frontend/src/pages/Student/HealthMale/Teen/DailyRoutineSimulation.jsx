import React, { useState } from "react";
import { useNavigate,  } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-8";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      time: "7:00 AM",
      situation: "You just woke up. What's the first step?",
      options: [
        {
          id: "a",
          text: "Check phone for 30 mins",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brush teeth & wash face",
          emoji: "🪥",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip everything",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "d",
          text: "Drink water and stretch",
          emoji: "💧",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      time: "7:30 AM",
      situation: "Time to get dressed. Your favorite shirt smells a bit.",
      options: [
        {
          id: "a",
          text: "Pick a clean shirt",
          emoji: "👔",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wear it anyway",
          emoji: "👕",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spray perfume on it",
          emoji: "💨",
          isCorrect: false
        },
        {
          id: "d",
          text: "Wear a jacket over it",
          emoji: "🧥",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      time: "8:00 AM",
      situation: "Breakfast time. What do you eat?",
      options: [
        {
          id: "a",
          text: "Balanced meal with protein",
          emoji: "🥞",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Healthy breakfast",
          emoji: "🍳",
          isCorrect: true
        },
        {
          id: "d",
          text: "Just coffee",
          emoji: "☕",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      time: "4:00 PM",
      situation: "Back from school. You feel sticky.",
      options: [
        {
          id: "a",
          text: "Take a shower",
          emoji: "🛁",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go straight to homework",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sit on the couch",
          emoji: "🛋️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Wash face & change",
          emoji: "🚿",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      time: "9:00 PM",
      situation: "Bedtime routine. Don't forget...",
      options: [
        {
          id: "a",
          text: "Eat a snack",
          emoji: "🍪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Just sleep",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Brush teeth & wash face",
          emoji: "🌙",
          isCorrect: true
        },
        {
          id: "d",
          text: "Set alarm and prepare tomorrow",
          emoji: "⏰",
          description: "Planning ahead reduces morning stress.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
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

  const handleNext = () => {
    navigate("/student/health-male/teens/hygiene-alert-reflex");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">
            {scenarios[currentScenario].time}
          </h2>
          
          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].situation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios[currentScenario].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
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

export default DailyRoutineSimulation;
