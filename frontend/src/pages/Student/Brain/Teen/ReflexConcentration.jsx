import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexConcentration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-13";
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
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const timerRef = useRef(null);

  const questions = [
    {
      id: 1,
      text: "Which action helps concentration?",
      options: [
        { 
          id: "focused", 
          text: "Focused Study", 
          emoji: "📚", 
          description: "Deep focus improves learning and retention",
          isCorrect: true
        },
        { 
          id: "social", 
          text: "Social Media Scrolling", 
          emoji: "📱", 
          description: "Multitasking reduces efficiency and focus",
          isCorrect: false
        },
        { 
          id: "breaks", 
          text: "Taking Short Breaks", 
          emoji: "⏰", 
          description: "Brief rests prevent mental fatigue",
          isCorrect: false
        },
        { 
          id: "gaming", 
          text: "Playing Video Games", 
          emoji: "🎮", 
          description: "Gaming during study reduces performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What supports sustained focus?",
      options: [
        { 
          id: "daydream", 
          text: "Daydreaming", 
          emoji: "☁️", 
          description: "Uncontrolled thoughts reduce productivity",
          isCorrect: false
        },
        { 
          id: "organized", 
          text: "Organized Study Space", 
          emoji: "✨", 
          description: "Clean environment reduces distractions",
          isCorrect: false
        },
        { 
          id: "meditation", 
          text: "Mindfulness Meditation", 
          emoji: "🧘", 
          description: "Enhances attention and emotional regulation",
          isCorrect: true
        },
        { 
          id: "allnight", 
          text: "Studying All Night", 
          emoji: "🌙", 
          description: "Sleep deprivation impairs cognitive function",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which improves concentration?",
      options: [
        { 
          id: "phone", 
          text: "Phone Notifications On", 
          emoji: "🔔", 
          description: "Constant interruptions break focus",
          isCorrect: false
        },
        { 
          id: "multitask", 
          text: "Multitasking", 
          emoji: "📱", 
          description: "Reduces efficiency and increases errors",
          isCorrect: false
        },
        { 
          id: "pomodoro", 
          text: "Pomodoro Technique", 
          emoji: "⏱️", 
          description: "Structured breaks maintain focus",
          isCorrect: false
        },
        { 
          id: "quiet", 
          text: "Quiet Environment", 
          emoji: "🔇", 
          description: "Minimizes distractions and improves focus",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What helps maintain attention?",
      options: [
        { 
          id: "sleep", 
          text: "Adequate Sleep", 
          emoji: "😴", 
          description: "Essential for optimal cognitive function",
          isCorrect: true
        },
        { 
          id: "noise", 
          text: "Loud Music", 
          emoji: "🔊", 
          description: "Can break concentration and reduce learning",
          isCorrect: false
        },
        { 
          id: "cram", 
          text: "Cramming Sessions", 
          emoji: "📖", 
          description: "Leads to mental fatigue and poor retention",
          isCorrect: false
        },
        { 
          id: "hydration", 
          text: "Staying Hydrated", 
          emoji: "💧", 
          description: "Maintains brain function and focus",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which boosts concentration?",
      options: [
        { 
          id: "distractions", 
          text: "Multiple Distractions", 
          emoji: "📺", 
          description: "Fragments attention and reduces productivity",
          isCorrect: false
        },
        { 
          id: "single", 
          text: "Single Task Focus", 
          emoji: "🎯", 
          description: "Improves concentration and productivity",
          isCorrect: true
        },
        { 
          id: "chaos", 
          text: "Chaotic Environment", 
          emoji: "🌪️", 
          description: "Increases stress and reduces focus",
          isCorrect: false
        },
        { 
          id: "routine", 
          text: "Consistent Routine", 
          emoji: "📅", 
          description: "Helps train the brain for better focus",
          isCorrect: false
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!showResult && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [answered, showResult, currentQuestion]);

  // Reset timer when question changes
  useEffect(() => {
    if (!showResult) {
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
      setSelectedOptionId(null);
    }
  }, [currentQuestion, showResult]);

  const handleTimeUp = () => {
    if (answered) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setAnswered(true);
    resetFeedback();
    showCorrectAnswerFeedback(0, false);
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1500);
  };

  const handleChoice = (option) => {
    if (answered) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setAnswered(true);
    setSelectedOptionId(option.id);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Reflex Concentration game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
  const timerColor = timeLeft <= 3 ? 'text-red-400' : timeLeft <= 6 ? 'text-yellow-400' : 'text-green-400';

  return (
    <GameShell
      title="Reflex Concentration"
      score={coins}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={showResult}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
                  <div className={`text-lg md:text-xl font-bold ${timerColor}`}>
                    ⏱️ {timeLeft}s
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
                      onClick={() => handleChoice(option)}
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
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl">{option.emoji}</span>
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm md:text-base mb-1">{option.text}</div>
                          <div className="text-white/80 text-xs md:text-sm">{option.description}</div>
                        </div>
                      </div>
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

export default ReflexConcentration;
