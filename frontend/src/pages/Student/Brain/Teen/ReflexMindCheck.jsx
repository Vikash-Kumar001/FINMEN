import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const QUESTION_TIME = 10; // 10 seconds per question

const ReflexMindCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-3";
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
      text: "Which action is best for your mind?",
      options: [
        { 
          id: "meditate", 
          text: "Meditate", 
          emoji: "🧘", 
          description: "Reduces stress and improves emotional regulation",
          isCorrect: true
        },
        { 
          id: "stress", 
          text: "Chronic stress", 
          emoji: "😰", 
          description: "Prolonged stress damages brain cells",
          isCorrect: false
        },
        { 
          id: "gratitude", 
          text: "Express gratitude", 
          emoji: "🙏", 
          description: "Boosts mood and strengthens neural pathways",
          isCorrect: false
        },
        { 
          id: "ruminate", 
          text: "Ruminate on negatives", 
          emoji: "😞", 
          description: "Increases anxiety and depression risk",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What helps improve brain function?",
      options: [
        { 
          id: "compare", 
          text: "Social media comparison", 
          emoji: "📱", 
          description: "Reduces self-esteem and happiness",
          isCorrect: false
        },
        { 
          id: "read", 
          text: "Read for pleasure", 
          emoji: "📚", 
          description: "Enhances vocabulary and cognitive flexibility",
          isCorrect: true
        },
        { 
          id: "sleep", 
          text: "Get adequate sleep", 
          emoji: "😴", 
          description: "Essential for memory consolidation",
          isCorrect: false
        },
        { 
          id: "violent", 
          text: "Play violent video games", 
          emoji: "🎮", 
          description: "Can increase aggression and reduce empathy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which activity supports mental wellness?",
      options: [
        { 
          id: "isolate", 
          text: "Isolate yourself", 
          emoji: "🚪", 
          description: "Can lead to depression and loneliness",
          isCorrect: false
        },
        { 
          id: "exercise", 
          text: "Regular exercise", 
          emoji: "🏃", 
          description: "Increases blood flow to the brain",
          isCorrect: false
        },
        { 
          id: "learn", 
          text: "Learn new skills", 
          emoji: "🎓", 
          description: "Promotes neuroplasticity and brain growth",
          isCorrect: true
        },
        { 
          id: "procrastinate", 
          text: "Procrastinate constantly", 
          emoji: "⏰", 
          description: "Increases stress and reduces productivity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is good for emotional regulation?",
      options: [
        { 
          id: "bottle", 
          text: "Bottle up emotions", 
          emoji: "💔", 
          description: "Can lead to emotional outbursts",
          isCorrect: false
        },
        { 
          id: "journal", 
          text: "Journal your thoughts", 
          emoji: "📝", 
          description: "Helps process emotions and reduce stress",
          isCorrect: true
        },
        { 
          id: "talk", 
          text: "Talk to someone", 
          emoji: "💬", 
          description: "Provides support and perspective",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore your feelings", 
          emoji: "🙈", 
          description: "Doesn't help with emotional regulation",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which habit boosts cognitive performance?",
      options: [
        { 
          id: "junk", 
          text: "Eat only junk food", 
          emoji: "🍔", 
          description: "Can impair cognitive function",
          isCorrect: false
        },
        { 
          id: "skip", 
          text: "Skip meals regularly", 
          emoji: "🍽️", 
          description: "Can cause brain fog and fatigue",
          isCorrect: false
        },
        { 
          id: "healthy", 
          text: "Eat healthy foods", 
          emoji: "🥗", 
          description: "Provides essential nutrients for the brain",
          isCorrect: true
        },
        { 
          id: "hydrate", 
          text: "Stay hydrated", 
          emoji: "💧", 
          description: "Maintains optimal brain function",
          isCorrect: false
        }
      ]
    }
  ];

  // Shuffle options for each question to vary correct answer positions
  const shuffledQuestions = useMemo(() => {
    return questions.map(q => {
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q, options: shuffled };
    });
  }, []);

  // Timer effect
  useEffect(() => {
    if (!showResult && !answered && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !answered) {
      // Time's up, move to next question
      handleTimeUp();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, answered, showResult]);

  // Reset timer when question changes
  useEffect(() => {
    if (!showResult) {
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
      setSelectedOptionId(null);
    }
  }, [currentQuestion, showResult]);

  const handleTimeUp = () => {
    setAnswered(true);
    resetFeedback();
    showCorrectAnswerFeedback(0, false);
    
    const isLastQuestion = currentQuestion === shuffledQuestions.length - 1;
    
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
    
    setAnswered(true);
    setSelectedOptionId(option.id);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === shuffledQuestions.length - 1;
    
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
      console.log(`🎮 Reflex Mind Check game completed! Score: ${score}/${shuffledQuestions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, shuffledQuestions.length]);

  const currentQuestionData = shuffledQuestions[currentQuestion];
  const timerColor = timeLeft <= 3 ? 'text-red-400' : timeLeft <= 6 ? 'text-yellow-400' : 'text-green-400';

  return (
    <GameShell
      title="Reflex Mind Check"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={shuffledQuestions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={showResult}
      maxScore={shuffledQuestions.length}
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
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{shuffledQuestions.length}</span>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{shuffledQuestions.length}</span>
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

export default ReflexMindCheck;
