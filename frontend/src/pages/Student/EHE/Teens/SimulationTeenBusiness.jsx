import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenBusiness = () => {
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
      text: "You run an online store selling handmade crafts. An order arrives but you realize you're out of stock on a key material. What do you do?",
      options: [
        {
          id: "a",
          text: "Deliver on time by finding alternatives or explaining the delay",
          emoji: "✅",
          description: "Great! Honesty and problem-solving maintain customer trust and relationships",
          isCorrect: true
        },
        {
          id: "b",
          text: "Delay the order without communication",
          emoji: "⏰",
          description: "Poor communication damages customer relationships and business reputation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Quit the business because of this challenge",
          emoji: "🏳️",
          description: "Challenges are opportunities to learn and improve, not reasons to give up",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Sales are slow for a week. How do you respond?",
      options: [
        {
          id: "a",
          text: "Analyze what's working and adjust your approach",
          emoji: "📊",
          description: "Perfect! Data-driven decisions help improve business performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic and make random changes",
          emoji: "😰",
          description: "Reactive decisions without analysis often make problems worse",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the problem and hope it resolves itself",
          emoji: "🙈",
          description: "Proactive problem-solving is essential for business success",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A customer leaves a negative review. What's your approach?",
      options: [
        {
          id: "a",
          text: "Respond professionally and try to resolve their issue",
          emoji: "🤝",
          description: "Excellent! Professional responses can turn negative experiences into positive ones",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the review or respond angrily",
          emoji: "😡",
          description: "Ignoring or reacting negatively to feedback damages business reputation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Remove the review from your site",
          emoji: "🗑️",
          description: "Authentic feedback, even negative, builds trust with potential customers",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You receive an unexpected large order. How do you handle it?",
      options: [
        {
          id: "a",
          text: "Assess your capacity and communicate clearly about timelines",
          emoji: "📅",
          description: "Great! Clear communication and realistic planning ensure customer satisfaction",
          isCorrect: true
        },
        {
          id: "b",
          text: "Accept without checking if you can deliver",
          emoji: "🤯",
          description: "Overpromising leads to disappointed customers and damaged reputation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Reject it because it seems challenging",
          emoji: "❌",
          description: "Challenging opportunities can lead to growth when handled properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your business is growing. What's your next priority?",
      options: [
        {
          id: "a",
          text: "Plan for sustainable growth and maintain quality",
          emoji: "🌱",
          description: "Perfect! Sustainable growth ensures long-term business success",
          isCorrect: true
        },
        {
          id: "b",
          text: "Grow as fast as possible regardless of quality",
          emoji: "💨",
          description: "Rapid growth without quality control can damage the business",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stop growing to avoid complications",
          emoji: "🛑",
          description: "Growth is generally positive when managed properly",
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
    navigate("/student/ehe/teens/reflex-teen-boss");
  };

  return (
    <GameShell
      title="Simulation: Teen Business"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-48"
      gameType="ehe"
      totalLevels={50}
      currentLevel={48}
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
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Business Simulator</h3>
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

export default SimulationTeenBusiness;