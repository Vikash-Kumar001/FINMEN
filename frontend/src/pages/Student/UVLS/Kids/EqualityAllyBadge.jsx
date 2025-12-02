import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EqualityAllyBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-30");
  const gameId = gameData?.id || "uvls-kids-30";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for EqualityAllyBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [scenario, setScenario] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Gender Stereotypes",
      description: "Someone says 'boys can't play with dolls' or 'girls can't play sports'. What do you do?",
      choices: [
        { 
          id: "speak", 
          text: "Speak up against unfairness", 
          emoji: "🗣️", 
          description: "Tell them everyone can do anything",
          isCorrect: true
        },
        { 
          id: "agree", 
          text: "Agree with them", 
          emoji: "👍", 
          description: "Say they're right",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Don't say anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Equal Opportunities",
      description: "You see someone being excluded from an activity because of who they are. What do you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Continue with your group",
          isCorrect: false
        },
        { 
          id: "include", 
          text: "Invite everyone to participate", 
          emoji: "🤝", 
          description: "Make sure all can join",
          isCorrect: true
        },
        { 
          id: "exclude", 
          text: "Exclude them more", 
          emoji: "🚫", 
          description: "Make sure they stay out",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Challenging Bias",
      description: "You hear someone making unfair assumptions about others. What do you do?",
      choices: [
        { 
          id: "agree", 
          text: "Agree with them", 
          emoji: "👍", 
          description: "Say they're right",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Don't get involved",
          isCorrect: false
        },
        { 
          id: "challenge", 
          text: "Challenge bias kindly", 
          emoji: "💬", 
          description: "Explain why it's not fair",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Supporting Dreams",
      description: "Someone is discouraged from their dream because of stereotypes. What do you do?",
      choices: [
        { 
          id: "discourage", 
          text: "Tell them to give up", 
          emoji: "😞", 
          description: "Say it's not possible",
          isCorrect: false
        },
        { 
          id: "encourage", 
          text: "Encourage their dreams", 
          emoji: "💪", 
          description: "Tell them they can achieve anything",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "🙈", 
          description: "Don't say anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Celebrating Diversity",
      description: "You see someone being made fun of for being different. What do you do?",
      choices: [
        { 
          id: "laugh", 
          text: "Laugh along", 
          emoji: "😂", 
          description: "Join in making fun",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Don't get involved",
          isCorrect: false
        },
        { 
          id: "celebrate", 
          text: "Celebrate their uniqueness", 
          emoji: "🌈", 
          description: "Show that differences are good",
          isCorrect: true
        }
      ]
    }
  ];

  const handleDecision = (selectedChoice) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[scenario];
    const isCorrect = currentScenarioData.choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    
    const newDecisions = [...decisions, { 
      scenarioId: currentScenarioData.id, 
      choice: selectedChoice,
      isCorrect: isCorrect
    }];
    
    setDecisions(newDecisions);
    
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

  const handleTryAgain = () => {
    setShowResult(false);
    setScenario(0);
    setDecisions([]);
    setFinalScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentScenario = () => scenarios[scenario];
  const totalGood = decisions.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Badge: Equality Ally"
      subtitle={!showResult ? `Scenario ${scenario + 1} of ${scenarios.length}` : "Quiz Complete!"}
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
      showConfetti={showResult && totalGood >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult && totalGood >= 3}
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
                {getCurrentScenario().choices.map(choice => {
                  const isCorrect = choice.isCorrect;
                  const isSelected = answered && decisions.some(d => d.scenarioId === scenarios[scenario].id && d.choice === choice.id);
                  
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleDecision(choice.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform ${
                        answered
                          ? isCorrect && isSelected
                            ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                            : isSelected && !isCorrect
                            ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                            : isCorrect
                            ? "bg-green-500/20 border-2 border-green-400"
                            : "bg-gray-500/20 border-2 border-gray-400 opacity-50"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{choice.emoji}</div>
                      <h4 className="font-bold text-xl mb-2">{choice.text}</h4>
                      <p className="text-white/90">{choice.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {totalGood >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Equality Ally Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {totalGood} out of {scenarios.length} correct!
                  You show great commitment to equality!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{totalGood} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being an equality ally means speaking up against unfairness, including everyone, challenging bias, supporting dreams, and celebrating diversity. You've shown you can be a great ally!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {totalGood} out of {scenarios.length} correct.
                  Remember: Being an equality ally means standing up for fairness and inclusion!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how you can support equality by speaking up, including everyone, challenging bias, and celebrating diversity!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EqualityAllyBadge;
