import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexEmotions = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-43");
  const gameId = gameData?.id || "brain-kids-43";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexEmotions, using fallback ID");
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
      text: "Which word is an emotion?",
      options: [
        { 
          id: "happy", 
          text: "Happy", 
          emoji: "😊", 
          description: "A feeling of joy",
          isCorrect: true
        },
        { 
          id: "book", 
          text: "Book", 
          emoji: "📚", 
          description: "An object you read",
          isCorrect: false
        },
        { 
          id: "table", 
          text: "Table", 
          emoji: "🪑", 
          description: "A piece of furniture",
          isCorrect: false
        },
        { 
          id: "pencil", 
          text: "Pencil", 
          emoji: "✏️", 
          description: "A writing tool",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which word is an emotion?",
      options: [
        { 
          id: "car", 
          text: "Car", 
          emoji: "🚗", 
          description: "A vehicle",
          isCorrect: false
        },
        { 
          id: "sad", 
          text: "Sad", 
          emoji: "😢", 
          description: "A feeling of unhappiness",
          isCorrect: true
        },
        { 
          id: "ball", 
          text: "Ball", 
          emoji: "⚽", 
          description: "A toy for playing",
          isCorrect: false
        },
        { 
          id: "chair", 
          text: "Chair", 
          emoji: "🪑", 
          description: "Something you sit on",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which word is an emotion?",
      options: [
        { 
          id: "tree", 
          text: "Tree", 
          emoji: "🌳", 
          description: "A plant",
          isCorrect: false
        },
        { 
          id: "sun", 
          text: "Sun", 
          emoji: "☀️", 
          description: "A star in the sky",
          isCorrect: false
        },
        { 
          id: "angry", 
          text: "Angry", 
          emoji: "😡", 
          description: "A feeling of being mad",
          isCorrect: true
        },
        { 
          id: "cup", 
          text: "Cup", 
          emoji: "☕", 
          description: "Something you drink from",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which word is an emotion?",
      options: [
        { 
          id: "excited", 
          text: "Excited", 
          emoji: "🎉", 
          description: "A feeling of enthusiasm",
          isCorrect: true
        },
        { 
          id: "phone", 
          text: "Phone", 
          emoji: "📱", 
          description: "A device for calling",
          isCorrect: false
        },
        { 
          id: "door", 
          text: "Door", 
          emoji: "🚪", 
          description: "An entrance",
          isCorrect: false
        },
        { 
          id: "lamp", 
          text: "Lamp", 
          emoji: "💡", 
          description: "Gives light",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which word is an emotion?",
      options: [
        { 
          id: "scared", 
          text: "Scared", 
          emoji: "😨", 
          description: "A feeling of fear",
          isCorrect: true
        },
        { 
          id: "window", 
          text: "Window", 
          emoji: "🪟", 
          description: "Glass in a wall",
          isCorrect: false
        },
        { 
          id: "bike", 
          text: "Bike", 
          emoji: "🚲", 
          description: "A two-wheeled vehicle",
          isCorrect: false
        },
        { 
          id: "clock", 
          text: "Clock", 
          emoji: "🕐", 
          description: "Shows time",
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
      console.log(`🎮 Reflex Emotions game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Reflex Emotions"
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
              <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400' : timeLeft <= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
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

export default ReflexEmotions;
