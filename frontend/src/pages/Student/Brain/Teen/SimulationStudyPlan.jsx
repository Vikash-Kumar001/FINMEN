import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationStudyPlan = () => {
  const navigate = useNavigate();
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
  const [answers, setAnswers] = useState({});

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

  const currentScenario = questions[currentQuestion];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === currentScenario.correct;
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
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentScenario ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 text-center">Study Plan Simulator</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-base md:text-lg lg:text-xl font-semibold text-white text-center">"{currentScenario.text}"</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Choose the best option:</h4>
                {currentScenario.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && isSelected && option.id === currentScenario.correct;
                  const showIncorrect = showFeedback && isSelected && option.id !== currentScenario.correct;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
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
                    <h5 className="font-bold text-white text-sm md:text-base mb-1">{option.text}</h5>
                    <p className="text-white/80 text-xs md:text-sm">{option.description}</p>
                  </button>
                );
              })}
            </div>
            
              {showFeedback && feedbackType === "wrong" && (
                <div className="mt-4 md:mt-6 text-white/90 text-center text-sm md:text-base">
                  <p>💡 {currentScenario.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationStudyPlan;