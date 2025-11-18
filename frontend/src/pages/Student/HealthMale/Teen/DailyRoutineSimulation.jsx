import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Teen wakes up in the morning. What should he do first?",
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
      text: "After school, teen feels sweaty from PE class. What next?",
      options: [
        {
          id: "a",
          text: "Change clothes + freshen up",
          emoji: "👕",
          description: "Clean clothes and body prevent odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep same clothes",
          emoji: "👚",
          description: "Sweaty clothes cause bad smell",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just use deodorant",
          emoji: "🧴",
          description: "Need to change clothes too",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Before bed, teen notices oily face. What should he do?",
      options: [
        {
          id: "a",
          text: "Wash face + brush teeth",
          emoji: "🧼",
          description: "Complete evening hygiene routine",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip face washing",
          emoji: "😴",
          description: "Oily skin needs nightly cleaning",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only brush teeth",
          emoji: "🪥",
          description: "Face needs washing too",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Teen has a date after school. What hygiene preparation is needed?",
      options: [
        {
          id: "a",
          text: "Full hygiene routine + fresh clothes",
          emoji: "✨",
          description: "Complete preparation builds confidence for social events",
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
      text: "After playing sports all afternoon, teen comes home tired. What should happen?",
      options: [
        {
          id: "a",
          text: "Shower, clean clothes, then rest",
          emoji: "🚿",
          description: "Clean body prevents skin infections and odors",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go straight to bed",
          emoji: "😴",
          description: "Sweat and dirt on skin causes problems overnight",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just change shirt",
          emoji: "👕",
          description: "Need full body cleaning after intense activity",
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
    navigate("/student/health-male/teen/hygiene-alert-reflex");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-8"
      gameType="health-male"
      totalLevels={10}
      currentLevel={8}
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
            <h3 className="text-2xl font-bold text-white mb-2">Daily Routine Simulator</h3>
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

export default DailyRoutineSimulation;
