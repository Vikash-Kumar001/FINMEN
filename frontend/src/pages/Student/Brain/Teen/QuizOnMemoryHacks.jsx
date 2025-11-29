import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QuizOnMemoryHacks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-22";
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
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Which helps memory?",
      choices: [
        { id: 'a', text: 'Mnemonics' },
        { id: 'b', text: 'Ignoring information' },
        { id: 'c', text: 'Skipping sleep' }
      ],
      correct: 'a',
      explanation: 'Mnemonics like acronyms and visual associations help remember information easily by creating strong memory connections!'
    },
    {
      id: 2,
      text: "What's a good hack for remembering names?",
      choices: [
        { id: 'a', text: 'Association with faces' },
        { id: 'b', text: 'Ignoring them completely' },
        { id: 'c', text: 'Writing once only' }
      ],
      correct: 'a',
      explanation: 'Linking names to visual cues like faces or characteristics creates stronger memory associations and boosts recall!'
    },
    {
      id: 3,
      text: "Does chunking help with phone numbers?",
      choices: [
        { id: 'yes', text: 'Yes, breaking into groups helps' },
        { id: 'no', text: 'No, it makes it harder' },
        { id: 'maybe', text: 'Maybe, depends on the number' }
      ],
      correct: 'yes',
      explanation: 'Breaking information into smaller chunks (like 3-3-4 for phone numbers) makes it much easier to remember!'
    },
    {
      id: 4,
      text: "Which hack involves repeating information?",
      choices: [
        { id: 'a', text: 'Spaced repetition' },
        { id: 'b', text: 'Single read only' },
        { id: 'c', text: 'Distraction techniques' }
      ],
      correct: 'a',
      explanation: 'Spaced repetition involves reviewing material at increasing intervals, which reinforces memory over time!'
    },
    {
      id: 5,
      text: "Is mind mapping a visual memory hack?",
      choices: [
        { id: 'yes', text: 'Yes, it organizes info visually' },
        { id: 'no', text: 'No, it\'s only for writing' },
        { id: 'maybe', text: 'Maybe, depends on the topic' }
      ],
      correct: 'yes',
      explanation: 'Mind maps organize information visually, creating spatial relationships that make information easier to recall!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
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
      console.log(`🎮 Quiz on Memory Hacks game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Quiz on Memory Hacks"
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

export default QuizOnMemoryHacks;