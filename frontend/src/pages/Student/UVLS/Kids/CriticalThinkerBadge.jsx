import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CriticalThinkerBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-60");
  const gameId = gameData?.id || "uvls-kids-60";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CriticalThinkerBadge, using fallback ID");
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
      title: "Making a Decision",
      description: "You need to choose between two options. What should you do?",
      choices: [
        { 
          id: "think", 
          text: "Think about pros and cons", 
          emoji: "🤔", 
          description: "Consider both options carefully",
          isCorrect: true
        },
        { 
          id: "random", 
          text: "Pick randomly", 
          emoji: "🎲", 
          description: "Choose without thinking",
          isCorrect: false
        },
        { 
          id: "first", 
          text: "Choose the first option", 
          emoji: "👆", 
          description: "Always pick the first thing",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Hearing Information",
      description: "Someone tells you something that sounds too good to be true. What do you do?",
      choices: [
        { 
          id: "believe", 
          text: "Believe immediately", 
          emoji: "👍", 
          description: "Trust everything you hear",
          isCorrect: false
        },
        { 
          id: "question", 
          text: "Question and verify", 
          emoji: "❓", 
          description: "Ask questions and check if it's true",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it completely", 
          emoji: "🙈", 
          description: "Don't think about it",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Solving a Problem",
      description: "You face a difficult problem. What's the best approach?",
      choices: [
        { 
          id: "giveup", 
          text: "Give up immediately", 
          emoji: "😞", 
          description: "Stop trying right away",
          isCorrect: false
        },
        { 
          id: "guess", 
          text: "Guess randomly", 
          emoji: "🎲", 
          description: "Try anything without thinking",
          isCorrect: false
        },
        { 
          id: "analyze", 
          text: "Break it into steps", 
          emoji: "🔍", 
          description: "Think step by step to solve it",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Evaluating Choices",
      description: "You need to decide what's right or wrong. What do you do?",
      choices: [
        { 
          id: "impulse", 
          text: "Act on impulse", 
          emoji: "⚡", 
          description: "Do the first thing that comes to mind",
          isCorrect: false
        },
        { 
          id: "consider", 
          text: "Consider consequences", 
          emoji: "⚖️", 
          description: "Think about what will happen",
          isCorrect: true
        },
        { 
          id: "copy", 
          text: "Copy others", 
          emoji: "👥", 
          description: "Do what everyone else does",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Learning from Mistakes",
      description: "You made a mistake. What should you do?",
      choices: [
        { 
          id: "blame", 
          text: "Blame others", 
          emoji: "👆", 
          description: "Say it's someone else's fault",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore the mistake", 
          emoji: "🙈", 
          description: "Pretend it didn't happen",
          isCorrect: false
        },
        { 
          id: "learn", 
          text: "Learn from it", 
          emoji: "📚", 
          description: "Think about what went wrong and improve",
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
      title="Badge: Critical Thinker"
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

export default CriticalThinkerBadge;
