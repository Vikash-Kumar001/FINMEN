import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const QUESTION_TIME = 10; // 10 seconds per question

const SleepHabitsReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-63");
  const gameId = gameData?.id || "brain-kids-63";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepHabitsReflex, using fallback ID");
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
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is a good sleep habit?",
      options: [
        { 
          id: "bedtime", 
          text: "Going to bed at bedtime", 
          emoji: "🌙", 
          description: "A healthy sleep routine",
          isCorrect: true
        },
        { 
          id: "late-gaming", 
          text: "Playing games late at night", 
          emoji: "🎮", 
          description: "Disrupts sleep schedule",
          isCorrect: false
        },
        { 
          id: "all-night", 
          text: "Staying up all night", 
          emoji: "😴", 
          description: "Bad for your health",
          isCorrect: false
        },
        { 
          id: "screens", 
          text: "Watching screens before bed", 
          emoji: "📱", 
          description: "Makes it harder to sleep",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which is a good sleep habit?",
      options: [
        { 
          id: "caffeine", 
          text: "Drinking coffee before bed", 
          emoji: "☕", 
          description: "Keeps you awake",
          isCorrect: false
        },
        { 
          id: "quiet-time", 
          text: "Having quiet time before bed", 
          emoji: "🧘", 
          description: "Helps you relax and sleep",
          isCorrect: true
        },
        { 
          id: "loud-music", 
          text: "Listening to loud music", 
          emoji: "🔊", 
          description: "Makes it hard to sleep",
          isCorrect: false
        },
        { 
          id: "exercise", 
          text: "Intense exercise right before bed", 
          emoji: "🏃", 
          description: "Can keep you awake",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which is a good sleep habit?",
      options: [
        { 
          id: "irregular", 
          text: "Irregular sleep schedule", 
          emoji: "🔄", 
          description: "Disrupts your body clock",
          isCorrect: false
        },
        { 
          id: "skipping", 
          text: "Skipping sleep", 
          emoji: "😰", 
          description: "Bad for your health",
          isCorrect: false
        },
        { 
          id: "early-sleep", 
          text: "Going to sleep early", 
          emoji: "😴", 
          description: "Gives you enough rest",
          isCorrect: true
        },
        { 
          id: "oversleeping", 
          text: "Oversleeping every day", 
          emoji: "😴", 
          description: "Can make you feel tired",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which is a good sleep habit?",
      options: [
        { 
          id: "dark-room", 
          text: "Sleeping in a dark room", 
          emoji: "🌑", 
          description: "Helps you sleep better",
          isCorrect: true
        },
        { 
          id: "bright-lights", 
          text: "Sleeping with bright lights on", 
          emoji: "💡", 
          description: "Makes it hard to sleep",
          isCorrect: false
        },
        { 
          id: "noise", 
          text: "Sleeping with loud noise", 
          emoji: "🔊", 
          description: "Disrupts your sleep",
          isCorrect: false
        },
        { 
          id: "messy", 
          text: "Sleeping in a messy room", 
          emoji: "📦", 
          description: "Can affect your rest",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which is a good sleep habit?",
      options: [
        { 
          id: "random", 
          text: "Random sleep times", 
          emoji: "🎲", 
          description: "Disrupts your sleep pattern",
          isCorrect: false
        },
        { 
          id: "stress", 
          text: "Going to bed stressed", 
          emoji: "😰", 
          description: "Makes it hard to sleep",
          isCorrect: false
        },
        { 
          id: "eating", 
          text: "Eating heavy meals before bed", 
          emoji: "🍔", 
          description: "Can disrupt your sleep",
          isCorrect: false
        },
        { 
          id: "routine", 
          text: "Following a bedtime routine", 
          emoji: "📅", 
          description: "Helps your body prepare for sleep",
          isCorrect: true
        }
      ]
    }
  ];

  const handleTimeUp = useCallback(() => {
    if (!answered && currentQuestion < questions.length - 1) {
      // Time's up - move to next question (count as wrong)
      setAnswered(true);
      resetFeedback();
      showCorrectAnswerFeedback(0, false);
      
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }, 1000);
    } else if (!answered && currentQuestion === questions.length - 1) {
      // Last question and time's up
      setAnswered(true);
      setShowResult(true);
    }
  }, [answered, currentQuestion, questions.length, resetFeedback, showCorrectAnswerFeedback]);

  // Reset timer when question changes
  useEffect(() => {
    if (!showResult && currentQuestion < questions.length) {
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
    }
  }, [currentQuestion, showResult, questions.length]);

  // Timer effect
  useEffect(() => {
    if (!showResult && !answered && timeLeft > 0 && currentQuestion < questions.length) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            handleTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showResult, answered, timeLeft, currentQuestion, questions.length, handleTimeUp]);

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    // Clear timer when answered
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
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
        setAnswered(false);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Reflex Sleep Habits game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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

  return (
    <GameShell
      title="Reflex Sleep Habits"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="brain"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        {!showResult && currentQuestionData ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
              <span className="text-white/80 text-xs sm:text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold text-xs sm:text-sm md:text-base">Score: {score}/{questions.length}</span>
              <span className={`font-bold text-xs sm:text-sm md:text-base ${timeLeft <= 3 ? 'text-red-400' : timeLeft <= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                Time: {timeLeft}s
              </span>
            </div>
            
            <p className="text-white text-base sm:text-lg md:text-xl mb-4 sm:mb-5 md:mb-6 text-center">
              {currentQuestionData.text}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 active:scale-95 text-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{option.emoji}</div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{option.text}</h3>
                  <p className="text-white/90 text-xs sm:text-sm md:text-base leading-tight sm:leading-normal">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SleepHabitsReflex;
