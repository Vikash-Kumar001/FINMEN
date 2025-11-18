import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenCitizen = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Witnessing Corruption",
      description: "A teen sees a government official accepting a bribe. What should they do?",
      options: [
        {
          id: "a",
          text: "Report it to the proper authorities",
          emoji: "📢",
          description: "That's right! Reporting corruption to anti-corruption agencies or through proper channels helps maintain integrity in governance.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in to get benefits",
          emoji: "💸",
          description: "That's not right. Participating in corruption perpetuates the problem and is illegal.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it completely",
          emoji: "🤐",
          description: "That's not helpful. Ignoring corruption allows it to continue and harm society.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Community Problem",
      description: "The teen notices garbage piling up in their neighborhood. How should they respond?",
      options: [
        {
          id: "a",
          text: "Organize a community clean-up and report to local authorities",
          emoji: "环卫",
          description: "Perfect! Taking initiative to solve community problems and involving authorities creates lasting positive change.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complain but do nothing else",
          emoji: "😤",
          description: "That's not productive. Complaints without action rarely lead to solutions.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Move to a different area",
          emoji: "🚶",
          description: "That's not a solution. Addressing community issues helps everyone, not just yourself.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Public Facility Misuse",
      description: "The teen sees people vandalizing public property. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Intervene peacefully or report the incident",
          emoji: "✋",
          description: "That's right! Peaceful intervention or reporting misuse helps protect public resources for everyone.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in for fun",
          emoji: "🤪",
          description: "That's not right. Vandalizing public property is illegal and harms the community.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Record it for social media",
          emoji: "📱",
          description: "That's not the best approach. While awareness is good, taking action or reporting is more constructive.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Inequality in School",
      description: "The teen notices some students being treated unfairly by teachers. How should they respond?",
      options: [
        {
          id: "a",
          text: "Address it with school authorities or counselors",
          emoji: "🏫",
          description: "Perfect! Reporting unfair treatment through proper channels helps create a more equitable environment for all students.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Encourage the unfair treatment",
          emoji: "😈",
          description: "That's not right. Supporting unfair treatment perpetuates discrimination and harms others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent to avoid getting involved",
          emoji: "😶",
          description: "That's not helpful. Speaking up against unfair treatment protects the rights of all students.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Environmental Violation",
      description: "The teen discovers a factory illegally dumping waste into a river. What should they do?",
      options: [
        {
          id: "a",
          text: "Report to environmental protection agencies",
          emoji: "🌍",
          description: "That's right! Reporting environmental violations to appropriate authorities helps protect our natural resources and public health.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it since it's not their problem",
          emoji: "🤷",
          description: "That's not responsible. Environmental protection is everyone's responsibility for the common good.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Post angry messages online without evidence",
          emoji: "💻",
          description: "That's not effective. Sharing unverified information can cause harm and doesn't solve the underlying issue.",
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
      title="Simulation: Teen Citizen"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-78"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={78}
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

export default SimulationTeenCitizen;