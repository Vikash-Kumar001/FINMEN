import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GoodCommunicatorBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-70");
  const gameId = gameData?.id || "uvls-kids-70";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for GoodCommunicatorBadge, using fallback ID");
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
      title: "Meeting Someone New",
      description: "You meet a new student. How do you communicate?",
      choices: [
        { 
          id: "greet", 
          text: "Greet politely and introduce yourself", 
          emoji: "👋", 
          description: "Say hello and tell them your name",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "🙈", 
          description: "Pretend you don't see them",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Laugh at them", 
          emoji: "😂", 
          description: "Make fun of them",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Friend is Upset",
      description: "Your friend looks upset. How do you communicate?",
      choices: [
        { 
          id: "ignore", 
          text: "Ignore their feelings", 
          emoji: "🙈", 
          description: "Don't ask about it",
          isCorrect: false
        },
        { 
          id: "listen", 
          text: "Listen and ask what's wrong", 
          emoji: "👂", 
          description: "Show you care and want to help",
          isCorrect: true
        },
        { 
          id: "joke", 
          text: "Make jokes", 
          emoji: "😄", 
          description: "Try to make them laugh",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Asking for Help",
      description: "You need help with homework. How do you ask?",
      choices: [
        { 
          id: "demand", 
          text: "Demand help", 
          emoji: "😤", 
          description: "Tell them they must help",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Don't ask", 
          emoji: "🙈", 
          description: "Try to figure it out alone",
          isCorrect: false
        },
        { 
          id: "ask", 
          text: "Ask clearly and politely", 
          emoji: "🙋", 
          description: "Explain what you need help with",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Disagreement",
      description: "You disagree with a friend. How do you communicate?",
      choices: [
        { 
          id: "yell", 
          text: "Yell at them", 
          emoji: "😠", 
          description: "Shout to make your point",
          isCorrect: false
        },
        { 
          id: "respectful", 
          text: "Share your view respectfully", 
          emoji: "💬", 
          description: "Explain your opinion without being mean",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Stop talking to them", 
          emoji: "🙈", 
          description: "Give them the silent treatment",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Giving Feedback",
      description: "A friend asks for your opinion. How do you respond?",
      choices: [
        { 
          id: "mean", 
          text: "Be mean and critical", 
          emoji: "😠", 
          description: "Point out only bad things",
          isCorrect: false
        },
        { 
          id: "lie", 
          text: "Lie to make them happy", 
          emoji: "😊", 
          description: "Say everything is perfect",
          isCorrect: false
        },
        { 
          id: "kind", 
          text: "Give kind, helpful feedback", 
          emoji: "💝", 
          description: "Be honest but gentle",
          isCorrect: true
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
      title="Badge: Good Communicator"
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

export default GoodCommunicatorBadge;
