import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenJusticeAct = () => {
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
      title: "Classroom Slurs",
      description: "A teen hears classmates making slurs against a new student because of their accent. What should they do?",
      options: [
        {
          id: "a",
          text: "Speak up and defend the student",
          emoji: "🗣️",
          description: "That's right! Speaking up against discrimination shows courage and helps create an inclusive environment for everyone.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay silent to avoid conflict",
          emoji: "🤐",
          description: "That's not helpful. Staying silent allows discrimination to continue and can make the targeted student feel isolated.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Join in to fit in with the group",
          emoji: "👥",
          description: "That's not right. Participating in discrimination harms others and compromises your own values and integrity.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Workplace Inequality",
      description: "The teen notices that female employees are consistently given less challenging assignments than male colleagues. How should they respond?",
      options: [
        {
          id: "a",
          text: "Document the pattern and discuss with supervisor",
          emoji: "📋",
          description: "Perfect! Documenting patterns of inequality and addressing them with appropriate authorities is a responsible approach.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it since it's not their responsibility",
          emoji: "😴",
          description: "That's not responsible. When we witness injustice, we have a moral obligation to help address it appropriately.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Publicly accuse the company without evidence",
          emoji: "📢",
          description: "That's not effective. Making accusations without evidence can harm innocent parties and doesn't solve the underlying issue.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Community Exclusion",
      description: "The teen observes that people with disabilities are excluded from community events. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Advocate for inclusive event planning",
          emoji: "🤝",
          description: "That's right! Advocating for inclusive practices ensures everyone can participate and feel valued in the community.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Accept it as normal",
          emoji: "😔",
          description: "That's not acceptable. Exclusion based on disability violates principles of equality and human dignity.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain but do nothing constructive",
          emoji: "😤",
          description: "That's not productive. Constructive action is needed to create positive change rather than just expressing dissatisfaction.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Online Harassment",
      description: "The teen sees someone being cyberbullied for their political views on social media. How should they respond?",
      options: [
        {
          id: "a",
          text: "Stand up for the person and report harassment",
          emoji: "🛡️",
          description: "Perfect! Supporting someone being harassed and reporting violations helps create a safer online environment for everyone.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in since everyone else is doing it",
          emoji: "📲",
          description: "That's not right. Participating in harassment causes real harm and makes you complicit in the injustice.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Block the posts and ignore the situation",
          emoji: "📵",
          description: "That's not sufficient. While self-protection is important, ignoring injustice allows it to continue unchecked.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Systemic Bias",
      description: "The teen learns about systemic bias in their school's disciplinary system. What should be their response?",
      options: [
        {
          id: "a",
          text: "Research the issue and propose reforms",
          emoji: "🔍",
          description: "That's right! Researching systemic issues and proposing evidence-based reforms is an effective way to create lasting change.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Assume the system must be fair",
          emoji: "🤔",
          description: "That's not responsible. Assuming fairness without examining evidence can perpetuate existing injustices.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Rebel against all authority",
          emoji: "💣",
          description: "That's not constructive. Effective change comes through informed advocacy and working within systems to improve them.",
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
      title="Simulation: Teen Justice Act"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-68"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={68}
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

export default SimulationTeenJusticeAct;