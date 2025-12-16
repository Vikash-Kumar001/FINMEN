import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const ClimateActionStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("sustainability-teens-1");
  const gameId = gameData?.id || "sustainability-teens-1";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ClimateActionStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You learn that your city's carbon emissions are rising. What's your first step?",
      options: [
        { 
          id: "research", 
          text: "Research the main sources", 
          emoji: "📚", 
          description: "Understand what's causing the problem before acting",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😐", 
          description: "Not your problem to solve",
          isCorrect: false
        },
        { 
          id: "protest", 
          text: "Organize a protest", 
          emoji: "📢", 
          description: "Take immediate action without understanding the issue",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your school wants to reduce its carbon footprint. What's the most effective approach?",
      options: [
        { 
          id: "posters", 
          text: "Put up awareness posters", 
          emoji: "📋", 
          description: "Raise awareness but no direct impact",
          isCorrect: false
        },
        { 
          id: "solar", 
          text: "Install solar panels", 
          emoji: "☀️", 
          description: "Switch to renewable energy sources",
          isCorrect: true
        },
        { 
          id: "nothing", 
          text: "Do nothing", 
          emoji: "🤷", 
          description: "Schools can't make a difference",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You want to reduce your personal carbon footprint. What's the best strategy?",
      options: [
        { 
          id: "offset", 
          text: "Buy carbon offsets only", 
          emoji: "💰", 
          description: "Offsets help but reducing is better",
          isCorrect: false
        },
        { 
          id: "wait", 
          text: "Wait for technology to solve it", 
          emoji: "⏳", 
          description: "Individual action matters now",
          isCorrect: false
        },
        { 
          id: "transport", 
          text: "Use public transport or bike", 
          emoji: "🚲", 
          description: "Reduce emissions from transportation",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friends don't believe climate change is real. How do you respond?",
      options: [
        { 
          id: "educate", 
          text: "Share reliable sources and facts", 
          emoji: "📖", 
          description: "Educate with evidence-based information",
          isCorrect: true
        },
        { 
          id: "argue", 
          text: "Argue aggressively", 
          emoji: "😠", 
          description: "Aggression usually doesn't convince people",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "😶", 
          description: "Engagement is important for change",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You want to start a climate action club at school. What's the first thing to do?",
      options: [
        { 
          id: "recruit", 
          text: "Recruit members immediately", 
          emoji: "👥", 
          description: "Need a plan first to attract members",
          isCorrect: false
        },
        { 
          id: "plan", 
          text: "Create a clear action plan", 
          emoji: "📝", 
          description: "Have a strategy before recruiting members",
          isCorrect: true
        },
        { 
          id: "wait", 
          text: "Wait for someone else to start it", 
          emoji: "⏸️", 
          description: "Take initiative and lead",
          isCorrect: false
        }
      ]
    }
  ];

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Climate Action Story game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, questions.length]);

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Climate Action Story"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default ClimateActionStory;

