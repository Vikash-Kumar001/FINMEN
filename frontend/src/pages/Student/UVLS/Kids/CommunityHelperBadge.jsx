import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const CommunityHelperBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-90");
  const gameId = gameData?.id || "uvls-kids-90";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CommunityHelperBadge, using fallback ID");
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
      title: "Park Cleanup",
      description: "You see trash in the park. What do you do?",
      question: "You see trash in the park. What do you do?",
      options: [
        { 
          text: "Pick up the trash - Help keep the park clean", 
          emoji: "🧹", 
          isCorrect: true
        },
        { 
          text: "Ignore it - Walk past and do nothing", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Add more trash - Throw your own trash there", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Ask others to clean it - Get someone else to do it", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Elderly Neighbor",
      description: "An elderly neighbor needs help carrying groceries. What do you do?",
      question: "An elderly neighbor needs help carrying groceries. What do you do?",
      options: [
        { 
          text: "Ignore them - Continue on your way", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Offer to help - Carry the groceries for them", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Make fun of them - Laugh at them struggling", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Tell them to get younger help - Suggest they ask someone else", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Community Event",
      description: "There's a community cleanup event. What do you do?",
      question: "There's a community cleanup event. What do you do?",
      options: [
        { 
          text: "Stay home - Don't participate", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Make fun of it - Tease those who participate", 
          emoji: "😄", 
          isCorrect: false
        },
        
        { 
          text: "Watch from a distance - See what happens without participating", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Volunteer to help - Join in and help the community", 
          emoji: "🙋", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Sharing Resources",
      description: "You have extra school supplies. What do you do?",
      question: "You have extra school supplies. What do you do?",
      options: [
        { 
          text: "Share with others - Give to those who need them", 
          emoji: "✏️", 
          isCorrect: true
        },
        { 
          text: "Keep everything - Keep all for yourself", 
          emoji: "📦", 
          isCorrect: false
        },
        
        { 
          text: "Throw them away - Get rid of them", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Sell them - Trade for something else", 
          emoji: "💰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Community Problem",
      description: "You notice a problem in your community that needs fixing. What do you do?",
      question: "You notice a problem in your community that needs fixing. What do you do?",
      options: [
        { 
          text: "Ignore it - Pretend you don't see it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Make it worse - Add to the problem", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Report and help fix it - Tell adults and help solve it", 
          emoji: "🛠️", 
          isCorrect: true
        },
        { 
          text: "Wait for someone else to fix it - Expect others to take action", 
          emoji: "⏰", 
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
      title="Badge: Community Helper"
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
                <h3 className="text-2xl font-bold text-white mb-4">Community Helper Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great community helping skills!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a community helper means picking up trash, helping neighbors, volunteering for community events, sharing resources, and reporting problems to be fixed. You've shown you can help your community!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Helping your community is important for making it better!
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
                  Tip: Always look for ways to help your community, be kind to neighbors, and take care of shared spaces!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CommunityHelperBadge;
