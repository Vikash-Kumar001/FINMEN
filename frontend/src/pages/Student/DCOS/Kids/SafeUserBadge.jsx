import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";
import { Shield, Lock, UserX, Home, MessageSquare } from 'lucide-react';

const SafeUserBadge = () => {
  const location = useLocation();
  
  const gameId = "dcos-kids-10";
  const gameData = getGameDataById(gameId);
  
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
      const games = getDcosKidsGames({});
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
      title: "Password Safety",
      description: "Complete the password safety challenge!",
      icon: <Lock className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "What should you do with your password?",
      options: [
        { 
          text: "Never share passwords", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "Share with friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Write it on paper", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Tell strangers", 
          emoji: "👤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Stranger Safety",
      description: "Complete the stranger safety challenge!",
      icon: <UserX className="w-8 h-8" />,
      color: "bg-red-500",
      question: "What should you do if a stranger talks to you online?",
      options: [
        { 
          text: "Talk back to them", 
          emoji: "💬", 
          isCorrect: false
        },
        { 
          text: "Don't talk to strangers online", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          text: "Share personal info", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Meet them in person", 
          emoji: "👋", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Privacy Protection",
      description: "Complete the privacy challenge!",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "What should you keep private online?",
      options: [
        { 
          text: "Share everything", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Keep personal info private", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Post your address", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Share phone number", 
          emoji: "📞", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Family Rules",
      description: "Complete the family rules challenge!",
      icon: <Home className="w-8 h-8" />,
      color: "bg-green-500",
      question: "What should you do with family device rules?",
      options: [
        { 
          text: "Ignore them", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Break them secretly", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          text: "Follow family device rules", 
          emoji: "👨‍👩‍👧", 
          isCorrect: true
        },
        { 
          text: "Argue about them", 
          emoji: "😤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Reporting Safety",
      description: "Complete the reporting challenge!",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-orange-500",
      question: "What should you do if a stranger sends you a message?",
      options: [
        { 
          text: "Reply to them", 
          emoji: "💬", 
          isCorrect: false
        },
        { 
          text: "Ignore it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Tell parents about stranger messages", 
          emoji: "📢", 
          isCorrect: true
        },
        { 
          text: "Meet them", 
          emoji: "👋", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionText) => {
    if (answered || showResult) return;
    
    setAnswered(true);
    setSelectedAnswer(optionText);
    resetFeedback();
    
    const currentChallenge = challenges[challenge];
    const selectedOption = currentChallenge.options.find(opt => opt.text === optionText);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
        resetFeedback();
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentChallenge = challenges[challenge];
  const finalScore = score;

  return (
    <GameShell
      title="Safe User Badge"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      score={finalScore}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="dcos"
      showGameOver={showResult}
      maxScore={challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={showResult && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{challenges.length}</span>
              </div>
              
              <div className={`${currentChallenge.color} rounded-xl p-6 mb-6 text-center`}>
                <div className="text-white mb-2">{currentChallenge.icon}</div>
                <h3 className="text-white text-xl font-bold mb-2">{currentChallenge.title}</h3>
                <p className="text-white/90 text-sm">{currentChallenge.description}</p>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 font-semibold text-center">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option.text;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.text)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SafeUserBadge;
