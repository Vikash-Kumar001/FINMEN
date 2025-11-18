import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClinicVisitSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "You book a doctor visit online. When you arrive, you see many people waiting. What do you do?",
      options: [
        {
          id: "a",
          text: "Get angry and demand immediate service",
          emoji: "😠",
          description: "Waiting is normal, patience helps everyone",
          isCorrect: false
        },
        {
          id: "b",
          text: "Panic and leave",
          emoji: "😰",
          description: "Staying calm and waiting is usually best",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wait calmly and read",
          emoji: "📖",
          description: "Staying calm makes the visit more productive",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "The nurse calls your name. How do you respond when they ask about your symptoms?",
      options: [
        {
          id: "b",
          text: "Give vague answers",
          emoji: "🤷",
          description: "Specific details help doctors provide better care",
          isCorrect: false
        },
        {
          id: "a",
          text: "Be detailed and honest",
          emoji: "💬",
          description: "Clear communication leads to accurate diagnosis",
          isCorrect: true
        },
        {
          id: "c",
          text: "Exaggerate symptoms",
          emoji: "📢",
          description: "Honest information is most helpful",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Doctor explains treatment options. What's the best way to respond?",
      options: [
        {
          id: "c",
          text: "Ask questions about options",
          emoji: "❓",
          description: "Understanding options helps make informed decisions",
          isCorrect: true
        },
        {
          id: "a",
          text: "Agree to everything immediately",
          emoji: "✅",
          description: "Questions help clarify treatment choices",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refuse all suggestions",
          emoji: "❌",
          description: "Discussing options leads to better outcomes",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The visit is over and you have new prescriptions. What should you do next?",
      options: [
        {
          id: "a",
          text: "Fill prescriptions immediately",
          emoji: "💊",
          description: "Following treatment plan improves health outcomes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait a few days",
          emoji: "⏰",
          description: "Timely medication helps recovery",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the prescriptions",
          emoji: "🗑️",
          description: "Following medical advice is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should you prepare for your next follow-up appointment?",
      options: [
        {
          id: "b",
          text: "Note any questions or concerns",
          emoji: "📝",
          description: "Preparation makes appointments more effective",
          isCorrect: true
        },
        {
          id: "c",
          text: "Schedule and show up",
          emoji: "📅",
          description: "Being prepared helps maximize appointment time",
          isCorrect: false
        },
        {
          id: "a",
          text: "Cancel if feeling better",
          emoji: "✅",
          description: "Follow-up appointments monitor progress",
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
    navigate("/student/health-male/teens/reflex-teen-safety");
  };

  return (
    <GameShell
      title="Simulation: Clinic Visit"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-78"
      gameType="health-male"
      totalLevels={80}
      currentLevel={78}
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
            <h3 className="text-2xl font-bold text-white mb-2">Clinic Visit Simulator</h3>
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

export default ClinicVisitSimulation;
