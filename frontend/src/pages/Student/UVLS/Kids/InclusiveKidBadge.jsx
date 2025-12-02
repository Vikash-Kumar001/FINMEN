import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InclusiveKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-20");
  const gameId = gameData?.id || "uvls-kids-20";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for InclusiveKidBadge, using fallback ID");
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
      title: "New Student",
      description: "A new student joins your class and looks nervous. What do you do?",
      choices: [
        { 
          id: "welcome", 
          text: "Welcome and befriend them", 
          emoji: "👋", 
          description: "Introduce yourself and show them around",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore the new student", 
          emoji: "🙈", 
          description: "Continue with your friends",
          isCorrect: false
        },
        { 
          id: "tease", 
          text: "Tease them", 
          emoji: "😏", 
          description: "Make jokes about them being new",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Someone is Excluded",
      description: "You see someone being left out of a game. What do you do?",
      choices: [
        { 
          id: "include", 
          text: "Invite them to join", 
          emoji: "🤝", 
          description: "Ask them to play with your group",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Continue playing without them",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Laugh along", 
          emoji: "😂", 
          description: "Join others in excluding them",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Different Abilities",
      description: "A student with different abilities wants to join your activity. What do you do?",
      choices: [
        { 
          id: "include", 
          text: "Include and adapt", 
          emoji: "🤝", 
          description: "Welcome them and adjust the activity",
          isCorrect: true
        },
        { 
          id: "exclude", 
          text: "Say they can't join", 
          emoji: "🚫", 
          description: "Tell them the activity isn't for them",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "🙈", 
          description: "Pretend you don't see them",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Sharing Materials",
      description: "Someone needs supplies for a project but doesn't have any. What do you do?",
      choices: [
        { 
          id: "share", 
          text: "Share your materials", 
          emoji: "✏️", 
          description: "Offer to share what you have",
          isCorrect: true
        },
        { 
          id: "refuse", 
          text: "Refuse to share", 
          emoji: "🚫", 
          description: "Keep everything for yourself",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore their need", 
          emoji: "🙈", 
          description: "Continue working on your own",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Group Work",
      description: "During group work, everyone should contribute. What do you do?",
      choices: [
        { 
          id: "include", 
          text: "Include everyone's ideas", 
          emoji: "💡", 
          description: "Listen to and value all contributions",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore some members", 
          emoji: "🙈", 
          description: "Only listen to your friends",
          isCorrect: false
        },
        { 
          id: "dominate", 
          text: "Dominate the group", 
          emoji: "😤", 
          description: "Make all decisions yourself",
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
      title="Badge: Inclusive Kid"
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

export default InclusiveKidBadge;
