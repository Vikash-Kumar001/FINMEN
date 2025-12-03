import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MediatorBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-80");
  const gameId = gameData?.id || "uvls-kids-80";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MediatorBadge, using fallback ID");
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
      title: "Toy Dispute",
      description: "Two friends are fighting over a toy. How do you help?",
      choices: [
        { 
          id: "mediate", 
          text: "Help them find a fair solution", 
          emoji: "⚖️", 
          description: "Listen to both and suggest taking turns",
          isCorrect: true
        },
        { 
          id: "pick", 
          text: "Pick a winner", 
          emoji: "👆", 
          description: "Choose who gets the toy",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Let them fight", 
          emoji: "🙈", 
          description: "Stay out of it completely",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Game Argument",
      description: "Friends are arguing about game rules. What do you do?",
      choices: [
        { 
          id: "side", 
          text: "Take one side", 
          emoji: "👆", 
          description: "Support one friend over the other",
          isCorrect: false
        },
        { 
          id: "mediate", 
          text: "Help them agree on rules", 
          emoji: "🤝", 
          description: "Find a compromise that works for everyone",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Walk away", 
          emoji: "🚶", 
          description: "Leave them to figure it out",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Sharing Conflict",
      description: "Two friends both want the same snack. How do you help?",
      choices: [
        { 
          id: "give", 
          text: "Give it to one person", 
          emoji: "👆", 
          description: "Pick who gets it all",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Let them argue about it",
          isCorrect: false
        },
        { 
          id: "mediate", 
          text: "Suggest sharing equally", 
          emoji: "🍎", 
          description: "Help them split it fairly",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Team Disagreement",
      description: "Your team can't agree on a project idea. What do you do?",
      choices: [
        { 
          id: "force", 
          text: "Force your idea", 
          emoji: "😤", 
          description: "Make everyone use your idea",
          isCorrect: false
        },
        { 
          id: "mediate", 
          text: "Help combine ideas", 
          emoji: "💡", 
          description: "Find a way to use everyone's ideas",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Let them argue", 
          emoji: "🙈", 
          description: "Stay quiet and wait",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Playground Dispute",
      description: "Kids are fighting over who goes first. How do you help?",
      choices: [
        { 
          id: "pick", 
          text: "Pick someone", 
          emoji: "👆", 
          description: "Choose who goes first",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore the fight", 
          emoji: "🙈", 
          description: "Continue playing without them",
          isCorrect: false
        },
        { 
          id: "mediate", 
          text: "Suggest fair rotation", 
          emoji: "🔄", 
          description: "Help them take turns fairly",
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
      title="Badge: Mediator"
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

export default MediatorBadge;
