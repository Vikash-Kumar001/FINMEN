import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const PeerProtectorBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-40");
  const gameId = gameData?.id || "uvls-kids-40";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PeerProtectorBadge, using fallback ID");
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
      title: "Witnessing Bullying",
      description: "You see someone being bullied. What do you do?",
      question: "You see someone being bullied. What do you do?",
      options: [
        { 
          text: "Report to an adult - Tell a teacher or parent immediately", 
          emoji: "📢", 
          isCorrect: true
        },
        { 
          text: "Ignore it - Pretend you didn't see anything", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Laugh along - Join in with the bullies", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Try to stop it yourself - Confront the bully directly", 
          emoji: "⚔️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Friend Being Teased",
      description: "Your friend is being teased repeatedly. What do you do?",
      question: "Your friend is being teased repeatedly. What do you do?",
      options: [
        { 
          text: "Stay out of it - Don't get involved", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Support and stand up for them - Defend your friend and get help", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Join the teasing - Tease them too", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Tell them to handle it alone - Let them deal with it themselves", 
          emoji: "🚶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Online Bullying",
      description: "You see mean messages being sent to someone online. What do you do?",
      question: "You see mean messages being sent to someone online. What do you do?",
      options: [
       
        { 
          text: "Ignore it - Scroll past and do nothing", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Share the messages - Forward the mean messages", 
          emoji: "📤", 
          isCorrect: false
        },
         { 
          text: "Report and block - Report the bullying and block the bully", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          text: "Send mean messages back - Fight fire with fire", 
          emoji: "🔥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Someone Excluded",
      description: "You see someone being left out on purpose. What do you do?",
      question: "You see someone being left out on purpose. What do you do?",
      options: [
        { 
          text: "Do nothing - Continue with your friends", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Include them - Invite them to join your group", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Exclude them more - Make sure they stay out", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Ask why they were excluded - Find out the reason first", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Physical Bullying",
      description: "You see someone being pushed or hit. What do you do?",
      question: "You see someone being pushed or hit. What do you do?",
      options: [
        
        { 
          text: "Watch from a distance - Just observe what happens", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Join in the fighting - Fight back physically", 
          emoji: "👊", 
          isCorrect: false
        },
        { 
          text: "Try to pull them apart - Physically separate the bullies", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "Get adult help immediately - Find a teacher or adult right away", 
          emoji: "🆘", 
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

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Peer Protector"
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
                <h3 className="text-2xl font-bold text-white mb-4">Peer Protector Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great commitment to protecting others!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a peer protector means reporting bullying, supporting friends, blocking online bullies, including others, and getting adult help when needed. You've shown you can protect others from bullying!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Protect others by reporting bullying, supporting friends, and getting help!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always report bullying to an adult, support friends who are being bullied, block online bullies, include others, and get help when someone is in danger!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerProtectorBadge;
