import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenFight = () => {
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
      title: "Classroom Dispute",
      description: "Two classmates are arguing loudly over a group project grade. What do you do?",
      options: [
        {
          id: "a",
          text: "Join in the argument to take sides",
          emoji: "⚔️",
          description: "That's not helpful. Taking sides usually escalates conflicts and can make you part of the problem.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Approach them calmly and suggest they discuss it with the teacher",
          emoji: "🕊️",
          description: "That's right! Mediating by suggesting a constructive solution helps de-escalate the situation.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them and focus on your own work",
          emoji: "📖",
          description: "That's not ideal. Ignoring conflicts can allow them to escalate and disturb others.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Friendship Conflict",
      description: "Two friends are having a heated argument in the hallway. How do you respond?",
      options: [
        {
          id: "a",
          text: "Tell them to take their argument somewhere else",
          emoji: "📍",
          description: "That's not effective. Simply moving the argument doesn't address the underlying issue.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask each person to share their perspective and help them find common ground",
          emoji: "🤝",
          description: "Perfect! Facilitating understanding between both parties is an effective mediation approach.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Get other friends involved to pick sides",
          emoji: "👥",
          description: "That's not helpful. Involving more people usually complicates conflicts and can make them worse.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Online Dispute",
      description: "Two students are arguing in a group chat with increasingly hostile messages. What's your response?",
      options: [
        {
          id: "a",
          text: "Screenshot and share the argument with others for entertainment",
          emoji: "📸",
          description: "That's not appropriate. Sharing private conflicts without consent can escalate and embarrass those involved.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Privately message each person to understand their perspective and suggest a calm discussion",
          emoji: "💬",
          description: "Great choice! Private communication helps de-escalate and creates a safe space for resolution.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Post in the group chat telling them to stop being childish",
          emoji: "🤐",
          description: "That's not effective. Public criticism can make people defensive and escalate the conflict further.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Sports Team Conflict",
      description: "Two teammates are arguing after a loss, blaming each other for the result. How do you help?",
      options: [
        {
          id: "a",
          text: "Tell them they're both wrong and that the coach should handle it",
          emoji: "🏃",
          description: "That's not helpful. Dismissing both perspectives prevents resolution and can increase frustration.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Suggest they focus on what they can learn from the game to improve",
          emoji: "📈",
          description: "Wonderful! Redirecting focus to learning and improvement helps turn conflict into a growth opportunity.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Take sides based on your opinion of who was right",
          emoji: "🎯",
          description: "That's not constructive. Taking sides can create factions and prevent resolution of the underlying issue.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Group Project Conflict",
      description: "Team members are arguing about workload distribution, with accusations flying. What do you do?",
      options: [
        {
          id: "a",
          text: "Quit the group project to avoid the conflict",
          emoji: "🚪",
          description: "That's not a solution. Avoiding conflict prevents learning valuable collaboration skills.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Suggest everyone list their contributions and concerns, then work together on a fair plan",
          emoji: "📋",
          description: "Excellent! Facilitating structured communication helps address concerns and find equitable solutions.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Side with whoever you're closer to in the group",
          emoji: "👥",
          description: "That's not fair. Favoritism damages group dynamics and prevents objective conflict resolution.",
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
      title="Simulation: Teen Fight"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-48"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={48}
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

export default SimulationTeenFight;