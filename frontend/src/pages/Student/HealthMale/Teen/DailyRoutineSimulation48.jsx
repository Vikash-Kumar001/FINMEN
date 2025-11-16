import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation48 = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Morning routine: Options: (a) Shower + Brush, (b) Only Brush, (c) Skip Both. What do you choose?",
      options: [
        {
          id: "a",
          text: "Only Brush",
          emoji: "🪥",
          description: "Missing shower for complete hygiene",
          isCorrect: false
        },
        {
          id: "b",
          text: "Shower + Brush",
          emoji: "🚿",
          description: "Complete morning hygiene routine for fresh start",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip Both",
          emoji: "😴",
          description: "Poor hygiene affects health and confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After sports practice: (a) Shower + Change, (b) Change Only, (c) Continue as is.",
      options: [
        {
          id: "a",
          text: "Change Only",
          emoji: "👕",
          description: "Need to clean body too after sweating",
          isCorrect: false
        },
        {
          id: "b",
          text: "Continue as is",
          emoji: "🏃",
          description: "Sweat causes bad smell and skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Shower + Change",
          emoji: "🧼",
          description: "Clean body and clothes prevent odor and bacteria",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Evening routine: (a) Wash Face + Brush, (b) Brush Only, (c) Skip Both.",
      options: [
        {
          id: "a",
          text: "Brush Only",
          emoji: "🪥",
          description: "Face needs washing to remove oil and dirt",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip Both",
          emoji: "😴",
          description: "Nightly hygiene prevents skin and dental issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash Face + Brush",
          emoji: "🧴",
          description: "Complete evening hygiene for healthy skin and teeth",
          isCorrect: true
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
    navigate("/student/health-male/teens/reflex-hygiene-alert-49");
  };

  return (
    <GameShell
      title="Simulation: Daily Routine"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-48"
      gameType="health-male"
      totalLevels={50}
      currentLevel={48}
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

export default DailyRoutineSimulation48;
