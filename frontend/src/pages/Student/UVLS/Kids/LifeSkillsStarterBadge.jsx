import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const LifeSkillsStarterBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-100");
  const gameId = gameData?.id || "uvls-kids-100";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for LifeSkillsStarterBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getUvlsKidsGames({});
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
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Planning Your Day",
      description: "You have many things to do today. What should you do?",
      question: "You have many things to do today. What should you do?",
      options: [
        { 
          text: "Make a plan and prioritize - Organize tasks by importance", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Do things randomly - Do whatever comes to mind", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "Ignore everything - Don't do anything", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Do everything at once - Try to do all tasks simultaneously", 
          emoji: "🔄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Setting Goals",
      description: "You want to achieve something. What should you do?",
      question: "You want to achieve something. What should you do?",
      options: [
        { 
          text: "Have vague dreams - Just wish for things", 
          emoji: "☁️", 
          isCorrect: false
        },
        { 
          text: "Set clear, achievable goals - Make specific goals you can reach", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Have no goals - Don't plan anything", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Set impossible goals - Aim for things that can't be achieved", 
          emoji: "🚀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Time Management",
      description: "You have limited time for homework and play. What should you do?",
      question: "You have limited time for homework and play. What should you do?",
      options: [
        { 
          text: "Only play - Spend all time playing", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Only do homework - Work all the time", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Balance both activities - Plan time for work and fun", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Procrastinate everything - Delay both homework and play", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Staying Safe",
      description: "You need to learn about safety. What should you do?",
      question: "You need to learn about safety. What should you do?",
      options: [
        { 
          text: "Learn safety rules - Understand how to stay safe", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Ignore safety - Don't think about safety", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Take unnecessary risks - Do dangerous things", 
          emoji: "⚠️", 
          isCorrect: false
        },
        { 
          text: "Avoid all activities - Stay away from everything to be safe", 
          emoji: "🏠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Life Skills",
      description: "You want to learn important life skills. What should you do?",
      question: "You want to learn important life skills. What should you do?",
      options: [
        { 
          text: "Ignore learning - Don't try to learn", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Give up easily - Stop trying when it's hard", 
          emoji: "😞", 
          isCorrect: false
        },
        
        { 
          text: "Only learn when forced - Wait for others to make you learn", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Practice and learn regularly - Keep learning new skills", 
          emoji: "📚", 
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

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Life Skills Starter"
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
      backPath="/games/uvls/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === index
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Life Skills Starter Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great life skills starting abilities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Good life skills include planning your day, setting clear goals, managing time with balance, staying safe by learning rules, and practicing regularly. You've shown you can start developing great life skills!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Developing life skills is important for success!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setChallenge(0);
                    setScore(0);
                    setAnswered(false);
                    setSelectedAnswer(null);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always plan your day, set clear goals, balance work and play, learn safety rules, and practice regularly!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LifeSkillsStarterBadge;
