import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexMindCheck = () => {
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
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "What should you do to boost your mind?",
      correctAnswer: "Meditate",
      options: [
        { text: "Meditate", isCorrect: true, emoji: "🧘" },
        { text: "Chronic stress", isCorrect: false, emoji: "😰" },
        { text: "Express gratitude", isCorrect: false, emoji: "🙏" },
        { text: "Ruminate on negatives", isCorrect: false, emoji: "😞" }
      ]
    },
    {
      id: 2,
      question: "What helps improve brain function?",
      correctAnswer: "Read for pleasure",
      options: [
        { text: "Social media comparison", isCorrect: false, emoji: "📱" },
        { text: "Read for pleasure", isCorrect: true, emoji: "📚" },
        { text: "Get adequate sleep", isCorrect: false, emoji: "😴" },
        { text: "Play violent video games", isCorrect: false, emoji: "🎮" }
      ]
    },
    {
      id: 3,
      question: "Which activity supports mental wellness?",
      correctAnswer: "Learn new skills",
      options: [
        { text: "Isolate yourself", isCorrect: false, emoji: "🚪" },
        { text: "Regular exercise", isCorrect: false, emoji: "🏃" },
        { text: "Learn new skills", isCorrect: true, emoji: "🎓" },
        { text: "Procrastinate constantly", isCorrect: false, emoji: "⏰" }
      ]
    },
    {
      id: 4,
      question: "What is good for emotional regulation?",
      correctAnswer: "Journal your thoughts",
      options: [
        { text: "Bottle up emotions", isCorrect: false, emoji: "💔" },
        { text: "Talk to someone", isCorrect: false, emoji: "💬" },
        { text: "Ignore your feelings", isCorrect: false, emoji: "🙈" },
        { text: "Journal your thoughts", isCorrect: true, emoji: "📝" }
      ]
    },
    {
      id: 5,
      question: "Which habit boosts cognitive performance?",
      correctAnswer: "Eat healthy foods",
      options: [
        { text: "Eat healthy foods", isCorrect: true, emoji: "🥗" },
        { text: "Eat only junk food", isCorrect: false, emoji: "🍔" },
        { text: "Skip meals regularly", isCorrect: false, emoji: "🍽️" },
        { text: "Stay hydrated", isCorrect: false, emoji: "💧" }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timeLeft and answered when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };

  const finalScore = score;

  const currentQuestion = questions[currentRound - 1];

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (gameState === "finished") {
      console.log(`🎮 Reflex Mind Check game completed! Score: ${finalScore}/${TOTAL_ROUNDS}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameState, finalScore, gameId, nextGamePath, nextGameId]);

  return (
    <GameShell
      title="Reflex Mind Check"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Tap quickly for mind-boosting actions!` : "Test your mind-boosting reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="brain"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center text-center text-white space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 py-4">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center">
            <div className="text-4xl md:text-5xl mb-4 md:mb-6">🧠</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-base md:text-lg mb-4 md:mb-6">
              Answer questions about mind-boosting actions!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-4 md:mb-6 text-sm md:text-base">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="text-white text-sm md:text-base">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold text-sm md:text-base ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white text-sm md:text-base">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20 text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-white">
                {currentQuestion.question}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[70px] md:min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold text-base md:text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="text-2xl md:text-3xl mr-2">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexMindCheck;
