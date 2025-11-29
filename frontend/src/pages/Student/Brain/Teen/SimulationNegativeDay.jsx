import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationNegativeDay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-58";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Bad day at school. Choices: (a) Stay upset, (b) Think of positives, (c) Quit tasks. Correct = Think of positives.",
      options: [
        { id: 'think', text: 'Think of positives', description: 'Reframe the situation', isCorrect: true },
        { id: 'stay', text: 'Stay upset', description: 'Dwell on negative feelings', isCorrect: false },
        { id: 'quit', text: 'Quit tasks', description: 'Give up on responsibilities', isCorrect: false },
        { id: 'ignore', text: 'Ignore the day', description: 'Avoid dealing with it', isCorrect: false }
      ],
      correct: 'think',
      explanation: 'Thinking of positives helps reframe the situation, improves mood, and helps you move forward constructively!'
    },
    {
      id: 2,
      text: "You got a bad grade. How should you respond?",
      options: [
        { id: 'learn', text: 'Learn from mistakes and improve', description: 'Growth mindset approach', isCorrect: true },
        { id: 'blame', text: 'Blame the teacher', description: 'Avoids responsibility', isCorrect: false },
        { id: 'giveup', text: 'Give up on the subject', description: 'No growth', isCorrect: false },
        { id: 'ignore', text: 'Ignore the grade', description: 'Doesn\'t address problem', isCorrect: false }
      ],
      correct: 'learn',
      explanation: 'Learning from mistakes and focusing on improvement turns setbacks into opportunities for growth!'
    },
    {
      id: 3,
      text: "Friends excluded you. What's the best approach?",
      options: [
        { id: 'reflect', text: 'Reflect, then find supportive friends', description: 'Healthy response', isCorrect: true },
        { id: 'revenge', text: 'Seek revenge', description: 'Escalates conflict', isCorrect: false },
        { id: 'isolate', text: 'Isolate completely', description: 'Limits social connections', isCorrect: false },
        { id: 'blame', text: 'Blame yourself harshly', description: 'Damages self-esteem', isCorrect: false }
      ],
      correct: 'reflect',
      explanation: 'Reflecting on the situation and seeking supportive relationships helps you move forward positively!'
    },
    {
      id: 4,
      text: "Everything seems to go wrong. What should you do?",
      options: [
        { id: 'gratitude', text: 'Find things to be grateful for', description: 'Shifts perspective', isCorrect: true },
        { id: 'dwell', text: 'Dwell on everything wrong', description: 'Maintains negative state', isCorrect: false },
        { id: 'blame', text: 'Blame everything external', description: 'No personal control', isCorrect: false },
        { id: 'quit', text: 'Quit everything', description: 'Gives up control', isCorrect: false }
      ],
      correct: 'gratitude',
      explanation: 'Practicing gratitude helps shift your perspective and find positive aspects even in difficult times!'
    },
    {
      id: 5,
      text: "After a negative day, how should you end it?",
      options: [
        { id: 'reflect', text: 'Reflect on lessons and plan better tomorrow', description: 'Constructive approach', isCorrect: true },
        { id: 'dwell', text: 'Dwell on all the negatives', description: 'Maintains negative state', isCorrect: false },
        { id: 'ignore', text: 'Ignore the day completely', description: 'Misses learning', isCorrect: false },
        { id: 'blame', text: 'Blame others for everything', description: 'No personal growth', isCorrect: false }
      ],
      correct: 'reflect',
      explanation: 'Reflecting on lessons learned and planning for a better tomorrow helps you grow and move forward!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Auto-advance to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setFeedbackType(null);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Simulation: Negative Day game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [levelCompleted, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Simulation: Negative Day"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentQuestionData.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && isSelected && option.id === questions[currentQuestion].correct;
                  const showIncorrect = showFeedback && isSelected && option.id !== questions[currentQuestion].correct;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={!!selectedOption}
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
                      <div className="text-white font-bold text-sm md:text-base mb-1">{option.text}</div>
                      <div className="text-white/70 text-xs md:text-sm">{option.description}</div>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && feedbackType === "wrong" && (
                <div className="mt-4 md:mt-6 text-white/90 text-center text-sm md:text-base">
                  <p>💡 {currentQuestionData.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationNegativeDay;
