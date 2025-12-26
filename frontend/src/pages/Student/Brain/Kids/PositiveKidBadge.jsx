import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";
import { Smile, Heart, Sun, Sparkles, ThumbsUp } from 'lucide-react';

const PositiveKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-60");
  const gameId = gameData?.id || "brain-kids-60";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PositiveKidBadge, using fallback ID");
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
      const games = getBrainKidsGames({});
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
      title: "Rainy Day Optimism",
      description: "Find the silver lining in a rainy day!",
      icon: <Sun className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "It's raining and your picnic is cancelled. What's a positive thought?",
      options: [
        { 
          text: "We can play indoor games!", 
          emoji: "🏠", 
          isCorrect: true
        },
        { 
          text: "This day is ruined", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "I hate rain", 
          emoji: "🌧️", 
          isCorrect: false
        },
        { 
          text: "Nothing good can happen", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Positivity Quiz",
      description: "Test your positive thinking knowledge!",
      icon: <Sparkles className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "What is the benefit of positive thinking?",
      options: [
        { 
          text: "Makes you feel worse", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Helps you feel better and solve problems", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          text: "Doesn't help at all", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Makes problems bigger", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Happy Thoughts Reflex",
      description: "Quickly identify positive thoughts!",
      icon: <Smile className="w-8 h-8" />,
      color: "bg-green-500",
      question: "Is this thought positive or negative: 'I can learn from my mistakes'?",
      options: [
        { 
          text: "Negative - it's about mistakes", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Negative - it's too hard", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Positive - it shows growth mindset", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          text: "Negative - mistakes are bad", 
          emoji: "❌", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Positive Words Match",
      description: "Match uplifting words and meanings!",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-pink-500",
      question: "What does 'gratitude' mean?",
      options: [
        { 
          text: "Being thankful for what you have", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Complaining about things", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Wanting more stuff", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Being sad all the time", 
          emoji: "😞", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Lost Match Positivity",
      description: "Turn defeat into motivation!",
      icon: <ThumbsUp className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "Your team lost the big game. What's a positive way to think?",
      options: [
        { 
          text: "We're losers forever", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "We'll never win", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Next time we'll improve and try harder", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Games are stupid", 
          emoji: "🚫", 
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Positive Kid Badge game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, challenges.length]);

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Positive Kid"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="brain"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && currentChallenge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className={`${currentChallenge.color} p-3 rounded-lg mr-3`}>
                  {currentChallenge.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentChallenge.title}</h3>
                  <p className="text-white/70 text-sm">{currentChallenge.description}</p>
                </div>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
            </div>
            
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default PositiveKidBadge;
