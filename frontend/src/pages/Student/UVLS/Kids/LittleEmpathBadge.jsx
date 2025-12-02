import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const LittleEmpathBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-10");
  const gameId = gameData?.id || "uvls-kids-10";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for LittleEmpathBadge, using fallback ID");
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
      title: "Friend is Sad",
      description: "Your friend looks sad and is sitting alone. What do you do?",
      choices: [
        { 
          id: "comfort", 
          text: "Go and comfort them", 
          emoji: "🤗", 
          description: "Ask what's wrong and offer support",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "🙈", 
          description: "Pretend you don't notice",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Laugh with others", 
          emoji: "😂", 
          description: "Continue playing with other friends",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Someone Needs Help",
      description: "A classmate is struggling with their homework. What do you do?",
      choices: [
        { 
          id: "help", 
          text: "Offer to help", 
          emoji: "🤝", 
          description: "Sit with them and help explain",
          isCorrect: true
        },
        { 
          id: "busy", 
          text: "Say you're busy", 
          emoji: "⏰", 
          description: "Tell them you don't have time",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Make fun of them", 
          emoji: "😏", 
          description: "Tease them for not knowing",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
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
      id: 4,
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
      id: 5,
      title: "Friend Made a Mistake",
      description: "Your friend accidentally broke something and feels bad. What do you do?",
      choices: [
        { 
          id: "support", 
          text: "Support and reassure them", 
          emoji: "💪", 
          description: "Tell them it's okay and help fix it",
          isCorrect: true
        },
        { 
          id: "blame", 
          text: "Blame them", 
          emoji: "👆", 
          description: "Tell them it's their fault",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Make fun of them", 
          emoji: "😏", 
          description: "Tease them about the mistake",
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
      title="Badge: Little Empath"
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

export default LittleEmpathBadge;
