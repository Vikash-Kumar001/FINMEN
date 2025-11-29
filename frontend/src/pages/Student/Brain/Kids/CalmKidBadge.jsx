import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";
import { Award, Wind, Flower2, Sun, Waves, BookOpenCheck } from 'lucide-react';

const CalmKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-40");
  const gameId = gameData?.id || "brain-kids-40";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CalmKidBadge, using fallback ID");
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Calm Breathing Challenge",
      description: "Choose the best way to stay calm!",
      icon: <Wind className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "When you feel stressed, what helps you stay calm?",
      options: [
        { 
          text: "Take deep breaths and count to 10", 
          emoji: "🌬️", 
          isCorrect: true
        },
        { 
          text: "Yell and get angry", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          text: "Panic and worry more", 
          emoji: "😱", 
          isCorrect: false
        },
        { 
          text: "Ignore the problem", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Calm Thoughts Quiz",
      description: "Test your calm thinking!",
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "What is the best way to think when you're upset?",
      options: [
        { 
          text: "Think negative thoughts", 
          emoji: "💔", 
          isCorrect: false
        },
        { 
          text: "Think positive and stay calm", 
          emoji: "✨", 
          isCorrect: true
        },
        { 
          text: "Think about giving up", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Don't think at all", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Calm Actions Reflex",
      description: "Quickly choose calm actions!",
      icon: <Flower2 className="w-8 h-8" />,
      color: "bg-pink-500",
      question: "Which action helps you feel peaceful?",
      options: [
        { 
          text: "Argue with others", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Rush around stressed", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "Relax and take a break", 
          emoji: "🧘", 
          isCorrect: true
        },
        { 
          text: "Complain about everything", 
          emoji: "😒", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Calm Response Puzzle",
      description: "Match calm responses to situations!",
      icon: <Sun className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "When someone makes you angry, what should you do?",
      options: [
        { 
          text: "Hit them back", 
          emoji: "👊", 
          isCorrect: false
        },
        { 
          text: "Scream at them", 
          emoji: "😱", 
          isCorrect: false
        },
        { 
          text: "Run away", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "Stay calm and talk it out", 
          emoji: "💬", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Calm Master Challenge",
      description: "Final calm challenge!",
      icon: <Waves className="w-8 h-8" />,
      color: "bg-cyan-500",
      question: "How can you become a calm kid?",
      options: [
        { 
          text: "Practice calm techniques daily", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          text: "Never feel emotions", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          text: "Always get angry", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          text: "Ignore your feelings", 
          emoji: "🙈", 
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
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Calm Kid Badge game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Badge: Calm Kid"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Earned!"}
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
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="text-3xl mb-3">{option.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CalmKidBadge;
