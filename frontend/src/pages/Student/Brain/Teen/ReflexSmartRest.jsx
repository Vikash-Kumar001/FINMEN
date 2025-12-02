import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexSmartRest = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-69";
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
      text: "Tap for 'Nap Break,' avoid 'Overwork.'",
      options: [
        { id: "nap", text: "Nap Break", emoji: "😴", description: "Short rest to recharge", isCorrect: true },
        { id: "overwork", text: "Overwork", emoji: "😰", description: "Working without breaks", isCorrect: false },
        { id: "exhaust", text: "Exhaust Yourself", emoji: "💀", description: "Push until collapse", isCorrect: false },
        { id: "ignore", text: "Ignore Fatigue", emoji: "🙈", description: "Pretend you're not tired", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which action promotes smart rest?",
      options: [
        { id: "continuous", text: "Study Continuously", emoji: "📚", description: "No breaks at all", isCorrect: false },
        { id: "short", text: "Short Breaks During Study", emoji: "⏸️", description: "Regular rest intervals", isCorrect: true },
        { id: "push", text: "Push Through Exhaustion", emoji: "💪", description: "Ignore tiredness", isCorrect: false },
        { id: "skip", text: "Skip All Breaks", emoji: "🚫", description: "No rest time", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What's the smart way to handle fatigue?",
      options: [
        { id: "ignore", text: "Ignore Fatigue Signs", emoji: "😐", description: "Push through it", isCorrect: false },
        { id: "caffeine", text: "Rely Only on Caffeine", emoji: "☕", description: "Mask tiredness", isCorrect: false },
        { id: "work", text: "Work Until Collapse", emoji: "💀", description: "No limits", isCorrect: false },
        { id: "rest", text: "Take Rest When Needed", emoji: "🧘", description: "Listen to your body", isCorrect: true }
      ]
    },
    {
      id: 4,
      text: "Which rest strategy is most effective?",
      options: [
        { id: "strategic", text: "Strategic Rest Periods", emoji: "🎯", description: "Planned breaks", isCorrect: true },
        { id: "random", text: "Random Rest Times", emoji: "🎲", description: "No schedule", isCorrect: false },
        { id: "never", text: "Never Take Breaks", emoji: "🚫", description: "Continuous work", isCorrect: false },
        { id: "excessive", text: "Excessive Rest", emoji: "😴", description: "Too much rest", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "What helps maintain productivity and well-being?",
      options: [
        { id: "workonly", text: "Work Without Rest", emoji: "💼", description: "Burnout risk", isCorrect: false },
        { id: "restonly", text: "Rest Without Work", emoji: "🛋️", description: "No productivity", isCorrect: false },
        { id: "extreme", text: "Extreme Work or Rest", emoji: "🌊", description: "Unbalanced approach", isCorrect: false },
        { id: "balance", text: "Balance Work and Rest", emoji: "⚖️", description: "Sustainable approach", isCorrect: true }
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
      console.log(`🎮 Reflex Smart Rest game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Reflex Smart Rest"
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

export default ReflexSmartRest;
