import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const EmpathyChampionBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-10";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
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
      title: "Peer in Distress",
      description: "A classmate looks upset and withdrawn. They've been quiet all day. What's the best empathetic response?",
      choices: [
        { 
          id: "a", 
          text: "Ask if they're okay and offer to listen", 
          emoji: "💙", 
          description: "Shows care and offers support",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignore them to give space", 
          emoji: "🙈", 
          description: "They might need someone to reach out",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Tell them to cheer up", 
          emoji: "😐", 
          description: "Dismisses their feelings",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Cultural Misunderstanding",
      description: "Someone from a different culture does something that seems strange to you. How do you respond with empathy?",
      choices: [
        { 
          id: "b", 
          text: "Make fun of it with friends", 
          emoji: "😄", 
          description: "Hurts their feelings",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Ask them to help you understand their perspective", 
          emoji: "🤝", 
          description: "Shows respect and willingness to learn",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Avoid them", 
          emoji: "🚶", 
          description: "Doesn't help bridge understanding",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Exclusion Scenario",
      description: "You see someone being left out of a group activity. What's the empathetic action?",
      choices: [
        { 
          id: "a", 
          text: "Invite them to join your group", 
          emoji: "👥", 
          description: "Shows inclusion and empathy",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Pretend not to notice", 
          emoji: "🫥", 
          description: "Doesn't help the situation",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Laugh along with others", 
          emoji: "😄", 
          description: "Hurts the excluded person",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Sharing Personal Struggle",
      description: "A friend opens up about a family problem. They seem overwhelmed. How do you respond with empathy?",
      choices: [
        { 
          id: "c", 
          text: "Tell them your problems are worse", 
          emoji: "😤", 
          description: "Makes it about you",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Listen without judgment and validate their feelings", 
          emoji: "👂", 
          description: "Shows true empathy and support",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Change the subject quickly", 
          emoji: "🔄", 
          description: "Avoids their need for support",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Different Ability",
      description: "A peer with a different ability struggles with something you find easy. What's the empathetic response?",
      choices: [
        { 
          id: "b", 
          text: "Do it for them without asking", 
          emoji: "🙌", 
          description: "Takes away their agency",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore their struggle", 
          emoji: "🙈", 
          description: "Doesn't show empathy",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Offer help only if they want it, without pity", 
          emoji: "💪", 
          description: "Respects their autonomy and shows empathy",
          isCorrect: true
        }
      ]
    }
  ];

  const handleDecision = (choiceId) => {
    if (answered || showResult) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenario = scenarios[scenario];
    const selectedChoice = currentScenario.choices.find(c => c.id === choiceId);
    const isCorrect = selectedChoice?.isCorrect || false;
    
    const newDecisions = [...decisions, {
      scenarioId: currentScenario.id,
      choiceId,
      isCorrect
    }];
    setDecisions(newDecisions);
    
    if (isCorrect) {
      setFinalScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (scenario < scenarios.length - 1) {
        setScenario(prev => prev + 1);
        setAnswered(false);
        resetFeedback();
      } else {
        setShowResult(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentScenarioData = scenarios[scenario];

  return (
    <GameShell
      title="Empathy Champion Badge"
      subtitle={showResult ? "Badge Complete!" : `Scenario ${scenario + 1} of ${scenarios.length}`}
      score={finalScore}
      currentLevel={scenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
      showGameOver={showResult}
      maxScore={scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={showResult && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!showResult && currentScenarioData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {scenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentScenarioData.title}</h3>
              <p className="text-white/90 mb-6">{currentScenarioData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentScenarioData.choices.map(choice => {
                  const isSelected = decisions.find(d => d.scenarioId === currentScenarioData.id && d.choiceId === choice.id);
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
                      <div className="text-2xl mb-2">{choice.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{choice.text}</h4>
                      <p className="text-white/90 text-sm">{choice.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} correct!
                  You're an Empathy Champion!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} correct.
                  Practice empathy by trying to see situations from others' perspectives!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default EmpathyChampionBadge;
