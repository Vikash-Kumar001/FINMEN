import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InclusiveKidBadge = () => {
  const navigate = useNavigate();
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
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
          id: "ignore", 
          text: "Do nothing", 
          emoji: "🙈", 
          description: "Continue playing without them",
          isCorrect: false
        },
        { 
          id: "include", 
          text: "Invite them to join", 
          emoji: "🤝", 
          description: "Ask them to play with your group",
          isCorrect: true
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
        },
        { 
          id: "include", 
          text: "Include and adapt", 
          emoji: "🤝", 
          description: "Welcome them and adjust the activity",
          isCorrect: true
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
          id: "ignore", 
          text: "Ignore some members", 
          emoji: "🙈", 
          description: "Only listen to your friends",
          isCorrect: false
        },
        { 
          id: "include", 
          text: "Include everyone's ideas", 
          emoji: "💡", 
          description: "Listen to and value all contributions",
          isCorrect: true
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
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
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
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next scenario or show results
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
      title="Badge: Inclusive Kid"
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
                  const isSelected = decisions.length > 0 && decisions[decisions.length - 1]?.scenarioId === scenarios[scenario].id && decisions[decisions.length - 1]?.choice === choice.id;
                  
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
                <h3 className="text-2xl font-bold text-white mb-4">Inclusive Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {totalGood} out of {scenarios.length} correct!
                  You show great inclusion and kindness!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{totalGood} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being inclusive means welcoming everyone, sharing resources, and making sure no one feels left out. You've shown you can be a great friend to everyone!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {totalGood} out of {scenarios.length} correct.
                  Remember: Inclusion means welcoming everyone and making sure no one feels left out!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how you would feel if you were left out, then choose the inclusive and welcoming response!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusiveKidBadge;
