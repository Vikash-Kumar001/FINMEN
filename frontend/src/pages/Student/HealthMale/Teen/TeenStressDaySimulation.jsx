import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenStressDaySimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Teen has exams + sports practice. Choose: (a) Relax + Plan, (b) Panic, (c) Skip everything.",
      options: [
        {
          id: "a",
          text: "Relax + Plan",
          emoji: "📅",
          description: "Planning and relaxation help manage multiple responsibilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic",
          emoji: "😰",
          description: "Panic increases stress and reduces performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip everything",
          emoji: "🏃",
          description: "Facing responsibilities is better than avoidance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During study session, feeling overwhelmed. What do you do?",
      options: [
        {
          id: "a",
          text: "Take a 10-minute break",
          emoji: "⏸️",
          description: "Short breaks improve focus and reduce stress",
          isCorrect: true
        },
        {
          id: "b",
          text: "Push through without break",
          emoji: "💪",
          description: "Without breaks, performance and mood suffer",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up studying",
          emoji: "😞",
          description: "Perseverance with breaks leads to better results",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "After sports, feeling tired and stressed. Best recovery?",
      options: [
        {
          id: "a",
          text: "Light exercise + healthy snack",
          emoji: "🥗",
          description: "Proper recovery supports both body and mind",
          isCorrect: true
        },
        {
          id: "b",
          text: "More intense workout",
          emoji: "🏋️",
          description: "Rest and recovery are important after activity",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip meals and rest",
          emoji: "😴",
          description: "Nutrition is essential for stress management",
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
    navigate("/student/health-male/teens/reflex-emotional-health");
  };

  return (
    <GameShell
      title="Simulation: Teen Stress Day"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-58"
      gameType="health-male"
      totalLevels={60}
      currentLevel={58}
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
            <h3 className="text-2xl font-bold text-white mb-2">Stress Day Simulator</h3>
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

export default TeenStressDaySimulation;
