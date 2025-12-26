import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const LifeSkillsChampionBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-100");
  const gameId = gameData?.id || "uvls-teen-100";
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Budget Management",
      question: "You have $100 for the month. What's the best approach to manage it?",
      options: [
        { 
          text: "Create a budget, track expenses, and prioritize needs over wants", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Spend it all immediately", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Save everything and spend nothing", 
          emoji: "🏦", 
          isCorrect: false
        },
        { 
          text: "Just wing it without planning", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Time Management",
      question: "You have multiple deadlines this week. How do you handle it?",
      options: [
        { 
          text: "Panic and do everything at the last minute", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          text: "Prioritize tasks, create a schedule, and break work into manageable chunks", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Ignore deadlines and hope they go away", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Do everything at once without prioritizing", 
          emoji: "😵", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Conflict Resolution",
      question: "You have a disagreement with a friend. What's the best approach?",
      options: [
        { 
          text: "Listen to their perspective, express your own calmly, and seek a compromise", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Argue until you win", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Avoid them completely", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Tell others about the conflict to get support", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Goal Setting",
      question: "You want to achieve a long-term goal. What's the best strategy?",
      options: [
        { 
          text: "Set an impossible goal with no plan", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Never set goals, just go with the flow", 
          emoji: "🌊", 
          isCorrect: false
        },
        { 
          text: "Set SMART goals, break them into steps, and track progress", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Set a goal but don't track progress", 
          emoji: "🎯", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Stress Management",
      question: "You're feeling overwhelmed with responsibilities. How do you handle it?",
      options: [
        
        { 
          text: "Ignore stress and push through", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "Give up on everything", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Take on more responsibilities to distract yourself", 
          emoji: "🤯", 
          isCorrect: false
        },
        { 
          text: "Identify stressors, use healthy coping strategies, and ask for help when needed", 
          emoji: "🧘", 
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallengeData = challenges[challenge];

  return (
    <GameShell
      title="Badge: Life Skills Champion"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="uvls"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallengeData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallengeData.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallengeData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallengeData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
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

export default LifeSkillsChampionBadge;
