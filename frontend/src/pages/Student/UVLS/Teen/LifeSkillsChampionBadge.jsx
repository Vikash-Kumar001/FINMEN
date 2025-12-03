import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const LifeSkillsChampionBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-65";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [scenario, setScenario] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Budget Management",
      description: "You have $100 for the month. What's the best approach to manage it?",
      choices: [
        { 
          id: "a", 
          text: "Create a budget, track expenses, and prioritize needs over wants", 
          emoji: "💰", 
          description: "Comprehensive financial planning",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Spend it all immediately", 
          emoji: "💸", 
          description: "Poor financial management",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Save everything and spend nothing", 
          emoji: "🏦", 
          description: "Too restrictive, not balanced",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Time Management",
      description: "You have multiple deadlines this week. How do you handle it?",
      choices: [
        { 
          id: "b", 
          text: "Panic and do everything at the last minute", 
          emoji: "😰", 
          description: "Poor time management",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Prioritize tasks, create a schedule, and break work into manageable chunks", 
          emoji: "📅", 
          description: "Effective time management",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore deadlines and hope they go away", 
          emoji: "🙈", 
          description: "Avoidance, not management",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Conflict Resolution",
      description: "You have a disagreement with a friend. What's the best approach?",
      choices: [
        { 
          id: "a", 
          text: "Listen to their perspective, express your own calmly, and seek a compromise", 
          emoji: "🤝", 
          description: "Mature conflict resolution",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Argue until you win", 
          emoji: "😠", 
          description: "Not constructive",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Avoid them completely", 
          emoji: "🚶", 
          description: "Doesn't resolve the issue",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Goal Setting",
      description: "You want to achieve a long-term goal. What's the best strategy?",
      choices: [
        { 
          id: "b", 
          text: "Set an impossible goal with no plan", 
          emoji: "🎯", 
          description: "Unrealistic approach",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Never set goals, just go with the flow", 
          emoji: "🌊", 
          description: "Lacks direction",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Set SMART goals, break them into steps, and track progress", 
          emoji: "📈", 
          description: "Strategic goal achievement",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Stress Management",
      description: "You're feeling overwhelmed with responsibilities. How do you handle it?",
      choices: [
        { 
          id: "a", 
          text: "Identify stressors, use healthy coping strategies, and ask for help when needed", 
          emoji: "🧘", 
          description: "Healthy stress management",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignore stress and push through", 
          emoji: "💪", 
          description: "Can lead to burnout",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Give up on everything", 
          emoji: "😔", 
          description: "Not a solution",
          isCorrect: false
        }
      ]
    }
  ];

  const handleDecision = (selectedChoice) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const newDecisions = [...decisions, { 
      scenarioId: scenarios[scenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setDecisions(newDecisions);
    
    const isCorrect = scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setFinalScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    if (scenario < scenarios.length - 1) {
      setTimeout(() => {
        setScenario(prev => prev + 1);
        setAnswered(false);
        resetFeedback();
      }, 500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const getCurrentScenario = () => scenarios[scenario];

  return (
    <GameShell
      title="Life Skills Champion Badge"
      subtitle={showResult ? "Badge Complete!" : `Challenge ${scenario + 1} of ${scenarios.length}`}
      currentLevel={scenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="uvls"
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={showResult && finalScore >= 3}
    >
      <div className="text-center text-white space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!showResult && getCurrentScenario() && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="mb-4">
              <span className="text-white/80">Challenge {scenario + 1}/{scenarios.length}</span>
              <span className="text-yellow-400 font-bold ml-4">Score: {finalScore}/{scenarios.length}</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-4">{getCurrentScenario().title}</h3>
            <p className="text-white/90 text-lg mb-6">{getCurrentScenario().description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getCurrentScenario().choices.map(choice => {
                const isSelected = decisions.some(d => d.scenarioId === getCurrentScenario().id && d.choice === choice.id);
                const showCorrect = answered && choice.isCorrect;
                const showIncorrect = answered && isSelected && !choice.isCorrect;
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleDecision(choice.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                      showCorrect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : showIncorrect
                        ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : isSelected
                        ? "bg-blue-600 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="text-3xl mb-2">{choice.emoji}</div>
                    <h4 className="font-bold text-base mb-2">{choice.text}</h4>
                    <p className="text-white/90 text-sm">{choice.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LifeSkillsChampionBadge;
