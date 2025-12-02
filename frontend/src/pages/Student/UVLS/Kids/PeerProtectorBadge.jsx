import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerProtectorBadge = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
          id: "support", 
          text: "Support and stand up for them", 
          emoji: "🛡️", 
          description: "Defend your friend and get help",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Stay out of it", 
          emoji: "🙈", 
          description: "Don't get involved",
          isCorrect: false
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
          id: "report", 
          text: "Report and block", 
          emoji: "🚫", 
          description: "Report the bullying and block the bully",
          isCorrect: true
        },
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
        }
      ]
    },
    {
      id: 4,
      title: "Someone Excluded",
      description: "You see someone being left out on purpose. What do you do?",
      choices: [
        { 
          id: "include", 
          text: "Include them", 
          emoji: "🤝", 
          description: "Invite them to join your group",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Continue with your friends",
          isCorrect: false
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
    const newDecisions = [...decisions, { 
      scenarioId: scenarios[scenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setDecisions(newDecisions);
    
    // If the choice is correct, show flash/confetti and update score
    const isCorrect = scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setFinalScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next scenario or show results
    if (scenario < scenarios.length - 1) {
      setTimeout(() => {
        setScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentScenario = () => scenarios[scenario];

  return (
    <GameShell
      title="Badge: Peer Protector"
      subtitle={showResult ? "Quiz Complete!" : `Scenario ${scenario + 1} of ${scenarios.length}`}
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
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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
                {getCurrentScenario().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleDecision(choice.id)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{choice.emoji}</div>
                    <h4 className="font-bold text-xl mb-2">{choice.text}</h4>
                    <p className="text-white/90">{choice.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PeerProtectorBadge;
