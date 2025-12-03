import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LifeSkillsStarterBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-100");
  const gameId = gameData?.id || "uvls-kids-100";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for LifeSkillsStarterBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [scenario, setScenario] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Planning Your Day",
      description: "You have many things to do today. What should you do?",
      choices: [
        { 
          id: "plan", 
          text: "Make a plan and prioritize", 
          emoji: "📋", 
          description: "Organize tasks by importance",
          isCorrect: true
        },
        { 
          id: "random", 
          text: "Do things randomly", 
          emoji: "🎲", 
          description: "Do whatever comes to mind",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore everything", 
          emoji: "🙈", 
          description: "Don't do anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Setting Goals",
      description: "You want to achieve something. What should you do?",
      choices: [
        { 
          id: "vague", 
          text: "Have vague dreams", 
          emoji: "☁️", 
          description: "Just wish for things",
          isCorrect: false
        },
        { 
          id: "set", 
          text: "Set clear, achievable goals", 
          emoji: "🎯", 
          description: "Make specific goals you can reach",
          isCorrect: true
        },
        { 
          id: "none", 
          text: "Have no goals", 
          emoji: "🚫", 
          description: "Don't plan anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Time Management",
      description: "You have limited time for homework and play. What should you do?",
      choices: [
        { 
          id: "onlyplay", 
          text: "Only play", 
          emoji: "🎮", 
          description: "Spend all time playing",
          isCorrect: false
        },
        { 
          id: "onlywork", 
          text: "Only do homework", 
          emoji: "📚", 
          description: "Work all the time",
          isCorrect: false
        },
        { 
          id: "balance", 
          text: "Balance both activities", 
          emoji: "⚖️", 
          description: "Plan time for work and fun",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Staying Safe",
      description: "You need to learn about safety. What should you do?",
      choices: [
        { 
          id: "learn", 
          text: "Learn safety rules", 
          emoji: "🛡️", 
          description: "Understand how to stay safe",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore safety", 
          emoji: "🙈", 
          description: "Don't think about safety",
          isCorrect: false
        },
        { 
          id: "risk", 
          text: "Take unnecessary risks", 
          emoji: "⚠️", 
          description: "Do dangerous things",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Life Skills",
      description: "You want to learn important life skills. What should you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Ignore learning", 
          emoji: "🙈", 
          description: "Don't try to learn",
          isCorrect: false
        },
        { 
          id: "giveup", 
          text: "Give up easily", 
          emoji: "😞", 
          description: "Stop trying when it's hard",
          isCorrect: false
        },
        { 
          id: "practice", 
          text: "Practice and learn regularly", 
          emoji: "📚", 
          description: "Keep learning new skills",
          isCorrect: true
        }
      ]
    }
  ];

  const handleDecision = (selectedChoice) => {
    const newDecisions = [...decisions, { 
      scenarioId: scenarios[scenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setDecisions(newDecisions);
    
    // If the choice is correct, show flash/confetti and update score
    const isCorrect = scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setFinalScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next scenario or show results
    if (scenario < scenarios.length - 1) {
      setTimeout(() => {
        setScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentScenario = () => scenarios[scenario];

  return (
    <GameShell
      title="Badge: Life Skills Starter"
      subtitle={showResult ? "Quiz Complete!" : `Scenario ${scenario + 1} of ${scenarios.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      gameType="uvls"
      totalLevels={scenarios.length}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      currentLevel={scenario + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && getCurrentScenario() ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {scenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentScenario().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentScenario().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleDecision(choice.id)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{choice.emoji}</div>
                    <h4 className="font-bold text-xl mb-2">{choice.text}</h4>
                    <p className="text-white/90">{choice.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default LifeSkillsStarterBadge;
