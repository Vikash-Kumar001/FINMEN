import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCleanUpDrive = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Park Clean-Up",
      description: "Teen group sees garbage scattered throughout a local park. What should they do?",
      options: [
        {
          id: "a",
          text: "Organize a community clean-up event",
          emoji: " volunte",
          description: "That's right! Organizing a clean-up brings people together to address the problem effectively and creates positive community impact.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Walk away and let someone else handle it",
          emoji: "🚶",
          description: "That's not helpful. Taking initiative to address community issues is part of being a responsible citizen.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame the city for not maintaining the park properly",
          emoji: "😠",
          description: "That's not constructive. While municipalities have responsibilities, community members can also take positive action.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Beach Pollution",
      description: "The group discovers plastic waste polluting a nearby beach. How should they respond?",
      options: [
        {
          id: "a",
          text: "Document the issue and contact environmental organizations",
          emoji: "📱",
          description: "Perfect! Documenting the problem and connecting with experts helps address the issue at both local and systemic levels.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Post angry messages on social media about the pollution",
          emoji: "💻",
          description: "That's not effective. While raising awareness is important, constructive action is more valuable than just expressing anger.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Decide it's not their problem and go home",
          emoji: "😴",
          description: "That's not responsible. Environmental issues affect everyone, and taking action helps protect shared resources.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "School Grounds",
      description: "They notice litter accumulating around their school. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Start a regular clean-up schedule and educate classmates",
          emoji: "📅",
          description: "That's right! Creating ongoing solutions and raising awareness helps prevent future littering and builds environmental responsibility.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complain to teachers without offering solutions",
          emoji: "😤",
          description: "That's not productive. Offering solutions along with concerns is more likely to lead to positive change.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it since it's the school's responsibility",
          emoji: "🤷",
          description: "That's not community-minded. Taking ownership of shared spaces helps create a better environment for everyone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Neighborhood Cleanup",
      description: "During their clean-up, they find hazardous materials like broken glass and chemicals. What should they do?",
      options: [
        {
          id: "a",
          text: "Contact local authorities for proper disposal",
          emoji: "📞",
          description: "Perfect! Hazardous materials require special handling, and contacting authorities ensures safe and proper disposal.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try to dispose of hazardous items themselves",
          emoji: "⚠️",
          description: "That's not safe. Hazardous materials can be dangerous and should only be handled by trained professionals.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave hazardous items and only collect regular trash",
          emoji: "🗑️",
          description: "That's not responsible. Properly addressing hazardous materials prevents harm to people and the environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Community Engagement",
      description: "Their clean-up efforts attract media attention. How should they handle the publicity?",
      options: [
        {
          id: "a",
          text: "Use the attention to encourage others to volunteer",
          emoji: "📢",
          description: "That's right! Leveraging positive attention to inspire others amplifies the impact of their community service efforts.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid media and keep their efforts private",
          emoji: "🤫",
          description: "That's not strategic. Sharing positive community actions can inspire others and create broader social impact.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus attention on themselves rather than the cause",
          emoji: "👑",
          description: "That's not the purpose. Community service is about helping others and improving society, not personal recognition.",
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
      title="Simulation: Clean-Up Drive"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-58"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={58}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
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

export default SimulationCleanUpDrive;