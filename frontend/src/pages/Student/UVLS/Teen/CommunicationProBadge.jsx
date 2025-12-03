import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const CommunicationProBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-70";
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
      title: "Public Speaking Challenge",
      description: "You need to give a presentation. What's the best communication approach?",
      choices: [
        { 
          id: "a", 
          text: "Prepare thoroughly, practice, and engage the audience", 
          emoji: "🎤", 
          description: "Comprehensive preparation",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Wing it and hope for the best", 
          emoji: "😅", 
          description: "Not professional",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Read directly from slides without looking up", 
          emoji: "📄", 
          description: "Poor engagement",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Difficult Conversation",
      description: "You need to address a conflict with a peer. What's the best approach?",
      choices: [
        { 
          id: "b", 
          text: "Avoid the conversation completely", 
          emoji: "🙈", 
          description: "Doesn't resolve the issue",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Use 'I' statements, listen actively, and seek understanding", 
          emoji: "💬", 
          description: "Effective conflict communication",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Blame them and demand they change", 
          emoji: "😠", 
          description: "Not constructive",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Written Communication",
      description: "You need to write an important email. What's the best approach?",
      choices: [
        { 
          id: "a", 
          text: "Be clear, concise, professional, and proofread", 
          emoji: "📧", 
          description: "Professional communication",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Use all caps and lots of exclamation marks", 
          emoji: "❗", 
          description: "Unprofessional",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Write a very long, rambling message", 
          emoji: "📝", 
          description: "Not concise",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Active Listening",
      description: "Someone is sharing something important with you. What's the best approach?",
      choices: [
        { 
          id: "b", 
          text: "Interrupt with your own stories", 
          emoji: "🗣️", 
          description: "Not listening",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Check your phone while they talk", 
          emoji: "📱", 
          description: "Disrespectful",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Give full attention, ask clarifying questions, and reflect back what you heard", 
          emoji: "👂", 
          description: "Active listening skills",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Nonverbal Communication",
      description: "You're in an important meeting. What's the best nonverbal approach?",
      choices: [
        { 
          id: "a", 
          text: "Maintain eye contact, open posture, and appropriate gestures", 
          emoji: "👁️", 
          description: "Professional nonverbal communication",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Slouch, avoid eye contact, and fidget constantly", 
          emoji: "😔", 
          description: "Shows disengagement",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Stare intensely without blinking", 
          emoji: "👀", 
          description: "Uncomfortable and inappropriate",
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
      title="Communication Pro Badge"
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

export default CommunicationProBadge;
