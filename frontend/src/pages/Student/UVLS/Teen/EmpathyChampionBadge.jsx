import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const EmpathyChampionBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-10");
  const gameId = gameData?.id || "uvls-teen-10";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for EmpathyChampionBadge, using fallback ID");
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
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Peer in Distress",
      question: "A classmate looks upset and withdrawn. They've been quiet all day. What's the best empathetic response?",
      options: [
        { 
          text: "Ask if they're okay and offer to listen - Shows care and offers support", 
          emoji: "💙", 
          isCorrect: true
        },
        { 
          text: "Ignore them to give space - They might need someone to reach out", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Tell them to cheer up - Dismisses their feelings", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Tell others about their situation - Violates their privacy", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Cultural Misunderstanding",
      question: "Someone from a different culture does something that seems strange to you. How do you respond with empathy?",
      options: [
        { 
          text: "Make fun of it with friends - Hurts their feelings", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          text: "Ask them to help you understand their perspective - Shows respect and willingness to learn", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Avoid them - Doesn't help bridge understanding", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Judge their culture as wrong - Shows intolerance", 
          emoji: "❌", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Exclusion Scenario",
      question: "You see someone being left out of a group activity. What's the empathetic action?",
      options: [
      
        { 
          text: "Pretend not to notice - Doesn't help the situation", 
          emoji: "🫥", 
          isCorrect: false
        },
        { 
          text: "Laugh along with others - Hurts the excluded person", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          text: "Join the exclusion to fit in - Betrays empathy", 
          emoji: "👥", 
          isCorrect: false
        },
          { 
          text: "Invite them to join your group - Shows inclusion and empathy", 
          emoji: "👥", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Sharing Personal Struggle",
      question: "A friend opens up about a family problem. They seem overwhelmed. How do you respond with empathy?",
      options: [
        { 
          text: "Tell them your problems are worse - Makes it about you", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Listen without judgment and validate their feelings - Shows true empathy and support", 
          emoji: "👂", 
          isCorrect: true
        },
        { 
          text: "Change the subject quickly - Avoids their need for support", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Give advice immediately without asking - May not be helpful", 
          emoji: "💡", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Different Ability",
      question: "A peer with a different ability struggles with something you find easy. What's the empathetic response?",
      options: [
        { 
          text: "Do it for them without asking - Takes away their agency", 
          emoji: "🙌", 
          isCorrect: false
        },
        { 
          text: "Ignore their struggle - Doesn't show empathy", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Offer help only if they want it, without pity - Respects their autonomy and shows empathy", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Show off your ability to make them feel worse - Creates shame", 
          emoji: "😵‍💫", 
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
      title="Empathy Champion Badge"
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
      backPath="/games/uvls/teen"
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
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Empathy Champion Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You're an Empathy Champion!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Empathy involves understanding others' perspectives, listening without judgment, and responding with kindness and respect.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Empathy is about understanding others' feelings and perspectives!
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
                  Tip: Always try to see situations from others' perspectives!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyChampionBadge;
