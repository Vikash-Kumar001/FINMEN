import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeamProject = () => {
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
      text: "Your team disagrees on the project direction. What's your approach?",
      options: [
        {
          id: "a",
          text: "Listen to all perspectives and find common ground",
          emoji: "👂",
          description: "Great! Effective leadership involves hearing all viewpoints and building consensus",
          isCorrect: true
        },
        {
          id: "b",
          text: "Shout over others to assert your opinion",
          emoji: "📢",
          description: "Aggressive communication damages team relationships and creativity",
          isCorrect: false
        },
        {
          id: "c",
          text: "Quit the project rather than deal with conflict",
          emoji: "🚪",
          description: "Avoiding challenges prevents growth and project completion",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A team member isn't contributing equally. How do you handle this?",
      options: [
        {
          id: "a",
          text: "Privately discuss expectations and offer support",
          emoji: "🤝",
          description: "Perfect! Addressing issues directly but kindly helps resolve problems constructively",
          isCorrect: true
        },
        {
          id: "b",
          text: "Publicly criticize their lack of effort",
          emoji: "😠",
          description: "Public criticism damages relationships and team morale",
          isCorrect: false
        },
        {
          id: "c",
          text: "Take on all the extra work yourself",
          emoji: "💪",
          description: "Overburdening yourself leads to burnout and doesn't solve the underlying issue",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The team is behind schedule. What's your solution?",
      options: [
        {
          id: "a",
          text: "Organize a meeting to reassess priorities and timeline",
          emoji: "📅",
          description: "Excellent! Structured problem-solving helps teams overcome obstacles efficiently",
          isCorrect: true
        },
        {
          id: "b",
          text: "Blame team members for the delay",
          emoji: "😠",
          description: "Blaming others creates defensiveness and doesn't solve scheduling issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Work alone to catch up without telling anyone",
          emoji: "🏃",
          description: "Working in isolation prevents team coordination and sustainable solutions",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Team members have different skill levels. How do you utilize this?",
      options: [
        {
          id: "a",
          text: "Assign tasks based on strengths and provide mentoring",
          emoji: "🎯",
          description: "Great! Leveraging diverse skills while supporting growth maximizes team potential",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give everyone the same tasks regardless of abilities",
          emoji: "🔄",
          description: "Ignoring skill differences wastes talent and creates inefficiencies",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let only the most skilled members do all the work",
          emoji: "👑",
          description: "Over-relying on top performers prevents others from developing and creates resentment",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The project is successful. How do you celebrate?",
      options: [
        {
          id: "a",
          text: "Acknowledge everyone's contributions and celebrate together",
          emoji: "🎉",
          description: "Perfect! Recognition builds team morale and strengthens future collaboration",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take all the credit yourself",
          emoji: "🏆",
          description: "Taking credit alone damages trust and team relationships",
          isCorrect: false
        },
        {
          id: "c",
          text: "Move immediately to the next project without acknowledgment",
          emoji: "⏩",
          description: "Celebrating successes motivates teams and builds positive momentum",
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
    navigate("/student/ehe/teens/reflex-teen-innovator");
  };

  return (
    <GameShell
      title="Simulation: Team Project"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-18"
      gameType="ehe"
      totalLevels={20}
      currentLevel={18}
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
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-white mb-2">Team Project Simulator</h3>
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

export default SimulationTeamProject;