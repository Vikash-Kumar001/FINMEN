import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenChoices = () => {
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
      title: "Coding Stereotypes",
      description: "Teen is told, 'Girls can't code.' Options: Believe it / Prove them wrong.",
      options: [
        {
          id: "a",
          text: "Believe the stereotype and give up on coding",
          emoji: "😔",
          description: "That's not empowering. Gender stereotypes shouldn't limit your interests or potential.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Prove them wrong by pursuing coding with determination",
          emoji: "💻",
          description: "That's right! Challenging stereotypes and pursuing your interests shows strength and resilience.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      title: "Career Aspirations",
      description: "A girl wants to become a CEO. Some say, 'Leadership is a man's job.' How should she respond?",
      options: [
        {
          id: "a",
          text: "Change her career goals to fit traditional expectations",
          emoji: "🔄",
          description: "That's not right. Career goals should be based on interests and abilities, not societal expectations.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pursue her goals while learning leadership skills",
          emoji: "👑",
          description: "Perfect! Leadership skills can be developed by anyone regardless of gender.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      title: "Sports Participation",
      description: "A boy wants to join the cheerleading team. Others mock him. What should he do?",
      options: [
        {
          id: "a",
          text: "Quit to avoid further teasing",
          emoji: "🏃",
          description: "That's not inclusive. Everyone should be able to participate in activities they enjoy regardless of gender norms.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Continue participating and ignore the negativity",
          emoji: "🎉",
          description: "Great choice! Pursuing your interests despite criticism shows courage and self-confidence.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Academic Interests",
      description: "A girl excels in physics but is told, 'Science is for boys.' How should she respond?",
      options: [
        {
          id: "a",
          text: "Switch to a 'more appropriate' subject for girls",
          emoji: "📚",
          description: "That's not right. Academic interests should be based on passion and aptitude, not gender stereotypes.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Continue studying physics and seek supportive mentors",
          emoji: "🔬",
          description: "Wonderful! Pursuing your academic interests with support from mentors helps break down barriers.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Leadership Opportunities",
      description: "A boy is nominated for student council president, but some say, 'Boys are too aggressive for leadership.' What should he do?",
      options: [
        {
          id: "a",
          text: "Withdraw from the race to avoid conflict",
          emoji: "🙅",
          description: "That's not empowering. Leadership qualities exist in people of all genders.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Run for office and demonstrate compassionate leadership",
          emoji: "🏛️",
          description: "Excellent! Demonstrating leadership skills helps challenge stereotypes and inspire others.",
          isCorrect: true
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
      title="Simulation: Teen Choices"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-28"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={28}
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

export default SimulationTeenChoices;