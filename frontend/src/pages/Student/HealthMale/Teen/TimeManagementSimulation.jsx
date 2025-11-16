import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TimeManagementSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Teen has exams + sports practice. Options: Balance time / Waste time / Skip everything.",
      options: [
        {
          id: "b",
          text: "Balance time",
          emoji: "⚖️",
          description: "Managing time effectively allows for both responsibilities",
          isCorrect: true
        },
        {
          id: "a",
          text: "Waste time",
          emoji: "⏳",
          description: "Time management is crucial for success",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip everything",
          emoji: "🏃",
          description: "Facing responsibilities builds character",
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
          text: "Make a schedule",
          emoji: "📅",
          description: "Planning helps manage multiple responsibilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do everything at once",
          emoji: "💥",
          description: "Organization prevents feeling overwhelmed",
          isCorrect: false
        },
        {
          id: "c",
          text: "Procrastinate",
          emoji: "😴",
          description: "Planning ahead reduces stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps with time management for schoolwork?",
      options: [
        {
          id: "c",
          text: "Study only before tests",
          emoji: "📚",
          description: "Consistent study habits are more effective",
          isCorrect: false
        },
        {
          id: "a",
          text: "Daily study routine",
          emoji: "📖",
          description: "Regular study prevents last-minute stress",
          isCorrect: true
        },
        {
          id: "b",
          text: "Copy from friends",
          emoji: "👥",
          description: "Personal effort leads to real learning",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should teens handle conflicting activities?",
      options: [
        {
          id: "a",
          text: "Prioritize important tasks",
          emoji: "⭐",
          description: "Setting priorities helps manage time effectively",
          isCorrect: true
        },
        {
          id: "c",
          text: "Try to do everything",
          emoji: "🤹",
          description: "Quality over quantity in activities",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cancel all plans",
          emoji: "❌",
          description: "Balance is possible with good planning",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the key to successful time management?",
      options: [
        {
          id: "b",
          text: "Consistency and planning",
          emoji: "📋",
          description: "Regular routines and planning lead to success",
          isCorrect: true
        },
        {
          id: "c",
          text: "Working all the time",
          emoji: "💼",
          description: "Balance includes rest and recreation",
          isCorrect: false
        },
        {
          id: "a",
          text: "Avoiding schedules",
          emoji: "🎲",
          description: "Structure helps achieve goals",
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

    setChoices([...choices, { step: currentStep, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentStep < scenarios.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentStep];

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Time Management"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-98"
      gameType="health-male"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Time Management Simulator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default TimeManagementSimulation;
