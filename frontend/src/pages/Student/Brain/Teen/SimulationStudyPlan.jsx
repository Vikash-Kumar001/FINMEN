import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationStudyPlan = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-18";
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

  const questions = [
    {
      id: 1,
      text: "You have 2 hours available for studying. Which environment will help you focus best?",
      options: [
        { 
          id: 'quiet', 
          text: 'Quiet study area', 
          description: 'Dedicated study space with no distractions' 
        },
        { 
          id: 'phone', 
          text: 'Phone + book', 
          description: 'Study with phone nearby for breaks' 
        },
        { 
          id: 'tv', 
          text: 'Study with TV on', 
          description: 'Background entertainment while studying' 
        },
        { 
          id: 'bed', 
          text: 'Study in bed', 
          description: 'Comfortable but not ideal for focus' 
        }
      ],
      correct: "quiet",
      explanation: "A quiet study environment without distractions is optimal for concentration and learning. Having your phone nearby significantly reduces focus and retention!"
    },
    {
      id: 2,
      text: "You're feeling overwhelmed with assignments. What's the best approach?",
      options: [
        { 
          id: 'procrastinate', 
          text: 'Procrastinate and do last minute', 
          description: 'Delay work until deadline' 
        },
        { 
          id: 'breakdown', 
          text: 'Break tasks into smaller parts', 
          description: 'Create manageable chunks' 
        },
        { 
          id: 'panic', 
          text: 'Panic and stress out', 
          description: 'Feel anxious about workload' 
        },
        { 
          id: 'ignore', 
          text: 'Ignore some assignments', 
          description: 'Skip difficult tasks' 
        }
      ],
      correct: "breakdown",
      explanation: "Breaking large tasks into smaller, manageable parts reduces overwhelm and makes progress feel achievable. This approach improves motivation and reduces stress!"
    },
    {
      id: 3,
      text: "During exam week, how should you manage your time?",
      options: [
        { 
          id: 'cram', 
          text: 'Cram all night before', 
          description: 'Study intensively at last minute' 
        },
        { 
          id: 'random', 
          text: 'Study randomly when you feel like it', 
          description: 'No structured approach' 
        },
        { 
          id: 'schedule', 
          text: 'Create study schedule', 
          description: 'Plan study sessions in advance' 
        },
        { 
          id: 'skip', 
          text: 'Skip studying and hope for best', 
          description: 'Minimal preparation' 
        }
      ],
      correct: "schedule",
      explanation: "A structured study schedule helps distribute workload evenly, reduces stress, and improves retention. Consistent study habits are more effective than last-minute cramming!"
    },
    {
      id: 4,
      text: "You've been studying for 90 minutes straight. What should you do?",
      options: [
        { 
          id: 'continue', 
          text: 'Keep studying without break', 
          description: 'Push through fatigue' 
        },
        { 
          id: 'quit', 
          text: 'Stop studying for the day', 
          description: 'End session early' 
        },
        { 
          id: 'snack', 
          text: 'Eat sugary snacks for energy', 
          description: 'Quick energy boost' 
        },
        { 
          id: 'break', 
          text: 'Take a 10-minute break', 
          description: 'Rest to refresh your mind' 
        }
      ],
      correct: "break",
      explanation: "Taking regular breaks prevents mental fatigue and maintains focus. The brain needs rest periods to consolidate information and maintain optimal performance!"
    },
    {
      id: 5,
      text: "How should you prepare for a difficult subject?",
      options: [
        { 
          id: 'early', 
          text: 'Start early and review regularly', 
          description: 'Consistent preparation approach' 
        },
        { 
          id: 'avoid', 
          text: 'Avoid and focus on easy subjects', 
          description: 'Skip challenging material' 
        },
        { 
          id: 'intense', 
          text: 'Intense single session', 
          description: 'One long study period' 
        },
        { 
          id: 'copy', 
          text: 'Copy friend\'s notes last minute', 
          description: 'Passive learning approach' 
        }
      ],
      correct: "early",
      explanation: "Starting early with regular review builds strong foundations and reduces anxiety. Spaced repetition and consistent effort are key to mastering difficult subjects!"
    }
  ];

  const currentScenario = questions[currentQuestion] || null;

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === currentScenario.correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Auto-move to next question or complete after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Simulation: Study Plan game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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

  return (
    <GameShell
      title="Simulation: Study Plan"
      score={score}
      subtitle={!levelCompleted ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
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
      showConfetti={levelCompleted && score === questions.length}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!levelCompleted && currentScenario ? (
          <div className="w-full max-w-4xl space-y-6">
            <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-white/20 shadow-2xl">
              {/* Header Section */}
              <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <span className="text-5xl md:text-6xl">📚</span>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Study Plan Simulator
                  </h3>
                </div>
                <div className="flex justify-center items-center gap-3 text-white/60 text-sm md:text-base">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>•</span>
                  <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 border-2 border-purple-400/50 rounded-2xl p-5 md:p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl md:text-4xl">💭</div>
                  <p className="text-base md:text-lg lg:text-xl font-semibold text-white leading-relaxed flex-1">
                    {currentScenario.text}
                  </p>
                </div>
              </div>
              
              {/* Options Section */}
              <div className="mb-6">
                <h4 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-5 text-center">
                  Choose the best option: 🤔
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentScenario.options.map((option, index) => {
                    const isSelected = selectedOption === option.id;
                    const showCorrect = showFeedback && isSelected && option.id === currentScenario.correct;
                    const showIncorrect = showFeedback && isSelected && option.id !== currentScenario.correct;
                  
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={!!selectedOption}
                        className={`w-full p-5 md:p-6 rounded-2xl transition-all transform text-left relative overflow-hidden border-2 ${
                          showCorrect
                            ? "bg-gradient-to-r from-green-500/70 to-emerald-600/70 border-green-400 ring-4 ring-green-300/50 scale-105 shadow-lg"
                            : showIncorrect
                            ? "bg-gradient-to-r from-red-500/50 to-rose-600/50 border-red-400 opacity-80 scale-95"
                            : isSelected
                            ? "bg-gradient-to-r from-blue-600/70 to-cyan-700/70 border-blue-400 scale-105"
                            : "bg-gradient-to-r from-white/20 to-white/10 border-white/40 hover:from-white/30 hover:to-white/20 hover:scale-105 hover:shadow-xl"
                        } ${selectedOption ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {/* Option Number Badge */}
                        <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          showCorrect ? 'bg-green-400 text-white' : 
                          showIncorrect ? 'bg-red-400 text-white' : 
                          'bg-white/30 text-white'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        
                        <div className="pr-10">
                          <h5 className="font-bold text-white text-base md:text-lg mb-2 leading-tight">
                            {option.text}
                          </h5>
                          <p className="text-white/80 text-sm md:text-base leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                        
                        {showCorrect && (
                          <div className="absolute bottom-3 right-3 text-2xl md:text-3xl animate-pulse">✅</div>
                        )}
                        {showIncorrect && (
                          <div className="absolute bottom-3 right-3 text-2xl md:text-3xl">❌</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Feedback Message */}
              {showFeedback && (
                <div className={`rounded-2xl p-4 md:p-5 border-2 mb-6 ${
                  feedbackType === "correct"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400"
                    : "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-400"
                }`}>
                  <p className={`text-sm md:text-base font-semibold text-center ${
                    feedbackType === "correct" ? "text-green-200" : "text-orange-200"
                  }`}>
                    💡 {currentScenario.explanation}
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-3 mt-6">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : levelCompleted ? (
          <div className="w-full max-w-3xl bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-teal-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-white/20 shadow-2xl text-center">
            <div className="text-8xl md:text-9xl mb-6 animate-bounce">🎓</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
              {score === questions.length ? "Perfect Study Plan! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
              {score === questions.length 
                ? "Excellent! You understand how to create effective study plans. Keep applying these strategies!"
                : "Great job! You're learning how to plan your study time effectively. Keep practicing!"}
            </p>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-5 md:p-6 mb-4 border-2 border-green-400/30">
              <p className="text-white text-center text-base md:text-lg font-medium">
                💡 Remember: A good study plan includes a quiet environment, regular breaks, and consistent practice!
              </p>
            </div>
            {score === questions.length && (
              <div className="mt-4 text-6xl animate-pulse">🌟</div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationStudyPlan;