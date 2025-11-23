import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationPeerTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Dress Teasing",
      description: "Friends tease a girl for her simple dress. What do you do?",
      options: [
        {
          id: "a",
          text: "Defend her and tell friends to stop",
          emoji: "🛡️",
          description: "Standing up for others shows character and empathy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay silent to avoid conflict",
          emoji: "🤐",
          description: "Silence enables bullying and hurts the victim",
          isCorrect: false
        },
        {
          id: "c",
          text: "Join them to fit in",
          emoji: "👥",
          description: "Participating in teasing is harmful and wrong",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Academic Help",
      description: "A classmate struggles with homework. What's your response?",
      options: [
        {
          id: "a",
          text: "Ignore them and focus only on yourself",
          emoji: "📱",
          description: "Selfishness damages community and friendships",
          isCorrect: false
        },
        {
          id: "b",
          text: "Offer to help or study together",
          emoji: "🤝",
          description: "Helping others builds positive relationships",
          isCorrect: true
        },
        {
          id: "c",
          text: "Make fun of their struggles",
          emoji: "😂",
          description: "Mocking others is hurtful and unkind",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Social Exclusion",
      description: "Friends plan to exclude someone from a group activity. What do you do?",
      options: [
        {
          id: "a",
          text: "Go along with the plan to keep friends happy",
          emoji: "😊",
          description: "Compromising values for acceptance is harmful",
          isCorrect: false
        },
        {
          id: "b",
          text: "Speak up for inclusion and invite everyone",
          emoji: "🤗",
          description: "Inclusivity creates a positive environment for all",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid the situation entirely",
          emoji: "🏃",
          description: "Avoidance doesn't solve the problem or help anyone",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Cheating Temptation",
      description: "Friends ask you to share answers during a test. What's your choice?",
      options: [
        {
          id: "a",
          text: "Share answers to be a good friend",
          emoji: "📋",
          description: "Enabling dishonesty harms everyone involved",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refuse and encourage honest effort",
          emoji: "✅",
          description: "Integrity is essential for personal growth and trust",
          isCorrect: true
        },
        {
          id: "c",
          text: "Report them to the teacher",
          emoji: "👩‍🏫",
          description: "Direct confrontation is usually more constructive first",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Cyberbullying",
      description: "You see friends posting mean comments online. What do you do?",
      options: [
        {
          id: "a",
          text: "Like or share the comments for popularity",
          emoji: "👍",
          description: "Participating amplifies harm and encourages more bullying",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore it completely",
          emoji: "🙈",
          description: "Inaction allows harm to continue unchecked",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell them to stop and report serious threats",
          emoji: "✋",
          description: "Addressing cyberbullying protects victims and educates peers",
          isCorrect: true
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

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-esteem");
  };

  return (
    <GameShell
      title="Simulation: Peer Test"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-68"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SimulationPeerTest;