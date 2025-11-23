import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationPeerTestSubstance = () => {
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
      title: "Party Pressure",
      description: "Friends offer you alcohol at a party. What do you do?",
      options: [
        {
          id: "a",
          text: "Politely decline and suggest a non-alcoholic drink",
          emoji: "🙅",
          description: "Firm refusal with an alternative shows confidence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take it to avoid standing out",
          emoji: "🍺",
          description: "Compromising values for acceptance is harmful",
          isCorrect: false
        },
        {
          id: "c",
          text: "Get angry and accuse friends of being bad influences",
          emoji: "😠",
          description: "Anger may escalate the situation unnecessarily",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Left Alone",
      description: "You're alone with someone offering drugs. What's your response?",
      options: [
        {
          id: "a",
          text: "Firmly say no and leave the situation",
          emoji: "🏃",
          description: "Removing yourself from risk is the safest choice",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try it just this once",
          emoji: "小心翼",
          description: "Even one time can have serious consequences",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask for just a small amount",
          emoji: "📏",
          description: "Any amount of illegal substances is risky",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Group Situation",
      description: "Everyone at a gathering is smoking. How do you handle it?",
      options: [
        {
          id: "a",
          text: "Move to a different area and breathe fresh air",
          emoji: "🌬️",
          description: "Protecting your health is the priority",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in to fit in with the group",
          emoji: "👥",
          description: "True friends respect your health choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about others smoking",
          emoji: "😤",
          description: "Confrontation may create unnecessary conflict",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Ride Request",
      description: "Friends who've been drinking ask you for a ride home. What do you do?",
      options: [
        {
          id: "a",
          text: "Refuse and call them a taxi or rideshare",
          emoji: "🚕",
          description: "Enabling impaired driving endangers everyone",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drive them despite your concerns",
          emoji: "🚗",
          description: "Driving under influence risks lives",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave them stranded",
          emoji: "🚶",
          description: "Ensuring safety doesn't mean abandoning friends",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Social Media",
      description: "Friends post photos of substance use online. How do you respond?",
      options: [
        {
          id: "a",
          text: "Don't engage and change your social circle",
          emoji: "📵",
          description: "Your social environment affects your choices",
          isCorrect: true
        },
        {
          id: "b",
          text: "Like the posts to stay popular",
          emoji: "👍",
          description: "Approval encourages continued harmful behavior",
          isCorrect: false
        },
        {
          id: "c",
          text: "Publicly shame them online",
          emoji: "📢",
          description: "Private conversation is more constructive",
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
    navigate("/student/health-female/teens/reflex-teen-safety");
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
      gameId="health-female-teen-88"
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

export default SimulationPeerTestSubstance;