import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationEntrancePrep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "A teen has an important entrance exam in 6 months. What's the best approach to prepare?",
      options: [
        {
          id: "a",
          text: "Study regularly with a structured plan",
          emoji: "📅",
          description: "Perfect! Consistent, planned study leads to better retention and performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip preparation and hope for the best",
          emoji: "😴",
          description: "Lack of preparation significantly reduces chances of success",
          isCorrect: false
        },
        {
          id: "c",
          text: "Panic and cram at the last minute",
          emoji: "🤯",
          description: "Last-minute cramming leads to stress and poor performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should the teen organize their study schedule?",
      options: [
        {
          id: "a",
          text: "Balance all subjects with regular review sessions",
          emoji: "⚖️",
          description: "Exactly! Balanced study with regular review ensures comprehensive preparation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focus only on favorite subjects",
          emoji: "🎯",
          description: "Neglecting weak areas can create knowledge gaps that hurt overall performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study randomly without any plan",
          emoji: "🎲",
          description: "Random study lacks focus and efficiency in covering required material",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's important when taking practice exams?",
      options: [
        {
          id: "a",
          text: "Simulate real exam conditions and review mistakes",
          emoji: "📝",
          description: "Perfect! Practice under real conditions and learn from errors improves performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only focus on finishing quickly",
          emoji: "⏱️",
          description: "Speed without accuracy often leads to poor results",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore results and move on",
          emoji: "🙈",
          description: "Reviewing practice results identifies weak areas for improvement",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can the teen manage exam stress?",
      options: [
        {
          id: "a",
          text: "Regular exercise, adequate sleep, and relaxation techniques",
          emoji: "🧘",
          description: "Exactly! Physical and mental wellness are crucial for optimal performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Study continuously without breaks",
          emoji: "📚",
          description: "Burnout from overstudying reduces effectiveness and increases stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all social interactions",
          emoji: "👻",
          description: "Social support helps manage stress and maintain mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should the teen do in the final weeks before the exam?",
      options: [
        {
          id: "a",
          text: "Review key concepts and maintain healthy routines",
          emoji: "📋",
          description: "Perfect! Focused review with good health practices optimizes exam performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cram intensively and sacrifice sleep",
          emoji: "☕",
          description: "Intensive cramming and sleep deprivation harm cognitive performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stop studying completely",
          emoji: "🏁",
          description: "Complete cessation of study leads to knowledge decay before the exam",
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
    navigate("/student/ehe/teens/reflex-teen-awareness");
  };

  return (
    <GameShell
      title="Simulation: Entrance Prep"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-68"
      gameType="ehe"
      totalLevels={70}
      currentLevel={68}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">Entrance Exam Preparation Simulator</h3>
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

export default SimulationEntrancePrep;