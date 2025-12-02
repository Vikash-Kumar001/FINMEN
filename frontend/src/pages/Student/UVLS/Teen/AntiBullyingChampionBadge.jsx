import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const AntiBullyingChampionBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-40";
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
      title: "Report Bullying Incident",
      description: "You witness someone being bullied. What's the most effective sustained action?",
      choices: [
        { 
          id: "a", 
          text: "Report to trusted adults, support the victim, and follow up to ensure safety", 
          emoji: "🛡️", 
          description: "Comprehensive anti-bullying action",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignore the situation", 
          emoji: "🙈", 
          description: "Doesn't help",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Join in the bullying", 
          emoji: "👥", 
          description: "Wrong and harmful",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Create Awareness Campaign",
      description: "You want to create ongoing awareness about bullying prevention. What's the best approach?",
      choices: [
        { 
          id: "b", 
          text: "Do nothing", 
          emoji: "🚫", 
          description: "No impact",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Organize regular workshops, peer presentations, and awareness activities throughout the year", 
          emoji: "📢", 
          description: "Sustained awareness campaign",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "One-time announcement", 
          emoji: "📢", 
          description: "Limited impact",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Support Bullying Victims",
      description: "How do you provide sustained support to someone who has been bullied?",
      choices: [
        { 
          id: "a", 
          text: "Check in regularly, offer ongoing support, and help them build resilience", 
          emoji: "💙", 
          description: "Long-term supportive approach",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Support once and forget", 
          emoji: "👋", 
          description: "Not sustained",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Blame the victim", 
          emoji: "👆", 
          description: "Harmful",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Prevent Future Bullying",
      description: "How do you help prevent bullying from happening again?",
      choices: [
        { 
          id: "b", 
          text: "Do nothing preventive", 
          emoji: "🚫", 
          description: "No prevention",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Wait for it to happen again", 
          emoji: "⏳", 
          description: "Reactive, not preventive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Advocate for school policies, promote inclusion, and model respectful behavior consistently", 
          emoji: "🌱", 
          description: "Comprehensive prevention",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Build Anti-Bullying Community",
      description: "How do you build a community that actively works against bullying?",
      choices: [
        { 
          id: "a", 
          text: "Start peer support groups, organize regular meetings, and create safe spaces for discussion", 
          emoji: "🤝", 
          description: "Community-building approach",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Work alone", 
          emoji: "👤", 
          description: "Limited impact",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Encourage exclusion", 
          emoji: "🚫", 
          description: "Counterproductive",
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
      title="Anti-Bullying Champion Badge"
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

export default AntiBullyingChampionBadge;
