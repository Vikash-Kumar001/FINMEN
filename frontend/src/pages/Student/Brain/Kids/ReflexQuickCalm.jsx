import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexQuickCalm = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-39");
  const gameId = gameData?.id || "brain-kids-39";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexQuickCalm, using fallback ID");
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
      text: "Which action helps you stay calm?",
      options: [
        { 
          id: "smile", 
          text: "Smile", 
          emoji: "😊", 
          description: "A positive, calm action",
          isCorrect: true
        },
        { 
          id: "yell", 
          text: "Yell", 
          emoji: "😡", 
          description: "Not a calm action",
          isCorrect: false
        },
        { 
          id: "panic", 
          text: "Panic", 
          emoji: "😱", 
          description: "Increases stress and anxiety",
          isCorrect: false
        },
        { 
          id: "rush", 
          text: "Rush around", 
          emoji: "🏃", 
          description: "Makes stress worse",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What helps you relax when stressed?",
      options: [
        { 
          id: "worry", 
          text: "Worry more", 
          emoji: "😰", 
          description: "Increases anxiety",
          isCorrect: false
        },
        { 
          id: "breathe", 
          text: "Breathe deeply", 
          emoji: "🌬️", 
          description: "A calming action",
          isCorrect: true
        },
        { 
          id: "scream", 
          text: "Scream", 
          emoji: "😱", 
          description: "Makes you more upset",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          description: "Doesn't help you relax",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which is a calm way to handle anger?",
      options: [
        { 
          id: "hit", 
          text: "Hit something", 
          emoji: "👊", 
          description: "Not a healthy way to handle anger",
          isCorrect: false
        },
        { 
          id: "blame", 
          text: "Blame others", 
          emoji: "👆", 
          description: "Doesn't help you calm down",
          isCorrect: false
        },
        { 
          id: "count", 
          text: "Count to 10", 
          emoji: "🔢", 
          description: "Helps you calm down",
          isCorrect: true
        },
        { 
          id: "cry", 
          text: "Cry and give up", 
          emoji: "😢", 
          description: "Doesn't solve the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps you feel peaceful?",
      options: [
        { 
          id: "argue", 
          text: "Argue", 
          emoji: "😤", 
          description: "Creates tension",
          isCorrect: false
        },
        { 
          id: "complain", 
          text: "Complain", 
          emoji: "😒", 
          description: "Doesn't help you feel better",
          isCorrect: false
        },
        { 
          id: "stress", 
          text: "Stress out", 
          emoji: "😓", 
          description: "Increases worry",
          isCorrect: false
        },
        { 
          id: "relax", 
          text: "Relax and rest", 
          emoji: "🧘", 
          description: "A positive, calm action",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Which action keeps you calm?",
      options: [
        { 
          id: "negative", 
          text: "Think negative thoughts", 
          emoji: "💔", 
          description: "Makes you more upset",
          isCorrect: false
        },
        { 
          id: "positive", 
          text: "Think positive thoughts", 
          emoji: "✨", 
          description: "Helps maintain calm",
          isCorrect: true
        },
        { 
          id: "avoid", 
          text: "Avoid the problem", 
          emoji: "🏃", 
          description: "Doesn't help you stay calm",
          isCorrect: false
        },
        { 
          id: "overthink", 
          text: "Overthink everything", 
          emoji: "🤯", 
          description: "Increases stress",
          isCorrect: false
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
      console.log(`🎮 Reflex Quick Calm game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Reflex Quick Calm"
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
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && currentQuestionData ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400' : timeLeft <= 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                Time: {timeLeft}s
              </span>
            </div>
            
            <p className="text-white text-lg mb-6">
              {currentQuestionData.text}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="text-3xl mb-3">{option.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                  <p className="text-white/90 text-sm">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ReflexQuickCalm;
