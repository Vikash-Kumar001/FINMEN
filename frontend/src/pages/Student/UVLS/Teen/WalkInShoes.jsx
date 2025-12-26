import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const WalkInShoes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-4");
  const gameId = gameData?.id || "uvls-teen-4";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for WalkInShoes, using fallback ID");
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
      title: "New Student Challenge",
      question: "You're a new student who speaks a different language. During lunch, you sit alone because you're not sure how to join others. What do you do?",
      options: [
        { 
          text: "Try to ask someone if you can join - Shows courage and helps you connect", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Hide in the library to avoid everyone - Avoids the problem and increases isolation", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Just sit alone and feel sad - Doesn't help the situation", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Avoid lunch completely - Further isolates you from peers", 
          emoji: "🚶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Learning Disability Challenge",
      question: "You have a learning disability and the class is moving too fast. You're falling behind and feeling overwhelmed. How do you handle this?",
      options: [
        { 
          text: "Give up and stop trying - Not helpful and makes things worse", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Ask the teacher for help or accommodations - Advocating for yourself is important", 
          emoji: "🙋", 
          isCorrect: true
        },
        { 
          text: "Copy someone else's work - Dishonest and doesn't help you learn", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Pretend you understand everything - Avoids getting the help you need", 
          emoji: "🎭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Exclusion Challenge",
      question: "You're being excluded from group activities because of your background. Others make comments that hurt. What's your choice?",
      options: [
        { 
          text: "Accept it and try to change who you are - Hurts your self-esteem", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "React with anger and aggression - Can make the situation worse", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Report the exclusion to a trusted adult - Gets you the help and support you need", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Retaliate with similar behavior - Perpetuates the cycle of negativity", 
          emoji: "⚔️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Financial Struggles Challenge",
      question: "You're dealing with family financial struggles and can't afford school supplies. Others seem to have everything they need. How do you respond?",
      options: [
        { 
          text: "Feel ashamed and try to hide your situation - Prevents you from getting help", 
          emoji: "😳", 
          isCorrect: false
        },
        { 
          text: "Ask the school counselor for resources - Gets you the support you need", 
          emoji: "💼", 
          isCorrect: true
        },
        { 
          text: "Take supplies from others without asking - Wrong and can cause problems", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Drop out of school to avoid embarrassment - Doesn't solve the problem", 
          emoji: "🚪", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Mental Health Challenge",
      question: "You're experiencing mental health challenges and feel like you're the only one struggling. Others seem happy and carefree. What action do you take?",
      options: [
        { 
          text: "Withdraw and isolate yourself from everyone - Makes things worse", 
          emoji: "🚪", 
          isCorrect: false
        },
        { 
          text: "Pretend everything is fine and ignore your feelings - Doesn't address the problem", 
          emoji: "😶", 
          isCorrect: false
        },
        
        { 
          text: "Self-medicate with substances - Can lead to more serious problems", 
          emoji: "⚠️", 
          isCorrect: false
        },
        { 
          text: "Seek help from a school counselor or therapist - Professional help can make a big difference", 
          emoji: "💙", 
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
      title="Walk in Their Shoes"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Simulation Complete!"}
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
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Content Warning: This simulation touches on sensitive topics
                </p>
              </div>
              
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
                <h3 className="text-2xl font-bold text-white mb-4">Walk in Their Shoes Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You understand how to handle challenging situations with empathy!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding and empathizing with others' challenges helps create a more inclusive and supportive environment for everyone.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Empathy and understanding help build stronger communities!
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
                  Tip: Always consider how you can support others facing challenges!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WalkInShoes;

