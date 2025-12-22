import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationExamPrep = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-68";
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
      text: "Choices: (a) Study till 3 AM, (b) Sleep 8 hrs + study next day.",
      options: [
        { id: 'sleep', text: 'Sleep 8 hrs + study next day', description: 'Prioritize rest, then study', isCorrect: true },
        { id: 'study', text: 'Study till 3 AM', description: 'Sacrifice sleep for study', isCorrect: false },
        { id: 'skip', text: 'Skip both sleep and study', description: 'Avoid responsibilities', isCorrect: false },
        { id: 'cram', text: 'Cram all night before exam', description: 'Last-minute studying', isCorrect: false }
      ],
      correct: 'sleep',
      explanation: 'Getting 8 hours of sleep and studying the next day leads to better memory consolidation, focus, and exam performance!'
    },
    {
      id: 2,
      text: "You have an exam tomorrow. What's the best preparation strategy?",
      options: [
        { id: 'allnight', text: 'Stay up all night studying', description: 'Exhausting approach', isCorrect: false },
        { id: 'plan', text: 'Study during the day, sleep 8-10 hours', description: 'Balanced approach', isCorrect: true },
        { id: 'panic', text: 'Panic and study continuously', description: 'Stressful approach', isCorrect: false },
        { id: 'ignore', text: 'Ignore the exam completely', description: 'Avoidance approach', isCorrect: false }
      ],
      correct: 'plan',
      explanation: 'Studying during the day when alert and getting adequate sleep ensures better retention and performance!'
    },
    {
      id: 3,
      text: "How should you balance study time and sleep before an exam?",
      options: [
        { id: 'cram', text: 'Cram the night before, skip sleep', description: 'Short-term approach', isCorrect: false },
        { id: 'stress', text: 'Study constantly, minimal sleep', description: 'Exhausting approach', isCorrect: false },
        { id: 'procrastinate', text: 'Procrastinate, then panic study', description: 'Ineffective approach', isCorrect: false },
        { id: 'balance', text: 'Study in advance, maintain sleep schedule', description: 'Long-term preparation', isCorrect: true }
      ],
      correct: 'balance',
      explanation: 'Studying in advance and maintaining your sleep schedule leads to better memory consolidation and exam performance!'
    },
    {
      id: 4,
      text: "What's the impact of sleep on exam performance?",
      options: [
        { id: 'positive', text: 'Adequate sleep improves memory and focus', description: 'Enhances performance', isCorrect: true },
        { id: 'negative', text: 'Sleep reduces study time', description: 'Misconception', isCorrect: false },
        { id: 'none', text: 'Sleep has no effect on exams', description: 'Incorrect belief', isCorrect: false },
        { id: 'harmful', text: 'More sleep means less study time', description: 'False trade-off', isCorrect: false }
      ],
      correct: 'positive',
      explanation: 'Adequate sleep improves memory consolidation, focus, and cognitive function, leading to better exam performance!'
    },
    {
      id: 5,
      text: "What's the best approach for exam preparation?",
      options: [
        { id: 'lastminute', text: 'Last-minute all-night study sessions', description: 'Ineffective approach', isCorrect: false },
        { id: 'sacrifice', text: 'Sacrifice sleep for extra study hours', description: 'Counterproductive', isCorrect: false },
        { id: 'random', text: 'Random study times, irregular sleep', description: 'Unpredictable approach', isCorrect: false },
        { id: 'routine', text: 'Regular study schedule with consistent sleep', description: 'Sustainable approach', isCorrect: true }
      ],
      correct: 'routine',
      explanation: 'A regular study schedule combined with consistent sleep creates the best conditions for learning and exam success!'
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
      console.log(`🎮 Simulation: Exam Prep game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Simulation: Exam Prep"
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

export default SimulationExamPrep;
