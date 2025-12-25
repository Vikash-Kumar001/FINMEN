import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const CriticalThinkerBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-60");
  const gameId = gameData?.id || "uvls-kids-60";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CriticalThinkerBadge, using fallback ID");
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
      title: "Making a Decision",
      description: "You need to choose between two options. What should you do?",
      question: "You need to choose between two options. What should you do?",
      options: [
        { 
          text: "Think about pros and cons - Consider both options carefully", 
          emoji: "🤔", 
          isCorrect: true
        },
        { 
          text: "Pick randomly - Choose without thinking", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "Choose the first option - Always pick the first thing", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Ask others to decide - Let someone else make the choice", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Hearing Information",
      description: "Someone tells you something that sounds too good to be true. What do you do?",
      question: "Someone tells you something that sounds too good to be true. What do you do?",
      options: [
        { 
          text: "Believe immediately - Trust everything you hear", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          text: "Question and verify - Ask questions and check if it's true", 
          emoji: "❓", 
          isCorrect: true
        },
        { 
          text: "Ignore it completely - Don't think about it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Share with everyone - Tell others about the information", 
          emoji: "📢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Solving a Problem",
      description: "You face a difficult problem. What's the best approach?",
      question: "You face a difficult problem. What's the best approach?",
      options: [
        { 
          text: "Give up immediately - Stop trying right away", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Guess randomly - Try anything without thinking", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "Break it into steps - Think step by step to solve it", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Find someone else to solve it - Let others handle the problem", 
          emoji: "🏃", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Evaluating Choices",
      description: "You need to decide what's right or wrong. What do you do?",
      question: "You need to decide what's right or wrong. What do you do?",
      options: [
        { 
          text: "Act on impulse - Do the first thing that comes to mind", 
          emoji: "⚡", 
          isCorrect: false
        },
        
        { 
          text: "Copy others - Do what everyone else does", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Ignore the choice - Don't make any decision", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Consider consequences - Think about what will happen", 
          emoji: "⚖️", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      title: "Learning from Mistakes",
      description: "You made a mistake. What should you do?",
      question: "You made a mistake. What should you do?",
      options: [
        { 
          text: "Blame others - Say it's someone else's fault", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Ignore the mistake - Pretend it didn't happen", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Learn from it - Think about what went wrong and improve", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Repeat the same mistake - Do the same thing again", 
          emoji: "🔄", 
          isCorrect: false
        }
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
      title="Badge: Critical Thinker"
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
                <h3 className="text-2xl font-bold text-white mb-4">Critical Thinker Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great critical thinking skills!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a critical thinker means thinking through decisions, questioning information, solving problems step-by-step, considering consequences, and learning from mistakes. You've shown you can think critically!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Critical thinking is important for making good decisions!
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
                  Tip: Always think before you act, question information you receive, and learn from your experiences!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CriticalThinkerBadge;
