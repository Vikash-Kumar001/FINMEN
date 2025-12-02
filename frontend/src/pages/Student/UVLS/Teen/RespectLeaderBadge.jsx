import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const RespectLeaderBadge = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-20";
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
      title: "Leading Inclusion Initiative",
      description: "You want to organize an inclusion event at school. Some students say it's not necessary. How do you lead?",
      choices: [
        { 
          id: "a", 
          text: "Listen to concerns, explain benefits, and invite everyone to participate", 
          emoji: "🤝", 
          description: "Shows inclusive leadership",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Force everyone to participate", 
          emoji: "👆", 
          description: "Too controlling",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Give up and cancel the event", 
          emoji: "🚶", 
          description: "Doesn't show leadership",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Mentoring a Peer",
      description: "A peer feels excluded. They're hesitant about joining activities. How do you mentor them?",
      choices: [
        { 
          id: "b", 
          text: "Tell them to just get over it", 
          emoji: "😐", 
          description: "Not supportive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Offer to attend activities together and provide ongoing support", 
          emoji: "💙", 
          description: "Shows genuine mentorship",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore their hesitation", 
          emoji: "🙈", 
          description: "Doesn't address their needs",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Challenging Discrimination",
      description: "You witness discriminatory behavior. Someone is being treated unfairly based on their background. How do you respond as a leader?",
      choices: [
        { 
          id: "a", 
          text: "Speak up safely, report it, and support the affected person", 
          emoji: "🛡️", 
          description: "Shows courageous leadership",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Stay quiet to avoid conflict", 
          emoji: "🤐", 
          description: "Doesn't show leadership",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Join in the discrimination", 
          emoji: "😞", 
          description: "Wrong choice",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Creating Inclusive Content",
      description: "You're creating content to promote inclusion. How do you ensure it's truly inclusive?",
      choices: [
        { 
          id: "c", 
          text: "Only feature one group", 
          emoji: "👥", 
          description: "Not inclusive",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Include diverse voices and perspectives in the creation process", 
          emoji: "🎨", 
          description: "Ensures true inclusion",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Create it alone without input", 
          emoji: "🚫", 
          description: "Misses diverse perspectives",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Facilitating Dialogue",
      description: "You're facilitating a discussion about inclusion. People have strong, conflicting opinions. How do you lead?",
      choices: [
        { 
          id: "a", 
          text: "Create safe space for respectful dialogue, ensure everyone is heard", 
          emoji: "💬", 
          description: "Shows excellent facilitation",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Let one person dominate the conversation", 
          emoji: "👑", 
          description: "Not fair",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Avoid the difficult topics", 
          emoji: "🙈", 
          description: "Doesn't address issues",
          isCorrect: false
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
      title="Respect Leader Badge"
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
                  You're a Respect Leader!
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
                  Practice leadership skills by supporting inclusion and respect!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default RespectLeaderBadge;
