import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenRoutineSimulation = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-28";

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
      time: "Morning Shower",
      situation: "You are in a rush. Shower or skip?",
      options: [
         {
          id: "a",
          text: "Quick shower",
          emoji: "🚿",
          description: "Essential for hygiene.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip shower",
          emoji: "🏃",
          description: "You might smell later.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Just wash hair",
          emoji: "💇",
          description: "Body needs cleaning too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      time: "Getting Dressed",
      situation: "Your favorite shirt is dirty.",
      options: [
        {
          id: "c",
          text: "Wear it anyway",
          emoji: "👕",
          description: "Hygiene first!",
          isCorrect: false
        },
        
        {
          id: "b",
          text: "Spray perfume on dirty shirt",
          emoji: "💨",
          description: "Doesn't hide the smell.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wear a clean one",
          emoji: "👔",
          description: "Always choose clean clothes.",
          isCorrect: true
        },

      ]
    },
    {
      id: 3,
      time: "After School",
      situation: "You played sports and are sweaty.",
      options: [
        {
          id: "b",
          text: "Sit on sofa",
          emoji: "🛋️",
          description: "You'll make it dirty.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash face and change",
          emoji: "🧼",
          description: "Remove sweat and dirt.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Go to sleep",
          emoji: "😴",
          description: "Clean up first.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      time: "Shaving",
      situation: "You see some facial hair.",
      options: [
        {
          id: "c",
          text: "Shave dry",
          emoji: "🌵",
          description: "Causes razor burn.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Use shaving cream",
          emoji: "🪒",
          description: "Protects your skin.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Use soap only",
          emoji: "🧼",
          description: "Cream is better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      time: "Bedtime",
      situation: "You are tired. Brush teeth?",
      options: [
         {
          id: "a",
          text: "Brush for 2 mins",
          emoji: "🪥",
          description: "Keep that smile healthy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip tonight",
          emoji: "😴",
          description: "Cavities don't sleep.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Chew gum",
          emoji: "🍬",
          description: "Not a substitute.",
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
    navigate("/student/health-male/teens/reflex-healthy-teen");
  };

  return (
    <GameShell
      title="Teen Routine Simulation"
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

export default TeenRoutineSimulation;
