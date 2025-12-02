import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CommunityHelperBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-90");
  const gameId = gameData?.id || "uvls-kids-90";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CommunityHelperBadge, using fallback ID");
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
      title: "Park Cleanup",
      description: "You see trash in the park. What do you do?",
      choices: [
        { 
          id: "clean", 
          text: "Pick up the trash", 
          emoji: "🧹", 
          description: "Help keep the park clean",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Walk past and do nothing",
          isCorrect: false
        },
        { 
          id: "add", 
          text: "Add more trash", 
          emoji: "🗑️", 
          description: "Throw your own trash there",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Elderly Neighbor",
      description: "An elderly neighbor needs help carrying groceries. What do you do?",
      choices: [
        { 
          id: "help", 
          text: "Offer to help", 
          emoji: "🤝", 
          description: "Carry the groceries for them",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "🙈", 
          description: "Continue on your way",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Make fun of them", 
          emoji: "😏", 
          description: "Laugh at them struggling",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Community Event",
      description: "There's a community cleanup event. What do you do?",
      choices: [
        { 
          id: "volunteer", 
          text: "Volunteer to help", 
          emoji: "🙋", 
          description: "Join in and help the community",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Stay home", 
          emoji: "🏠", 
          description: "Don't participate",
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Make fun of it", 
          emoji: "😄", 
          description: "Tease those who participate",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Sharing Resources",
      description: "You have extra school supplies. What do you do?",
      choices: [
        { 
          id: "share", 
          text: "Share with others", 
          emoji: "✏️", 
          description: "Give to those who need them",
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "Keep everything", 
          emoji: "📦", 
          description: "Keep all for yourself",
          isCorrect: false
        },
        { 
          id: "throw", 
          text: "Throw them away", 
          emoji: "🗑️", 
          description: "Get rid of them",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Community Problem",
      description: "You notice a problem in your community that needs fixing. What do you do?",
      choices: [
        { 
          id: "report", 
          text: "Report and help fix it", 
          emoji: "🛠️", 
          description: "Tell adults and help solve it",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Pretend you don't see it",
          isCorrect: false
        },
        { 
          id: "make", 
          text: "Make it worse", 
          emoji: "😠", 
          description: "Add to the problem",
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
      title="Badge: Community Helper"
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

export default CommunityHelperBadge;
