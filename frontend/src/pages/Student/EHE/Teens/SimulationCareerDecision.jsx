import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCareerDecision = () => {
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
      text: "A teen is passionate about arts but parents want her to become a doctor. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Ignore parents completely",
          emoji: "🚫",
          description: "Family relationships matter; complete disregard can create unnecessary conflict",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explore both interests and communicate openly",
          emoji: "🤝",
          description: "Perfect! Balancing personal interests with family input leads to better decisions",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give up on personal interests entirely",
          emoji: "🏳️",
          description: "Personal fulfillment is important for long-term career satisfaction",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When choosing between Medicine, Engineering, and Arts, what factors should guide the decision?",
      options: [
        {
          id: "a",
          text: "Parents' preferences only",
          emoji: "👨‍👩‍👧‍👦",
          description: "While family input is valuable, personal fit is crucial for career success",
          isCorrect: false
        },
        {
          id: "b",
          text: "Interests, aptitude, and research on all options",
          emoji: "🔍",
          description: "Exactly! Comprehensive evaluation leads to informed career decisions",
          isCorrect: true
        },
        {
          id: "c",
          text: "Highest salary potential only",
          emoji: "💰",
          description: "Financial considerations are important but shouldn't be the only factor",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should the teen gather information about these career paths?",
      options: [
        {
          id: "a",
          text: "Talk to professionals, research thoroughly, and try internships",
          emoji: "👥",
          description: "Perfect! Direct engagement provides authentic insights into career realities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only read online articles",
          emoji: "💻",
          description: "While online research helps, direct experience is more valuable",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy what friends are choosing",
          emoji: "👯",
          description: "Individual career paths should align with personal interests and strengths",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's important when balancing personal interests with family expectations?",
      options: [
        {
          id: "a",
          text: "Open communication and finding common ground",
          emoji: "💬",
          description: "Exactly! Dialogue helps align personal goals with family support",
          isCorrect: true
        },
        {
          id: "b",
          text: "Secretly pursue interests without telling family",
          emoji: "🤫",
          description: "Honesty and transparency build trust and support systems",
          isCorrect: false
        },
        {
          id: "c",
          text: "Completely ignore personal interests",
          emoji: "❌",
          description: "Personal fulfillment contributes to long-term career success and happiness",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After researching all options, what's the next step?",
      options: [
        {
          id: "a",
          text: "Make a decision based on thorough analysis",
          emoji: "✅",
          description: "Perfect! Informed decisions based on research lead to better outcomes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Delay decision indefinitely",
          emoji: "⏰",
          description: "Timely decisions prevent missed opportunities and unnecessary stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Choose randomly without analysis",
          emoji: "🎲",
          description: "Career decisions affect long-term outcomes and should be well-considered",
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
    navigate("/student/ehe/teens/reflex-teen-direction");
  };

  return (
    <GameShell
      title="Simulation: Career Decision"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-58"
      gameType="ehe"
      totalLevels={60}
      currentLevel={58}
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
            <div className="text-5xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Career Decision Simulator</h3>
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

export default SimulationCareerDecision;