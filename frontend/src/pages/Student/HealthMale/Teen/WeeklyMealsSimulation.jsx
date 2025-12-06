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
          description: "Protein and carbs.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip it",
          emoji: "🏃",
          description: "Bad start.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Just coffee",
          emoji: "☕",
          description: "Not enough fuel.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      day: "Tuesday Lunch",
      situation: "School cafeteria choices.",
      options: [
        {
          id: "c",
          text: "Vending machine snacks",
          emoji: "🍫",
          description: "Not a meal.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Sandwich & Fruit",
          emoji: "🥪",
          description: "Balanced and tasty.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fried Chicken only",
          emoji: "🍗",
          description: "Too greasy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      day: "Wednesday Snack",
      situation: "Mid-day hunger.",
      options: [
        {
          id: "b",
          text: "Cookies",
          emoji: "🍪",
          description: "Sugar rush.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yogurt",
          emoji: "🥣",
          description: "Calcium and protein.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Soda",
          emoji: "🥤",
          description: "Empty calories.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      day: "Thursday Dinner",
      situation: "Family meal time.",
      options: [
        {
          id: "c",
          text: "Eat in room alone",
          emoji: "🚪",
          description: "Social eating is better.",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Order Pizza",
          emoji: "🍕",
          description: "Not the healthiest habit.",
          isCorrect: false
        },
         {
          id: "a",
          text: "Grilled Fish & Veggies",
          emoji: "🐟",
          description: "Perfect dinner.",
          isCorrect: true
        },
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
          description: "Moderation is key!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Binge eat everything",
          emoji: "🤢",
          description: "Don't overdo it.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Starve to save calories",
          emoji: "🤐",
          description: "Never starve yourself.",
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
    navigate("/student/health-male/teens/reflex-smart-drink");
  };

  return (
    <GameShell
      title="Weekly Meals Simulation"
      subtitle={`Day: ${scenarios[currentScenario].day}`}
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

          <h3 className="text-2xl font-bold text-white mb-2">{scenarios[currentScenario].day}</h3>
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

export default WeeklyMealsSimulation;
