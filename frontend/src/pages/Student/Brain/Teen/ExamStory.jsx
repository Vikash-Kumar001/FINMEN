import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const ExamStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-11";
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
      text: "Jamie studies for 1 hour with their phone nearby. Will this lead to strong focus?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' },
        { id: 'maybe', text: 'Maybe, depends on the person' }
      ],
      correct: 'no',
      explanation: 'Having your phone nearby while studying is a major distraction that reduces focus and retention. A phone-free environment is best for effective studying!'
    },
    {
      id: 2,
      text: "What is the most effective study technique for long-term retention?",
      choices: [
        { id: 'a', text: 'Cramming the night before' },
        { id: 'b', text: 'Spaced repetition' },
        { id: 'c', text: 'Highlighting text only' }
      ],
      correct: 'b',
      explanation: 'Spaced repetition involves reviewing material at increasing intervals, which strengthens long-term memory retention!'
    },
    {
      id: 3,
      text: "How does multitasking affect exam performance?",
      choices: [
        { id: 'a', text: 'Improves performance' },
        { id: 'b', text: 'Reduces efficiency by up to 40%' },
        { id: 'c', text: 'Has no effect' }
      ],
      correct: 'b',
      explanation: 'Multitasking actually reduces productivity and increases errors, as the brain struggles to switch between tasks!'
    },
    {
      id: 4,
      text: "What is the benefit of taking short breaks during study sessions?",
      choices: [
        { id: 'a', text: 'Decreases focus' },
        { id: 'b', text: 'Prevents mental fatigue' },
        { id: 'c', text: 'Wastes valuable study time' }
      ],
      correct: 'b',
      explanation: 'Short breaks help prevent mental fatigue and maintain optimal concentration throughout study sessions!'
    },
    {
      id: 5,
      text: "Which environment is best for exam preparation?",
      choices: [
        { id: 'a', text: 'Noisy café with friends' },
        { id: 'b', text: 'Quiet, dedicated study space' },
        { id: 'c', text: 'Loud party atmosphere' }
      ],
      correct: 'b',
      explanation: 'A quiet, dedicated study space minimizes distractions and maximizes focus and retention!'
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
      console.log(`🎮 Exam Story game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Exam Story"
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

export default ExamStory;