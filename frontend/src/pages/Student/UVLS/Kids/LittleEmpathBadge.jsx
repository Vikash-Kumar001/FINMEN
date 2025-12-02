import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const LittleEmpathBadge = () => {
  const navigate = useNavigate();
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
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
          id: "busy", 
          text: "Say you're busy", 
          emoji: "⏰", 
          description: "Tell them you don't have time",
          isCorrect: false
        },
        { 
          id: "help", 
          text: "Offer to help", 
          emoji: "🤝", 
          description: "Sit with them and help explain",
          isCorrect: true
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
        },
        { 
          id: "welcome", 
          text: "Welcome and befriend them", 
          emoji: "👋", 
          description: "Introduce yourself and show them around",
          isCorrect: true
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
          id: "blame", 
          text: "Blame them", 
          emoji: "👆", 
          description: "Tell them it's their fault",
          isCorrect: false
        },
        { 
          id: "support", 
          text: "Support and reassure them", 
          emoji: "💪", 
          description: "Tell them it's okay and help fix it",
          isCorrect: true
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

  return (
    <GameShell
      title="Badge: Little Empath"
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
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
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
                      <p className={answered ? "text-white/90" : "text-white/90"}>{choice.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Little Empath Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} correct!
                  You show great empathy and kindness!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Empathy means understanding and caring about how others feel. You've shown you can be a great friend!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} correct.
                  Remember: Empathy means understanding how others feel and helping them!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how you would feel in their situation, then choose the kind and helpful response!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LittleEmpathBadge;
