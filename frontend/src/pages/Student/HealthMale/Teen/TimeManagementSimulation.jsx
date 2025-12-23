import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TimeManagementSimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const scenarios = [
    {
      id: 1,
      text: "Teen has exams + sports practice. ",
      options: [
        {
          id: "a",
          text: "Waste time",
          emoji: "⏳",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balance time",
          emoji: "⚖️",
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
          text: "Prioritize tasks",
          emoji: "📋",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you prioritize when overwhelmed with tasks?",
      options: [
        {
          id: "a",
          text: "Focus on one task",
          emoji: "🎯",
          isCorrect: false
        },
        {
          id: "b",
          text: "Do everything at once",
          emoji: "💥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Procrastinate",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Make a schedule",
          emoji: "📅",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What helps with time management for schoolwork?",
      options: [
        {
          id: "d",
          text: "Daily study routine",
          emoji: "📖",
          isCorrect: true
        },
        {
          id: "a",
          text: "Study with friends",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "b",
          text: "Copy from friends",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study only before tests",
          emoji: "📚",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 4,
      text: "How should teens handle conflicting activities?",
      options: [
        {
          id: "a",
          text: "Discuss with friends",
          emoji: "💬",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cancel all plans",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try to do everything",
          emoji: "🤹",
          isCorrect: false
        },
        {
          id: "d",
          text: "Prioritize important tasks",
          emoji: "⭐",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What is the key to successful time management?",
      options: [
        {
          id: "a",
          text: "Avoiding schedules",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "b",
          text: "Flexible scheduling",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "d",
          text: "Consistency and planning",
          emoji: "📋",
          isCorrect: true
        },
        {
          id: "c",
          text: "Working all the time",
          emoji: "💼",
          isCorrect: false
        },
        
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
    navigate("/student/health-male/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Time Management"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-98"
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
            Time Management Simulation
          </h2>
          
          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].text}
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
            Good time management skills will help you succeed in life!
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

export default TimeManagementSimulation;
