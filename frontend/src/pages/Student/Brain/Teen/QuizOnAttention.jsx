import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QuizOnAttention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-12";
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({}); // Track answers for each question

  const questions = [
    {
      id: 1,
      text: "Which of these boosts focus the most?",
      choices: [
        { id: 'a', text: 'Multitasking' },
        { id: 'b', text: 'Single task' },
        { id: 'c', text: 'Daydreaming' }
      ],
      correct: 'b',
      explanation: 'Focusing on one task at a time (single-tasking) improves concentration and productivity. Multitasking actually reduces efficiency and increases errors!'
    },
    {
      id: 2,
      text: "What is the effect of digital multitasking on productivity?",
      choices: [
        { id: 'a', text: 'Increases productivity by 40%' },
        { id: 'b', text: 'Reduces productivity by up to 40%' },
        { id: 'c', text: 'Has no measurable effect' }
      ],
      correct: 'b',
      explanation: 'Research shows that digital multitasking can reduce productivity by up to 40% due to task-switching costs!'
    },
    {
      id: 3,
      text: "Which technique helps maintain sustained attention?",
      choices: [
        { id: 'a', text: 'Checking phone every 5 minutes' },
        { id: 'b', text: 'Pomodoro Technique (25 min focus + 5 min break)' },
        { id: 'c', text: 'Working for 8 hours straight' }
      ],
      correct: 'b',
      explanation: 'The Pomodoro Technique helps maintain focus by breaking work into intervals with planned breaks!'
    },
    {
      id: 4,
      text: "How does sleep deprivation affect attention?",
      choices: [
        { id: 'a', text: 'Improves alertness' },
        { id: 'b', text: 'Impairs concentration and reaction time' },
        { id: 'c', text: 'Only affects physical performance' }
      ],
      correct: 'b',
      explanation: 'Sleep deprivation significantly impairs attention, concentration, and reaction time, making it harder to focus!'
    },
    {
      id: 5,
      text: "What environmental factor most improves focus?",
      choices: [
        { id: 'a', text: 'Noisy, chaotic environment' },
        { id: 'b', text: 'Organized, distraction-free space' },
        { id: 'c', text: 'Dimly lit room' }
      ],
      correct: 'b',
      explanation: 'An organized, distraction-free environment minimizes interruptions and helps maintain sustained attention!'
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
      console.log(`🎮 Quiz on Attention game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Quiz on Attention"
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
            <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
              {currentQuestionData.text}
            </p>
            
            <div className="space-y-3 md:space-y-4">
              {currentQuestionData.choices.map((choice) => {
                const isSelected = selectedOption === choice.id;
                const showCorrect = showFeedback && choice.id === questions[currentQuestion].correct;
                const showIncorrect = showFeedback && isSelected && !showCorrect;
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleOptionSelect(choice.id)}
                    disabled={!!selectedOption}
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl transition-all transform text-left ${
                      showCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                        : showIncorrect
                        ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                        : isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                    } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <div className="text-white font-bold text-sm md:text-base">{choice.text}</div>
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizOnAttention;