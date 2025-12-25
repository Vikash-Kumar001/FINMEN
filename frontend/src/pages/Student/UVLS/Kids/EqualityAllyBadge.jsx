import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const EqualityAllyBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-30");
  const gameId = gameData?.id || "uvls-kids-30";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for EqualityAllyBadge, using fallback ID");
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
      title: "Gender Stereotypes",
      description: "Someone says 'boys can't play with dolls' or 'girls can't play sports'. What do you do?",
      question: "Someone says 'boys can't play with dolls' or 'girls can't play sports'. What do you do?",
      options: [
        { 
          text: "Speak up against unfairness - Tell them everyone can do anything", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          text: "Agree with them - Say they're right", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          text: "Ignore it - Don't say anything", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Change the subject - Avoid the conversation", 
          emoji: "🤐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Equal Opportunities",
      description: "You see someone being excluded from an activity because of who they are. What do you do?",
      question: "You see someone being excluded from an activity because of who they are. What do you do?",
      options: [
        { 
          text: "Do nothing - Continue with your group", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Invite everyone to participate - Make sure all can join", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Exclude them more - Make sure they stay out", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Tell a teacher - Let an adult handle it", 
          emoji: "👩‍🏫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Challenging Bias",
      description: "You hear someone making unfair assumptions about others. What do you do?",
      question: "You hear someone making unfair assumptions about others. What do you do?",
      options: [
        { 
          text: "Agree with them - Say they're right", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          text: "Ignore it - Don't get involved", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Challenge bias kindly - Explain why it's not fair", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Tell them off harshly - Be aggressive in your response", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Supporting Dreams",
      description: "Someone is discouraged from their dream because of stereotypes. What do you do?",
      question: "Someone is discouraged from their dream because of stereotypes. What do you do?",
      options: [
        { 
          text: "Tell them to give up - Say it's not possible", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Encourage their dreams - Tell them they can achieve anything", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Ignore them - Don't say anything", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Give practical advice only - Focus on steps, not encouragement", 
          emoji: "📋", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Celebrating Diversity",
      description: "You see someone being made fun of for being different. What do you do?",
      question: "You see someone being made fun of for being different. What do you do?",
      options: [
        { 
          text: "Laugh along - Join in making fun", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Ignore it - Don't get involved", 
          emoji: "🙈", 
          isCorrect: false
        },
        
        { 
          text: "Defend them quietly - Support them without confrontation", 
          emoji: "🛡️", 
          isCorrect: false
        },
        { 
          text: "Celebrate their uniqueness - Show that differences are good", 
          emoji: "🌈", 
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
      title="Badge: Equality Ally"
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
                <h3 className="text-2xl font-bold text-white mb-4">Equality Ally Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great commitment to equality!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being an equality ally means speaking up against unfairness, including everyone, challenging bias, supporting dreams, and celebrating diversity. You've shown you can be a great ally!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Being an equality ally means standing up for fairness and inclusion!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how you can support equality by speaking up, including everyone, challenging bias, and celebrating diversity!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EqualityAllyBadge;
