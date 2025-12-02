import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EqualityAllyBadge = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
          id: "include", 
          text: "Invite everyone to participate", 
          emoji: "🤝", 
          description: "Make sure all can join",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Continue with your group",
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
      id: 3,
      title: "Challenging Bias",
      description: "You hear someone making unfair assumptions about others. What do you do?",
      choices: [
        { 
          id: "challenge", 
          text: "Challenge bias kindly", 
          emoji: "💬", 
          description: "Explain why it's not fair",
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
          description: "Don't get involved",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Supporting Dreams",
      description: "Someone is discouraged from their dream because of stereotypes. What do you do?",
      choices: [
        { 
          id: "encourage", 
          text: "Encourage their dreams", 
          emoji: "💪", 
          description: "Tell them they can achieve anything",
          isCorrect: true
        },
        { 
          id: "discourage", 
          text: "Tell them to give up", 
          emoji: "😞", 
          description: "Say it's not possible",
          isCorrect: false
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
          id: "celebrate", 
          text: "Celebrate their uniqueness", 
          emoji: "🌈", 
          description: "Show that differences are good",
          isCorrect: true
        },
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
      title="Badge: Equality Ally"
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

export default EqualityAllyBadge;
