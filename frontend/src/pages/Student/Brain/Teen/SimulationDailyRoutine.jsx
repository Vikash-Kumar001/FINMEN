import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationDailyRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-8";
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
      text: "You have a busy day ahead. Which daily routine will best support your brain health?",
      options: [
        { 
          id: 'sleep', 
          text: 'Sleep 8 hours only', 
          description: 'Focus on rest but skip physical activity' 
        },
        { 
          id: 'both', 
          text: 'Sleep 8 hours and play sport', 
          description: 'Get adequate rest and engage in physical activity' 
        },
        { 
          id: 'sport', 
          text: 'Play sport only', 
          description: 'Stay active but sacrifice sleep' 
        },
        { 
          id: 'junk', 
          text: 'Eat junk food all day', 
          description: 'Poor nutrition choices' 
        }
      ],
      correct: "both",
      explanation: "Both 8 hours of sleep and playing sports are essential for optimal brain function. Sleep helps consolidate memories, while exercise increases blood flow to the brain!"
    },
    {
      id: 2,
      text: "It's 10 PM and you have an exam tomorrow. What's the best approach for your brain?",
      options: [
        { 
          id: 'study', 
          text: 'Study all night', 
          description: 'Cram as much as possible' 
        },
        { 
          id: 'panic', 
          text: 'Panic and stress', 
          description: 'Feel anxious about the exam' 
        },
        { 
          id: 'sleep', 
          text: 'Sleep well and review briefly', 
          description: 'Get rest and light review' 
        },
        { 
          id: 'ignore', 
          text: 'Ignore the exam completely', 
          description: 'Do nothing to prepare' 
        }
      ],
      correct: "sleep",
      explanation: "Adequate sleep is crucial for memory consolidation. Brief review before a good night's sleep is more effective than all-night cramming!"
    },
    {
      id: 3,
      text: "During study breaks, what activity is most beneficial for your brain?",
      options: [
        { 
          id: 'social', 
          text: 'Scroll social media', 
          description: 'Check notifications and messages' 
        },
        { 
          id: 'snack', 
          text: 'Eat sugary snacks', 
          description: 'Quick energy boost' 
        },
        { 
          id: 'walk', 
          text: 'Take a short walk outdoors', 
          description: 'Get fresh air and movement' 
        },
        { 
          id: 'nap', 
          text: 'Take a long nap', 
          description: 'Extended rest period' 
        }
      ],
      correct: "walk",
      explanation: "Short walks increase blood flow to the brain and refresh your mind, making you more focused when you return to studying!"
    },
    {
      id: 4,
      text: "How should you structure your daily study schedule for optimal brain performance?",
      options: [
        { 
          id: 'marathon', 
          text: 'Study for 4 hours straight', 
          description: 'Long continuous sessions' 
        },
        { 
          id: 'random', 
          text: 'Study randomly throughout the day', 
          description: 'Irregular timing' 
        },
        { 
          id: 'night', 
          text: 'Only study late at night', 
          description: 'Single time period focus' 
        },
        { 
          id: 'pomodoro', 
          text: 'Use Pomodoro technique (25 min study, 5 min break)', 
          description: 'Structured work-break intervals' 
        }
      ],
      correct: "pomodoro",
      explanation: "The Pomodoro technique helps maintain focus and prevents mental fatigue by balancing work and rest periods!"
    },
    {
      id: 5,
      text: "What's the best way to start your morning for brain health?",
      options: [
        { 
          id: 'rush', 
          text: 'Rush out without eating', 
          description: 'Quick start to the day' 
        },
        { 
          id: 'heavy', 
          text: 'Heavy meal and stay in bed', 
          description: 'Large breakfast and minimal movement' 
        },
        { 
          id: 'skip', 
          text: 'Skip breakfast entirely', 
          description: 'No morning meal' 
        },
        { 
          id: 'healthy', 
          text: 'Healthy breakfast and light stretching', 
          description: 'Nourish body and activate muscles' 
        }
      ],
      correct: "healthy",
      explanation: "A healthy breakfast provides glucose for brain energy, and light stretching increases blood flow to wake up your brain!"
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
      setScore(prevScore => prevScore + 1);
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
    }, 2000);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Simulation Daily Routine game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Simulation: Daily Routine"
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
        {!levelCompleted && currentScenario ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">Daily Routine Simulator</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-lg md:text-xl font-semibold text-white text-center">"{currentScenario.text}"</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-6">
                <h4 className="text-base md:text-lg font-semibold text-white mb-4">Choose the best option:</h4>
                {currentScenario.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && isSelected && option.id === currentScenario.correct;
                  const showIncorrect = showFeedback && isSelected && option.id !== currentScenario.correct;
                  
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 cursor-pointer transition duration-200 ${
                        showCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-300"
                          : showIncorrect
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-red-300"
                          : isSelected
                          ? 'bg-white/20 border-white'
                          : levelCompleted
                          ? 'opacity-70 cursor-not-allowed'
                          : 'bg-white/10 hover:bg-white/20 border-white/30'
                      }`}
                    >
                      <h5 className="font-bold text-white text-sm md:text-base">{option.text}</h5>
                      <p className="text-white/80 text-xs md:text-sm mt-1">{option.description}</p>
                    </div>
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

export default SimulationDailyRoutine;