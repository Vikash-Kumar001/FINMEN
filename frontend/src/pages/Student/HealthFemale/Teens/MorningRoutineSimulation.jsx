import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MorningRoutineSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Teen wakes up in the morning. What should she do first?",
      options: [
        {
          id: "a",
          text: "Brush teeth + take shower",
          emoji: "🪥",
          description: "Complete morning hygiene routine",
          isCorrect: true
        },
        {
          id: "b",
          text: "Brush teeth only",
          emoji: "🪥",
          description: "Missing shower for complete hygiene",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip both",
          emoji: "😴",
          description: "Poor hygiene affects health and confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After getting ready, teen has her period. What should she do?",
      options: [
        {
          id: "a",
          text: "Change to fresh sanitary product",
          emoji: "🧻",
          description: "Fresh products maintain hygiene and comfort",
          isCorrect: true
        },
        {
          id: "b",
          text: "Continue with current product",
          emoji: "❌",
          description: "Worn products can cause odor and infections",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore period hygiene",
          emoji: "🚫",
          description: "Proper period hygiene is essential for health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Before school, teen notices oily hair. What should she do?",
      options: [
        {
          id: "a",
          text: "Refresh hair with water or dry shampoo",
          emoji: "💧",
          description: "Quick refresh maintains appearance and confidence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do nothing about oily hair",
          emoji: "😴",
          description: "Oily hair affects appearance and confidence",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash hair completely",
          emoji: "🚿",
          description: "Full wash isn't always practical before school",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Teen has an important presentation at school. What hygiene preparation is needed?",
      options: [
        {
          id: "a",
          text: "Full hygiene routine + fresh clothes",
          emoji: "✨",
          description: "Complete preparation builds confidence for important events",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just brush teeth quickly",
          emoji: "🪥",
          description: "Need complete hygiene for important events",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip hygiene routine",
          emoji: "🤷",
          description: "Good hygiene shows respect for yourself and others",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After morning routine, teen feels confident. Why?",
      options: [
        {
          id: "a",
          text: "Good hygiene boosts self-esteem",
          emoji: "🌟",
          description: "Feeling clean and fresh improves confidence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Clothes make her feel good",
          emoji: "👕",
          description: "While clothes help, hygiene is the foundation",
          isCorrect: false
        },
        {
          id: "c",
          text: "She's not sure why",
          emoji: "🤔",
          description: "Understanding the connection helps maintain good habits",
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
    navigate("/student/health-female/teens/reflex-hygiene-alert");
  };

  return (
    <GameShell
      title="Simulation: Morning Routine"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-8"
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
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Morning Routine Simulator</h3>
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

export default MorningRoutineSimulation;