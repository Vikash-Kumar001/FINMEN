import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexBrainBoost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-9";
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const timerRef = useRef(null);

  const questions = [
    {
      id: 1,
      text: "Which food is best for brain health?",
      options: [
        { 
          id: "fish", 
          text: "Fish (Omega-3)", 
          emoji: "🐟", 
          description: "Supports brain function and development",
          isCorrect: true
        },
        { 
          id: "candy", 
          text: "Candy", 
          emoji: "🍬", 
          description: "Causes energy crashes and poor concentration",
          isCorrect: false
        },
        { 
          id: "carrots", 
          text: "Carrots (Vitamins)", 
          emoji: "🥕", 
          description: "Rich in antioxidants for brain health",
          isCorrect: false
        },
        { 
          id: "burger", 
          text: "Fast Food Burger", 
          emoji: "🍔", 
          description: "High in unhealthy fats that slow brain function",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What helps boost brain function?",
      options: [
        { 
          id: "energy", 
          text: "Energy Drink", 
          emoji: "⚡", 
          description: "Leads to crashes and disrupts sleep patterns",
          isCorrect: false
        },
        { 
          id: "greens", 
          text: "Leafy Greens", 
          emoji: "🥬", 
          description: "Contains folate which improves cognitive function",
          isCorrect: true
        },
        { 
          id: "apples", 
          text: "Apples (Fiber)", 
          emoji: "🍎", 
          description: "Steady energy source for sustained focus",
          isCorrect: false
        },
        { 
          id: "coffee", 
          text: "Coffee (Too much)", 
          emoji: "☕", 
          description: "Excess caffeine causes jitters and anxiety",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which is good for your brain?",
      options: [
        { 
          id: "junk", 
          text: "Processed Junk Food", 
          emoji: "🍟", 
          description: "High in trans fats that impair memory",
          isCorrect: false
        },
        { 
          id: "soda", 
          text: "Sugary Soda", 
          emoji: "🥤", 
          description: "Causes blood sugar spikes and crashes",
          isCorrect: false
        },
        { 
          id: "nuts", 
          text: "Nuts and Seeds", 
          emoji: "🥜", 
          description: "Rich in healthy fats and vitamin E",
          isCorrect: true
        },
        { 
          id: "berries", 
          text: "Berries", 
          emoji: "🫐", 
          description: "Antioxidants protect brain cells",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What supports cognitive performance?",
      options: [
        { 
          id: "chips", 
          text: "Potato Chips", 
          emoji: "🍟", 
          description: "High in sodium and unhealthy fats",
          isCorrect: false
        },
        { 
          id: "ice", 
          text: "Ice Cream", 
          emoji: "🍦", 
          description: "High sugar content causes brain fog",
          isCorrect: false
        },
        { 
          id: "water", 
          text: "Water", 
          emoji: "💧", 
          description: "Essential for optimal brain function",
          isCorrect: false
        },
        { 
          id: "dark", 
          text: "Dark Chocolate", 
          emoji: "🍫", 
          description: "Contains flavonoids that improve blood flow to brain",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Which food boosts brain power?",
      options: [
        { 
          id: "whole", 
          text: "Whole Grains", 
          emoji: "🌾", 
          description: "Provides steady glucose for brain energy",
          isCorrect: true
        },
        { 
          id: "pizza", 
          text: "Pizza", 
          emoji: "🍕", 
          description: "High in processed ingredients",
          isCorrect: false
        },
        { 
          id: "eggs", 
          text: "Eggs", 
          emoji: "🥚", 
          description: "Rich in choline for memory and learning",
          isCorrect: false
        },
        { 
          id: "donut", 
          text: "Donuts", 
          emoji: "🍩", 
          description: "Causes rapid blood sugar spikes",
          isCorrect: false
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!showResult && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [answered, showResult, currentQuestion]);

  // Reset timer when question changes
  useEffect(() => {
    if (!showResult) {
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
      setSelectedOptionId(null);
    }
  }, [currentQuestion, showResult]);

  const handleTimeUp = () => {
    if (answered) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setAnswered(true);
    resetFeedback();
    showCorrectAnswerFeedback(0, false);
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1500);
  };

  const handleChoice = (option) => {
    if (answered) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setAnswered(true);
    setSelectedOptionId(option.id);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Reflex Brain Boost game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];
  const timerColor = timeLeft <= 3 ? 'text-red-400' : timeLeft <= 6 ? 'text-yellow-400' : 'text-green-400';

  return (
    <GameShell
      title="Reflex Brain Boost"
      score={coins}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={showResult}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
                  <div className={`text-lg md:text-xl font-bold ${timerColor}`}>
                    ⏱️ {timeLeft}s
                  </div>
                </div>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentQuestionData.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
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
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl">{option.emoji}</span>
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm md:text-base mb-1">{option.text}</div>
                          <div className="text-white/80 text-xs md:text-sm">{option.description}</div>
                        </div>
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

export default ReflexBrainBoost;
