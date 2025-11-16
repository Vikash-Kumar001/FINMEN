import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCareerFair = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "You arrive at the career fair. What's your first move?",
      options: [
        {
          id: "a",
          text: "Ask questions and gather information",
          emoji: "❓",
          description: "Great! Active engagement helps you learn about different careers",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay silent and observe from a distance",
          emoji: "🤫",
          description: "Passive observation misses valuable opportunities to learn",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave early because it seems boring",
          emoji: "🚪",
          description: "Early departure prevents you from discovering interesting careers",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A representative from a tech company approaches you. How do you respond?",
      options: [
        {
          id: "a",
          text: "Ask about daily responsibilities and career path",
          emoji: "👨‍💻",
          description: "Perfect! Specific questions help you understand if this career fits you",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pretend to be busy and walk away",
          emoji: "🚶",
          description: "Missed opportunities prevent valuable career insights",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only ask about salary and benefits",
          emoji: "💰",
          description: "While important, focusing only on compensation misses other key factors",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You learn about a career that sounds interesting but you have no experience. What do you do?",
      options: [
        {
          id: "a",
          text: "Ask about education requirements and how to get started",
          emoji: "📚",
          description: "Excellent! Understanding pathways helps you plan your career journey",
          isCorrect: true
        },
        {
          id: "b",
          text: "Decide it's impossible and move on",
          emoji: "❌",
          description: "Every career has accessible entry points with proper planning",
          isCorrect: false
        },
        {
          id: "c",
          text: "Pretend you already know everything about it",
          emoji: "😎",
          description: "Honesty about your knowledge level leads to better guidance",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A representative offers you business cards and brochures. What's your approach?",
      options: [
        {
          id: "a",
          text: "Collect materials and take notes on key information",
          emoji: "📝",
          description: "Great! Documentation helps you remember and research later",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take everything without looking at it",
          emoji: "🗑️",
          description: "Unfocused collection wastes resources and learning opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Refuse because you're not interested",
          emoji: "🙅",
          description: "Even uninteresting materials might contain useful information",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After the fair, what's the best next step?",
      options: [
        {
          id: "a",
          text: "Review materials and follow up with interesting contacts",
          emoji: "✅",
          description: "Perfect! Follow-up converts fair experiences into real opportunities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Forget about it and do nothing",
          emoji: "😴",
          description: "Inaction wastes the time and effort invested in attending",
          isCorrect: false
        },
        {
          id: "c",
          text: "Immediately choose a career based on one conversation",
          emoji: "🎲",
          description: "Rushing decisions without reflection often lead to poor outcomes",
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
    navigate("/student/ehe/teens/reflex-future-check");
  };

  return (
    <GameShell
      title="Simulation: Career Fair"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-8"
      gameType="ehe"
      totalLevels={10}
      currentLevel={8}
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
            <h3 className="text-2xl font-bold text-white mb-2">Career Fair Simulator</h3>
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

export default SimulationCareerFair;