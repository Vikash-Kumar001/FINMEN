import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WeeklyMealsSimulation = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-18";

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
      day: "Monday Breakfast",
      situation: "Start the week right!",
      options: [
        {
          id: "a",
          text: "Eggs & Toast",
          emoji: "🍳",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip it",
          emoji: "🏃",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Just coffee",
          emoji: "☕",
          isCorrect: false
        },
        {
          id: "d",
          text: "Oatmeal with fruits",
          emoji: "🥣",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      day: "Tuesday Lunch",
      situation: "School cafeteria choices.",
      options: [
        {
          id: "a",
          text: "Sandwich & Fruit",
          emoji: "🥪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fried Chicken only",
          emoji: "🍗",
          isCorrect: false
        },
        {
          id: "c",
          text: "Vending machine snacks",
          emoji: "🍫",
          isCorrect: false
        },
        {
          id: "d",
          text: "Sandwich & Fruit",
          emoji: "🥪",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      day: "Wednesday Snack",
      situation: "Mid-day hunger.",
      options: [
        {
          id: "a",
          text: "Yogurt",
          emoji: "🥣",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cookies",
          emoji: "🍪",
          isCorrect: false
        },
        {
          id: "c",
          text: "Soda",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: "d",
          text: "Yogurt",
          emoji: "🥣",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      day: "Thursday Dinner",
      situation: "Family meal time.",
      options: [
        {
          id: "a",
          text: "Grilled Fish & Veggies",
          emoji: "🐟",
          isCorrect: false
        },
        {
          id: "b",
          text: "Order Pizza",
          emoji: "🍕",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat in room alone",
          emoji: "🚪",
          isCorrect: false
        },
        {
          id: "d",
          text: "Grilled Fish & Veggies",
          emoji: "🐟",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      day: "Friday Treat",
      situation: "End of the week celebration.",
      options: [
        {
          id: "a",
          text: "Small Ice Cream",
          emoji: "🍦",
          isCorrect: false
        },
        {
          id: "b",
          text: "Binge eat everything",
          emoji: "🤢",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Starve to save calories",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "d",
          text: "Fruit salad",
          emoji: "🍎",
          isCorrect: true
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
    navigate("/student/health-male/teens/reflex-smart-drink");
  };

  return (
    <GameShell
      title="Weekly Meals Simulation"
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
            {scenarios[currentScenario].day}
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
      {gameFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Simulation Complete!</h3>
          <p className="text-xl text-white/90 mb-6">
            You earned {coins} coins!
          </p>
          <p className="text-white/80 mb-8">
            Healthy eating habits will help you grow strong!
          </p>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Next Challenge
          </button>
        </div>
      )}
    </GameShell>
  );
};

export default WeeklyMealsSimulation;
