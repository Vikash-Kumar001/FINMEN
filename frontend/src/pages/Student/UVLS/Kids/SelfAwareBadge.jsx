import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const SelfAwareBadge = () => {
  const navigate = useNavigate();
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
      title: "Feeling Angry",
      description: "You're feeling very angry. What should you do?",
      question: "You're feeling very angry. What should you do?",
      options: [
        { 
          text: "Take deep breaths and calm down - Use calming techniques to manage anger", 
          emoji: "🫁", 
          isCorrect: true
        },
        { 
          text: "Yell and scream - Express anger by shouting", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Ignore the feeling - Pretend you're not angry", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Hit something - Physically express your anger", 
          emoji: "💥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Feeling Sad",
      description: "You're feeling sad and don't know why. What should you do?",
      question: "You're feeling sad and don't know why. What should you do?",
      options: [
        { 
          text: "Ignore the sadness - Pretend you're not sad", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Think about what's making you sad - Try to understand your feelings", 
          emoji: "💭", 
          isCorrect: true
        },
        { 
          text: "Cry all day - Stay sad without trying to feel better", 
          emoji: "😭", 
          isCorrect: false
        },
        { 
          text: "Distract yourself completely - Never think about your sadness", 
          emoji: "📱", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Feeling Nervous",
      description: "You're nervous about something. What should you do?",
      question: "You're nervous about something. What should you do?",
      options: [
        { 
          text: "Worry constantly - Keep worrying without doing anything", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          text: "Avoid it completely - Run away from what makes you nervous", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Prepare and practice - Get ready to feel more confident", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Take medication - Use drugs to calm your nerves", 
          emoji: "💊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Feeling Proud",
      description: "You accomplished something great. What should you do?",
      question: "You accomplished something great. What should you do?",
      options: [
        { 
          text: "Ignore the achievement - Don't acknowledge your success", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Celebrate and feel good - Recognize your achievement", 
          emoji: "🎉", 
          isCorrect: true
        },
        { 
          text: "Brag constantly - Boast about it all the time", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Minimize your achievement - Downplay your success", 
          emoji: "📉", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Understanding Yourself",
      description: "You want to understand yourself better. What should you do?",
      question: "You want to understand yourself better. What should you do?",
      options: [
        { 
          text: "Ignore your feelings - Don't think about yourself", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Copy others completely - Try to be exactly like someone else", 
          emoji: "👥", 
          isCorrect: false
        },
        
        { 
          text: "Ask others what to do - Let others decide for you", 
          emoji: "❓", 
          isCorrect: false
        },
        { 
          text: "Reflect on your feelings and actions - Think about who you are", 
          emoji: "💭", 
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
      title="Badge: Self Aware"
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
                <h3 className="text-2xl font-bold text-white mb-4">Self Aware Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great self-awareness!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being self-aware means managing your emotions, understanding your feelings, preparing for challenges, celebrating achievements appropriately, and reflecting on yourself. You've shown you can understand yourself!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Understanding yourself is important for emotional growth!
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
                  Tip: Always take time to understand your emotions, practice self-care, and reflect on your actions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SelfAwareBadge;
