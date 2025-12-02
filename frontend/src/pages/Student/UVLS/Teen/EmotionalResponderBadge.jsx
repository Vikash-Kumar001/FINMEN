import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const EmotionalResponderBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-50";
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
      title: "Deep Breathing Strategy",
      description: "You're feeling overwhelmed by stress. How do you use deep breathing to regulate your emotions?",
      choices: [
        { 
          id: "a", 
          text: "Practice 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s", 
          emoji: "🧘", 
          description: "Proven breathing technique",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Hold your breath until you pass out", 
          emoji: "😤", 
          description: "Dangerous and ineffective",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore the stress completely", 
          emoji: "🙈", 
          description: "Doesn't address the emotion",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Physical Activity Strategy",
      description: "You're feeling anxious. How do you use physical activity to regulate your emotions?",
      choices: [
        { 
          id: "b", 
          text: "Stay completely still", 
          emoji: "🛑", 
          description: "Doesn't help with anxiety",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Go for a walk, do yoga, or exercise to release endorphins", 
          emoji: "🏃", 
          description: "Natural mood regulator",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Exhaust yourself completely", 
          emoji: "😵", 
          description: "Can cause burnout",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Social Support Strategy",
      description: "You're feeling sad and isolated. How do you use social support to regulate your emotions?",
      choices: [
        { 
          id: "a", 
          text: "Reach out to a trusted friend or family member for support", 
          emoji: "💙", 
          description: "Connection helps regulate emotions",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Isolate yourself completely", 
          emoji: "🚪", 
          description: "Increases isolation",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Avoid all human contact", 
          emoji: "🙈", 
          description: "Not helpful",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Creative Expression Strategy",
      description: "You're feeling frustrated. How do you use creative expression to regulate your emotions?",
      choices: [
        { 
          id: "b", 
          text: "Suppress all creative urges", 
          emoji: "🚫", 
          description: "Limits expression",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only watch others create", 
          emoji: "👀", 
          description: "Passive, not active",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Express through journaling, art, music, or writing", 
          emoji: "🎨", 
          description: "Healthy emotional outlet",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Mindfulness Strategy",
      description: "You're feeling scattered and unfocused. How do you use mindfulness to regulate your emotions?",
      choices: [
        { 
          id: "a", 
          text: "Practice present-moment awareness and meditation", 
          emoji: "🧘", 
          description: "Develops emotional awareness",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Constantly distract yourself", 
          emoji: "📱", 
          description: "Avoids facing emotions",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore your emotional state", 
          emoji: "🙈", 
          description: "Not mindful",
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
      title="Emotional Responder Badge"
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

export default EmotionalResponderBadge;
