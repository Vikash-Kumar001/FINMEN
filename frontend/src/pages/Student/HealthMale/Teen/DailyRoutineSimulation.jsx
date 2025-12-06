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

  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      time: "7:00 AM",
      situation: "You just woke up. What's the first step?",
      options: [
        {
          id: "b",
          text: "Check phone for 30 mins",
          emoji: "📱",
          description: "This wastes time and strains eyes.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brush teeth & wash face",
          emoji: "🪥",
          description: "Start the day fresh!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip everything",
          emoji: "🏃",
          description: "Hygiene is important!",
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
          id: "c",
          text: "Wear it anyway",
          emoji: "👕",
          description: "You'll smell all day.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Pick a clean shirt",
          emoji: "👔",
          description: "Always wear fresh clothes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spray perfume on it",
          emoji: "💨",
          description: "Perfume doesn't clean dirt.",
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
          id: "b",
          text: "Just coffee",
          emoji: "☕",
          description: "Coffee isn't a meal.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Healthy breakfast",
          emoji: "🍳",
          description: "Fuel for your body and brain.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing",
          emoji: "🚫",
          description: "Skipping breakfast makes you tired.",
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
          id: "c",
          text: "Sit on the couch",
          emoji: "🛋️",
          description: "You'll get the couch dirty.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash face & change",
          emoji: "🚿",
          description: "Remove the day's dirt and sweat.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go straight to homework",
          emoji: "📚",
          description: "Freshen up first to focus better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      time: "9:00 PM",
      situation: "Bedtime routine. Don't forget...",
      options: [
        {
          id: "b",
          text: "Eat a snack",
          emoji: "🍪",
          description: "Brush after eating!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brush teeth & wash face",
          emoji: "🌙",
          description: "Clean up before sleep prevents acne and cavities.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just sleep",
          emoji: "😴",
          description: "Don't sleep with a dirty face/teeth.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

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
      subtitle={`Time: ${scenarios[currentScenario].time}`}
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
            <span className="text-white/80">Step {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{scenarios[currentScenario].time}</h3>
          <p className="text-white text-lg mb-6">
            {scenarios[currentScenario].situation}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {scenarios[currentScenario].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default DailyRoutineSimulation;
