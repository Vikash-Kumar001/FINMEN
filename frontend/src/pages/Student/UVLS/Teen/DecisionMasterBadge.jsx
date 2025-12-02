import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const DecisionMasterBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-60";
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
      title: "Choosing a College Major",
      description: "You need to choose your college major. What's the best evidence-based decision approach?",
      choices: [
        { 
          id: "a", 
          text: "Research career outcomes, talk to professionals, and consider your interests", 
          emoji: "🔍", 
          description: "Gathers multiple types of evidence",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Pick the easiest major", 
          emoji: "😎", 
          description: "Ignores important evidence",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Choose based on what friends are doing", 
          emoji: "👥", 
          description: "Doesn't use personal evidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Buying Your First Car",
      description: "You're buying your first car. How do you make an evidence-based decision?",
      choices: [
        { 
          id: "b", 
          text: "Buy the first car you see", 
          emoji: "🚗", 
          description: "No evidence gathering",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Compare prices, check reliability ratings, test drive, and verify maintenance records", 
          emoji: "📊", 
          description: "Gathers comprehensive evidence",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Choose based on color only", 
          emoji: "🎨", 
          description: "Limited evidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Selecting a Summer Job",
      description: "You're choosing between summer jobs. What's the best evidence-based approach?",
      choices: [
        { 
          id: "a", 
          text: "Compare pay, work conditions, experience gained, and alignment with career goals", 
          emoji: "💰", 
          description: "Evaluates multiple evidence factors",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Take whichever job calls first", 
          emoji: "📞", 
          description: "No evidence evaluation",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Choose based on proximity only", 
          emoji: "📍", 
          description: "Limited evidence consideration",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Investing in Yourself",
      description: "You want to invest in a skill or course. How do you decide what's worth it?",
      choices: [
        { 
          id: "b", 
          text: "Pick the cheapest option", 
          emoji: "💸", 
          description: "Doesn't evaluate value",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Choose randomly", 
          emoji: "🎲", 
          description: "No evidence gathering",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Research success rates, read reviews, check credentials, and assess alignment with goals", 
          emoji: "📚", 
          description: "Comprehensive evidence evaluation",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Health Decision",
      description: "You're making a decision about your health or fitness. What's the evidence-based approach?",
      choices: [
        { 
          id: "a", 
          text: "Consult medical professionals, review scientific studies, and consider personal health data", 
          emoji: "🏥", 
          description: "Uses reliable evidence sources",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Follow random internet advice", 
          emoji: "🌐", 
          description: "Unreliable evidence",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Do nothing and hope for the best", 
          emoji: "🙈", 
          description: "Ignores evidence",
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
      title="Decision Master Badge"
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

export default DecisionMasterBadge;
