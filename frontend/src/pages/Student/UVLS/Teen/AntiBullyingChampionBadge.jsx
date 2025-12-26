import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const AntiBullyingChampionBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-40");
  const gameId = gameData?.id || "uvls-teen-40";
  
  // Find next game path and ID if not provided in location.state
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
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Report Bullying Incident",
      question: "You witness someone being bullied. What's the most effective sustained action?",
      options: [
       
        { 
          text: "Ignore the situation", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Join in the bullying", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Tell the victim to handle it themselves", 
          emoji: "💬", 
          isCorrect: false
        },
         { 
          text: "Report to trusted adults, support the victim, and follow up to ensure safety", 
          emoji: "🛡️", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "Create Awareness Campaign",
      question: "You want to create ongoing awareness about bullying prevention. What's the best approach?",
      options: [
        { 
          text: "Organize regular workshops, peer presentations, and awareness activities throughout the year", 
          emoji: "📢", 
          isCorrect: true
        },
        { 
          text: "Do nothing", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "One-time announcement", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Focus only on punishment for bullies", 
          emoji: "⚖️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Support Bullying Victims",
      question: "How do you provide sustained support to someone who has been bullied?",
      options: [
        
        { 
          text: "Support once and forget", 
          emoji: "👋", 
          isCorrect: false
        },
        { 
          text: "Blame the victim", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Check in regularly, offer ongoing support, and help them build resilience", 
          emoji: "💙", 
          isCorrect: true
        },
        { 
          text: "Tell them to fight back physically", 
          emoji: "🥊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Prevent Future Bullying",
      question: "How do you help prevent bullying from happening again?",
      options: [
        
        { 
          text: "Do nothing preventive", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Advocate for school policies, promote inclusion, and model respectful behavior consistently", 
          emoji: "🌱", 
          isCorrect: true
        },
        { 
          text: "Wait for it to happen again", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Avoid the people involved", 
          emoji: "🚶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Build Anti-Bullying Community",
      question: "How do you build a community that actively works against bullying?",
      options: [
       
        { 
          text: "Work alone", 
          emoji: "👤", 
          isCorrect: false
        },
        { 
          text: "Encourage exclusion", 
          emoji: "🚫", 
          isCorrect: false
        },
         { 
          text: "Start peer support groups, organize regular meetings, and create safe spaces for discussion", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Focus only on identifying bullies", 
          emoji: "🔍", 
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

  const currentChallengeData = challenges[challenge];

  return (
    <GameShell
      title="Anti-Bullying Champion Badge"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
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
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You're an Anti-Bullying Champion!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Practice anti-bullying skills by standing up for others and creating safe environments!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default AntiBullyingChampionBadge;
