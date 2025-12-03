import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SelfAwareBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-50");
  const gameId = gameData?.id || "uvls-kids-50";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SelfAwareBadge, using fallback ID");
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
      title: "Feeling Angry",
      description: "You're feeling very angry. What should you do?",
      choices: [
        { 
          id: "calm", 
          text: "Take deep breaths and calm down", 
          emoji: "🫁", 
          description: "Use calming techniques to manage anger",
          isCorrect: true
        },
        { 
          id: "yell", 
          text: "Yell and scream", 
          emoji: "😠", 
          description: "Express anger by shouting",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore the feeling", 
          emoji: "🙈", 
          description: "Pretend you're not angry",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Feeling Sad",
      description: "You're feeling sad and don't know why. What should you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Ignore the sadness", 
          emoji: "🙈", 
          description: "Pretend you're not sad",
          isCorrect: false
        },
        { 
          id: "understand", 
          text: "Think about what's making you sad", 
          emoji: "💭", 
          description: "Try to understand your feelings",
          isCorrect: true
        },
        { 
          id: "cry", 
          text: "Cry all day", 
          emoji: "😭", 
          description: "Stay sad without trying to feel better",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Feeling Nervous",
      description: "You're nervous about something. What should you do?",
      choices: [
        { 
          id: "worry", 
          text: "Worry constantly", 
          emoji: "😰", 
          description: "Keep worrying without doing anything",
          isCorrect: false
        },
        { 
          id: "avoid", 
          text: "Avoid it completely", 
          emoji: "🚫", 
          description: "Run away from what makes you nervous",
          isCorrect: false
        },
        { 
          id: "prepare", 
          text: "Prepare and practice", 
          emoji: "📚", 
          description: "Get ready to feel more confident",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Feeling Proud",
      description: "You accomplished something great. What should you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Ignore the achievement", 
          emoji: "🙈", 
          description: "Don't acknowledge your success",
          isCorrect: false
        },
        { 
          id: "celebrate", 
          text: "Celebrate and feel good", 
          emoji: "🎉", 
          description: "Recognize your achievement",
          isCorrect: true
        },
        { 
          id: "brag", 
          text: "Brag constantly", 
          emoji: "😤", 
          description: "Boast about it all the time",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Understanding Yourself",
      description: "You want to understand yourself better. What should you do?",
      choices: [
        { 
          id: "ignore", 
          text: "Ignore your feelings", 
          emoji: "🙈", 
          description: "Don't think about yourself",
          isCorrect: false
        },
        { 
          id: "copy", 
          text: "Copy others completely", 
          emoji: "👥", 
          description: "Try to be exactly like someone else",
          isCorrect: false
        },
        { 
          id: "reflect", 
          text: "Reflect on your feelings and actions", 
          emoji: "💭", 
          description: "Think about who you are",
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
      title="Badge: Self Aware"
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

export default SelfAwareBadge;
