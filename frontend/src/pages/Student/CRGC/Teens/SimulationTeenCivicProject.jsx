import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenCivicProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Project Planning",
      description: "Your teen team wants to run a campaign for safer school routes. How should you start?",
      options: [
        {
          id: "a",
          text: "Research the issue and create a plan",
          emoji: "📋",
          description: "That's right! Research and planning provide the foundation for an effective campaign.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Start posting on social media immediately",
          emoji: "📱",
          description: "That's not strategic. Starting without research and planning reduces the campaign's effectiveness.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let someone else handle it",
          emoji: "😴",
          description: "That's not leadership. Effective leaders take initiative and responsibility for important causes.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Team Coordination",
      description: "Team members have different ideas about campaign focus. How should you respond?",
      options: [
        {
          id: "a",
          text: "Facilitate discussion to find common ground",
          emoji: "🤝",
          description: "Perfect! Good leaders help teams find solutions that everyone can support.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Impose your own preferred approach",
          emoji: "👑",
          description: "That's not collaborative. Imposing your views can create division and reduce team effectiveness.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid making any decisions",
          emoji: "⏳",
          description: "That's not leadership. Avoiding decisions stalls progress and fails to serve the team's purpose.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Resource Management",
      description: "The campaign has limited funds and volunteers. How should you allocate resources?",
      options: [
        {
          id: "a",
          text: "Prioritize high-impact activities",
          emoji: "🎯",
          description: "That's right! Strategic resource allocation maximizes the campaign's effectiveness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend evenly on all activities",
          emoji: "💸",
          description: "That's not efficient. Equal spending regardless of impact wastes valuable resources.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use funds for personal expenses",
          emoji: "🛍️",
          description: "That's unethical. Campaign funds should be used exclusively for campaign purposes.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Community Engagement",
      description: "Local officials seem unresponsive to your campaign. What should you do?",
      options: [
        {
          id: "a",
          text: "Persist with respectful follow-up and broader outreach",
          emoji: "📞",
          description: "Perfect! Persistence and expanding outreach can help overcome initial resistance.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up on the campaign",
          emoji: "😔",
          description: "That's not perseverance. Effective civic engagement often requires sustained effort.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain publicly about officials",
          emoji: "😠",
          description: "That's not constructive. Public complaints without solutions don't advance the campaign's goals.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Campaign Success",
      description: "Your campaign successfully influences policy change. How should you celebrate?",
      options: [
        {
          id: "a",
          text: "Acknowledge everyone's contributions",
          emoji: "🎉",
          description: "That's right! Recognizing all contributors builds team morale and encourages future collaboration.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take personal credit for the success",
          emoji: "🏆",
          description: "That's not team leadership. Success is usually collective, and good leaders recognize their team.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Immediately start planning the next campaign",
          emoji: "🏃",
          description: "That's not balanced. Taking time to acknowledge success is important for team motivation.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Teen Civic Project"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-98"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentScenario().title}
          </h2>
          
          <p className="text-white/90 mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.scenario === currentScenario)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.scenario === currentScenario && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default SimulationTeenCivicProject;