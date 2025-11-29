import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';
import { Target, Zap, Award, Star, Trophy, Shield } from 'lucide-react';

const BadgeStressManager = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-40";
  const gameData = getGameDataById(gameId);
  
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
      const games = getBrainTeenGames({});
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
      title: "Stress Challenge 1",
      description: "Beat your first stress challenge!",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "What is an effective stress management technique?",
      options: [
        { text: "Deep breathing exercises", emoji: "🌬️", isCorrect: true },
        { text: "Ignore your feelings", emoji: "🙈", isCorrect: false },
        { text: "Bottle up emotions", emoji: "🔒", isCorrect: false },
        { text: "Avoid all challenges", emoji: "🏃", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Stress Challenge 2",
      description: "Master time management!",
      icon: <Target className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "How can you manage time to reduce stress?",
      options: [
        { text: "Plan your day and prioritize", emoji: "🗓️", isCorrect: true },
        { text: "Procrastinate on everything", emoji: "⌛", isCorrect: false },
        { text: "Do everything at once", emoji: "🤹", isCorrect: false },
        { text: "Avoid planning", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Stress Challenge 3",
      description: "Develop positive thinking!",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "How does positive thinking help with stress?",
      options: [
        { text: "Improves coping and resilience", emoji: "😊", isCorrect: true },
        { text: "Makes stress worse", emoji: "😔", isCorrect: false },
        { text: "Has no effect", emoji: "⚪", isCorrect: false },
        { text: "Only works for some people", emoji: "👥", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Stress Challenge 4",
      description: "Build your support network!",
      icon: <Award className="w-8 h-8" />,
      color: "bg-green-500",
      question: "What should you do when feeling overwhelmed?",
      options: [
        { text: "Talk to someone you trust", emoji: "🗣️", isCorrect: true },
        { text: "Bottle up your feelings", emoji: "🔒", isCorrect: false },
        { text: "Isolate yourself completely", emoji: "🚶", isCorrect: false },
        { text: "Ignore the problem", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Stress Challenge 5",
      description: "Master self-care!",
      icon: <Star className="w-8 h-8" />,
      color: "bg-red-500",
      question: "Why is a self-care routine important?",
      options: [
        { text: "Prevents burnout and maintains balance", emoji: "🧴", isCorrect: true },
        { text: "Wastes valuable time", emoji: "⏰", isCorrect: false },
        { text: "Only for weak people", emoji: "💪", isCorrect: false },
        { text: "Not necessary", emoji: "❌", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return;
    
    setSelectedAnswer(option);
    setAnswered(true);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (challenge < challenges.length - 1) {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Stress Manager game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Badge: Stress Manager"
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={showResult}
      maxScore={challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!showResult && currentChallenge ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{challenges.length}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className={`${currentChallenge.color} p-3 rounded-xl`}>
                  {currentChallenge.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{currentChallenge.title}</h3>
                  <p className="text-white/70 text-sm md:text-base">{currentChallenge.description}</p>
                </div>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentChallenge.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                      className={`p-4 md:p-6 rounded-xl md:rounded-2xl transition-all transform text-left ${
                        showCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                          : showIncorrect
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                          : isSelected
                          ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                      } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-white font-bold text-sm md:text-base">{option.text}</span>
                      </div>
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

export default BadgeStressManager;
