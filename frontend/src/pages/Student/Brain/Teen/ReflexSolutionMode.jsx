import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexSolutionMode = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-83";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const timerRef = useRef(null);

  const questions = [
    {
      id: 1,
      text: "Which action shows solution-focused thinking?",
      options: [
        { id: "solution", text: "Find Solution", emoji: "💡", description: "Problem-solving approach", isCorrect: true },
        { id: "complain", text: "Complain", emoji: "😤", description: "Negative reaction", isCorrect: false },
        { id: "blame", text: "Blame Others", emoji: "👉", description: "Avoids responsibility", isCorrect: false },
        { id: "giveup", text: "Give Up", emoji: "🚫", description: "No action", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "What's the best response to a problem?",
      options: [
        { id: "ignore", text: "Ignore the Problem", emoji: "🙈", description: "Avoids addressing issue", isCorrect: false },
        { id: "analyze", text: "Analyze and Solve", emoji: "🔍", description: "Active problem-solving", isCorrect: true },
        { id: "panic", text: "Panic", emoji: "😰", description: "Unproductive reaction", isCorrect: false },
        { id: "quit", text: "Quit Immediately", emoji: "🏃", description: "No persistence", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "How should you approach challenges?",
      options: [
        { id: "same", text: "Do Same Thing", emoji: "🔄", description: "No innovation", isCorrect: false },
        { id: "avoid", text: "Avoid Challenges", emoji: "🚫", description: "No growth", isCorrect: false },
        { id: "creative", text: "Think Creatively", emoji: "🎨", description: "Innovative solutions", isCorrect: true },
        { id: "fear", text: "Fear Challenges", emoji: "😨", description: "Limiting mindset", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "What helps solve problems effectively?",
      options: [
        { id: "brainstorm", text: "Brainstorm Solutions", emoji: "🧠", description: "Multiple ideas", isCorrect: true },
        { id: "complain", text: "Complain Only", emoji: "😤", description: "No solutions", isCorrect: false },
        { id: "blame", text: "Blame Everything", emoji: "👆", description: "Unproductive", isCorrect: false },
        { id: "wait", text: "Wait for Others", emoji: "⏳", description: "No initiative", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Which mindset leads to success?",
      options: [
        { id: "problem", text: "Problem-Focused", emoji: "❌", description: "Only sees problems", isCorrect: false },
        { id: "solve", text: "Solution-Oriented", emoji: "✅", description: "Focused on solving", isCorrect: true },
        { id: "negative", text: "Negative Thinking", emoji: "😔", description: "Defeatist attitude", isCorrect: false },
        { id: "avoid", text: "Avoidance", emoji: "🙈", description: "Runs from problems", isCorrect: false }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (answered || showResult) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - move to next question
          handleTimeUp();
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, answered, showResult]);

  const handleTimeUp = () => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();
    showCorrectAnswerFeedback(0, false);
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
      setSelectedOptionId(null);
    } else {
      setShowResult(true);
    }
  };

  const handleOptionClick = (optionId, isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedOptionId(optionId);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Reflex Solution Mode game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Reflex Solution Mode"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={showResult}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!showResult && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
                  <div className="bg-red-500/20 px-3 py-1 rounded-lg border border-red-400/30">
                    <span className="text-red-300 font-bold text-sm md:text-base">⏱️ {timeLeft}s</span>
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
                      onClick={() => handleOptionClick(option.id, option.isCorrect)}
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-white font-bold text-sm md:text-base">{option.text}</span>
                      </div>
                      <div className="text-white/70 text-xs md:text-sm">{option.description}</div>
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

export default ReflexSolutionMode;
