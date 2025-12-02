import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const GenderJusticeLeaderBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-30";
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
      title: "Start a Gender Equality Club",
      description: "You want to start a club at school to promote gender equality. What's the best approach?",
      choices: [
        { 
          id: "a", 
          text: "Organize meetings, invite all students, and plan awareness activities", 
          emoji: "👥", 
          description: "Inclusive and organized approach",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Only invite your close friends", 
          emoji: "👫", 
          description: "Limits participation and impact",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Do nothing and wait for others to start it", 
          emoji: "⏳", 
          description: "Passive approach",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Challenge Gender Stereotypes in Class",
      description: "A teacher makes a comment reinforcing gender stereotypes. How do you lead a response?",
      choices: [
        { 
          id: "b", 
          text: "Ignore it completely", 
          emoji: "🙈", 
          description: "Doesn't address the issue",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Respectfully share examples that challenge the stereotype and suggest a discussion", 
          emoji: "💬", 
          description: "Leads by example and education",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Yell at the teacher", 
          emoji: "😠", 
          description: "Not respectful or effective",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Support Peer Career Ambitions",
      description: "A peer shares their career goal but others dismiss it due to gender. How do you lead support?",
      choices: [
        { 
          id: "a", 
          text: "Publicly support them, share resources, and organize peer encouragement", 
          emoji: "🚀", 
          description: "Strong leadership and support",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Stay quiet to avoid conflict", 
          emoji: "🤐", 
          description: "Doesn't help the peer",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Agree with the dismissive comments", 
          emoji: "👎", 
          description: "Reinforces the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Organize Equal Opportunity Event",
      description: "You want to organize an event promoting equal opportunities. What's the most effective approach?",
      choices: [
        { 
          id: "b", 
          text: "Plan it alone without input", 
          emoji: "👤", 
          description: "Less inclusive planning",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only focus on one gender", 
          emoji: "🚫", 
          description: "Defeats the purpose",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Form a diverse planning committee, include all voices, and create inclusive activities", 
          emoji: "🎯", 
          description: "Comprehensive and inclusive",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Create Mentorship Program",
      description: "You want to create a mentorship program to support gender equality. What's the best model?",
      choices: [
        { 
          id: "a", 
          text: "Match mentors and mentees across genders, provide training, and track progress", 
          emoji: "🤝", 
          description: "Comprehensive mentorship model",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Only mentor same-gender pairs", 
          emoji: "👫", 
          description: "Limits cross-gender understanding",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Start without any planning", 
          emoji: "🚀", 
          description: "Likely to fail without structure",
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
      title="Gender Justice Leader Badge"
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

export default GenderJusticeLeaderBadge;
