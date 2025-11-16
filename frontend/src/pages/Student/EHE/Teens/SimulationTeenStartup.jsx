import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenStartup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "As a teen entrepreneur, you must choose between two product options for your startup:",
      options: [
        
        {
          id: "b",
          text: "Safe, eco-friendly product with higher costs",
          emoji: "🌱",
          description: "Perfect! Sustainable products build long-term customer loyalty and brand value",
          isCorrect: true
        },
        {
          id: "a",
          text: "Cheap product that harms the environment",
          emoji: "💰",
          description: "Short-term profits but long-term damage to environment and reputation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy a competitor's product exactly",
          emoji: "📋",
          description: "This could lead to legal issues and doesn't create unique value",
          isCorrect: false
        },
        {
          id: "b",
          text: "Emphasize your unique value proposition and quality",
          emoji: "✨",
          description: "Exactly! Focus on what makes your product and mission unique",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Your startup receives investment offers from two sources:",
      options: [
        {
          id: "a",
          text: "Investor who demands quick returns and cost-cutting",
          emoji: "⏱️",
          description: "Pressure for quick returns may compromise quality and sustainability",
          isCorrect: false
        },
        {
          id: "b",
          text: "Patient investor who supports your mission",
          emoji: "🎯",
          description: "Exactly! Mission-aligned investors support long-term sustainable growth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Investor who wants to control all decisions",
          emoji: "👑",
          description: "Losing control of your startup defeats the purpose of entrepreneurship",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you price your eco-friendly product?",
      options: [
        {
          id: "a",
          text: "Extremely high to maximize profit per unit",
          emoji: "💎",
          description: "High prices may limit market access and social impact",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balanced pricing that covers costs and allows growth",
          emoji: "⚖️",
          description: "Perfect! Balanced pricing ensures sustainability while maximizing social impact",
          isCorrect: true
        },
        {
          id: "c",
          text: "Below cost to gain market share quickly",
          emoji: "📉",
          description: "Selling below cost is unsustainable and can harm the business long-term",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A competitor launches a similar product at a lower price. How do you respond?",
      options: [
        {
          id: "a",
          text: "Lower your prices to match, even if it means cutting quality",
          emoji: "⬇️",
          description: "Compromising quality can damage your reputation and long-term success",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Give up and quit the market",
          emoji: "🏳️",
          description: "Persistence and differentiation are key to entrepreneurial success",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should you measure your startup's success?",
      options: [
        {
          id: "a",
          text: "Only financial metrics like revenue and profit",
          emoji: "📊",
          description: "Financial metrics are important but not the only measure of success",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balanced metrics including social impact and sustainability",
          emoji: "🌍",
          description: "Perfect! True success includes financial sustainability and positive social impact",
          isCorrect: true
        },
        {
          id: "c",
          text: "Number of social media followers only",
          emoji: "📱",
          description: "Social media presence helps but isn't a comprehensive measure of success",
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
    navigate("/student/ehe/teens/reflex-teen-responsibility");
  };

  return (
    <GameShell
      title="Simulation: Teen Startup"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-88"
      gameType="ehe"
      totalLevels={90}
      currentLevel={88}
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
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Startup Simulator</h3>
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

export default SimulationTeenStartup;