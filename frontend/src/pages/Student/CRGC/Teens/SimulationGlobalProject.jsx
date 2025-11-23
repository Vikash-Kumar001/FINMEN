import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationGlobalProject = () => {
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
      title: "Online Collaboration",
      description: "Teens from different countries join an online project to create educational videos. How should they work together?",
      options: [
        {
          id: "a",
          text: "Collaborate respectfully and share ideas",
          emoji: "🤝",
          description: "That's right! Collaborating respectfully and sharing ideas leverages diverse perspectives for better outcomes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore teammates from other cultures",
          emoji: "🚫",
          description: "That's not helpful. Ignoring teammates wastes valuable perspectives and undermines the project's global nature.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Mock others' ideas and accents",
          emoji: "😤",
          description: "That's not right. Mocking others is disrespectful and creates a toxic environment that prevents success.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Cultural Misunderstanding",
      description: "A team member from another culture seems distant during video calls. What should you do?",
      options: [
        {
          id: "a",
          text: "Ask respectfully about their communication style",
          emoji: "💬",
          description: "Perfect! Asking respectfully about communication styles shows cultural sensitivity and helps build better teamwork.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Assume they're not interested",
          emoji: "😒",
          description: "That's not appropriate. Assuming negative intent without understanding cultural differences can harm collaboration.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Speak louder to make them participate",
          emoji: "📢",
          description: "That's not effective. Communication barriers often involve more than volume and require cultural understanding.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Time Zone Challenges",
      description: "The project requires meetings at times that are inconvenient for some team members. How should the group respond?",
      options: [
        {
          id: "a",
          text: "Rotate meeting times to share the burden",
          emoji: "🔄",
          description: "That's right! Rotating meeting times shows consideration for all team members and promotes fairness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Always meet at the most convenient time",
          emoji: "⏰",
          description: "That's not fair. Always meeting at one group's convenient time disadvantages others and creates inequality.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Exclude team members who can't attend",
          emoji: "❌",
          description: "That's not inclusive. Excluding team members undermines the collaborative spirit of global projects.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Different Work Styles",
      description: "Some team members prefer detailed planning while others prefer flexible approaches. How should the team handle this?",
      options: [
        {
          id: "a",
          text: "Find a balanced approach that respects all styles",
          emoji: "⚖️",
          description: "Perfect! Finding a balanced approach that respects different work styles maximizes team effectiveness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Insist everyone follow one approach",
          emoji: "🔨",
          description: "That's not collaborative. Insisting on one approach ignores the value of diverse work styles and reduces team effectiveness.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let each person work separately",
          emoji: "🙍",
          description: "That's not teamwork. The goal of collaboration is to work together, not in isolation.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Project Success",
      description: "The project is successful and receives recognition. How should the team celebrate?",
      options: [
        {
          id: "a",
          text: "Celebrate everyone's contributions equally",
          emoji: "🎉",
          description: "That's right! Celebrating everyone's contributions equally recognizes the value of diverse perspectives and efforts.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Credit only the most vocal members",
          emoji: "🗣️",
          description: "That's not fair. Recognizing only vocal members ignores quiet but valuable contributions from others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Don't celebrate at all",
          emoji: "😐",
          description: "That's not motivating. Celebrating success reinforces positive teamwork and encourages future collaboration.",
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
      title="Simulation: Global Project"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-88"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={88}
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

export default SimulationGlobalProject;