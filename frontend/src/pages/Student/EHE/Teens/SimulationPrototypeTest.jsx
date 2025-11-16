import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationPrototypeTest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "A teen designs an app idea to help students organize homework. What should she do next?",
      options: [
        {
          id: "a",
          text: "Test with friends to get feedback",
          emoji: "👥",
          description: "Great! User testing reveals strengths and areas for improvement.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it and never show anyone",
          emoji: "🙈",
          description: "Hiding prevents valuable feedback and improvement opportunities.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up because it might have flaws",
          emoji: "🏳️",
          description: "Iteration and improvement are key parts of the design process.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During testing, users suggest improvements. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Listen carefully and consider the feedback",
          emoji: "👂",
          description: "Perfect! Feedback helps create solutions that truly meet user needs.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore all feedback to preserve her vision",
          emoji: "🙉",
          description: "Ignoring feedback can result in solutions that don't address real needs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Get defensive and argue with users",
          emoji: "😠",
          description: "Defensiveness prevents learning and improvement from user insights.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The prototype has some issues users identified. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Refine the prototype based on feedback",
          emoji: "🔧",
          description: "Excellent! Iteration leads to better solutions and user satisfaction.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Launch immediately without changes",
          emoji: "🚀",
          description: "Unaddressed issues can lead to poor user experience and adoption.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Start over completely from scratch",
          emoji: "🗑️",
          description: "Complete restarts waste progress - iterative improvement is more efficient.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How many rounds of testing and refinement are ideal?",
      options: [
        {
          id: "a",
          text: "Multiple rounds to improve the solution",
          emoji: "🔄",
          description: "Great! Multiple iterations lead to more robust and user-friendly solutions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just one round then launch",
          emoji: "1️⃣",
          description: "One round often isn't enough to identify all potential improvements.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never test - go straight to market",
          emoji: "⏩",
          description: "Testing prevents costly mistakes and improves user satisfaction.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of testing with diverse users?",
      options: [
        {
          id: "a",
          text: "Reveals different perspectives and needs",
          emoji: "🌍",
          description: "Perfect! Diverse feedback helps create inclusive and effective solutions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complicates the development process",
          emoji: "🔄",
          description: "Diverse feedback enriches solutions rather than complicating them.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only test with similar people",
          emoji: "👥",
          description: "Limiting testing misses opportunities to improve for broader audiences.",
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
    navigate("/student/ehe/teens/reflex-teen-design-thinking");
  };

  return (
    <GameShell
      title="Simulation: Prototype Test"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-38"
      gameType="ehe"
      totalLevels={40}
      currentLevel={38}
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
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Prototype Testing Simulator</h3>
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

export default SimulationPrototypeTest;