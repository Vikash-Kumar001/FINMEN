import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerProtectorBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-40");
  const gameId = gameData?.id || "uvls-kids-40";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PeerProtectorBadge, using fallback ID");
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
      title: "Witnessing Bullying",
      description: "You see someone being bullied. What do you do?",
      choices: [
        { 
          id: "report", 
          text: "Report to an adult", 
          emoji: "📢", 
          description: "Tell a teacher or parent immediately",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Pretend you didn't see anything",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Laugh along", 
          emoji: "😂", 
          description: "Join in with the bullies",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Friend Being Teased",
      description: "Your friend is being teased repeatedly. What do you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Stay out of it", 
          emoji: "🙈", 
          description: "Don't get involved",
          isCorrect: false
        },
        { 
          id: "support", 
          text: "Support and stand up for them", 
          emoji: "🛡️", 
          description: "Defend your friend and get help",
          isCorrect: true
        },
        { 
          id: "join", 
          text: "Join the teasing", 
          emoji: "😏", 
          description: "Tease them too",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Online Bullying",
      description: "You see mean messages being sent to someone online. What do you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Scroll past and do nothing",
          isCorrect: false
        },
        { 
          id: "share", 
          text: "Share the messages", 
          emoji: "📤", 
          description: "Forward the mean messages",
          isCorrect: false
        },
        { 
          id: "report", 
          text: "Report and block", 
          emoji: "🚫", 
          description: "Report the bullying and block the bully",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Someone Excluded",
      description: "You see someone being left out on purpose. What do you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Continue with your friends",
          isCorrect: false
        },
        { 
          id: "include", 
          text: "Include them", 
          emoji: "🤝", 
          description: "Invite them to join your group",
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
      id: 5,
      title: "Physical Bullying",
      description: "You see someone being pushed or hit. What do you do?",
      choices: [
        { 
          id: "help", 
          text: "Get adult help immediately", 
          emoji: "🆘", 
          description: "Find a teacher or adult right away",
          isCorrect: true
        },
        { 
          id: "watch", 
          text: "Watch from a distance", 
          emoji: "👀", 
          description: "Just observe what happens",
          isCorrect: false
        },
        { 
          id: "join", 
          text: "Join in the fighting", 
          emoji: "👊", 
          description: "Fight back physically",
          isCorrect: false
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
      title="Badge: Peer Protector"
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
                <h3 className="text-2xl font-bold text-white mb-4">Peer Protector Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {totalGood} out of {scenarios.length} correct!
                  You show great commitment to protecting others!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{totalGood} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a peer protector means reporting bullying, supporting friends, blocking online bullies, including others, and getting adult help when needed. You've shown you can protect others from bullying!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {totalGood} out of {scenarios.length} correct.
                  Remember: Protect others by reporting bullying, supporting friends, and getting help!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always report bullying to an adult, support friends who are being bullied, block online bullies, include others, and get help when someone is in danger!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerProtectorBadge;
