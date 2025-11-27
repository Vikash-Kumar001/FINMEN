import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const ReflexControl = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-19";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const TOTAL_ROUNDS = 5;
  const ROUND_TIME = 10;
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "You see a 50% off sale on designer jeans. What should you do?",
      correctAnswer: "Wait and evaluate if you really need them",
      options: [
        { text: "Buy immediately before sale ends", isCorrect: false, emoji: "⚡" },
        { text: "Wait and evaluate if you really need them", isCorrect: true, emoji: "✅" },
        { text: "Buy multiple pairs to stock up", isCorrect: false, emoji: "🛍️" },
        { text: "Ask friends to buy for you", isCorrect: false, emoji: "👥" }
      ],
      explanation: "Taking time to evaluate needs vs wants prevents impulsive spending"
    },
    {
      id: 2,
      question: "A friend invites you to an expensive restaurant, but you only have ₹500 budget. What's the best choice?",
      correctAnswer: "Suggest a more affordable option",
      options: [
        { text: "Suggest a more affordable option", isCorrect: true, emoji: "💬" },
        { text: "Go and overspend anyway", isCorrect: false, emoji: "💸" },
        { text: "Borrow money from friends", isCorrect: false, emoji: "🤲" },
        { text: "Skip the meal entirely", isCorrect: false, emoji: "🚫" }
      ],
      explanation: "Communicating financial boundaries maintains friendships and financial health"
    },
    {
      id: 3,
      question: "A new video game releases for ₹3000. What should you do?",
      correctAnswer: "Check reviews and wait for discounts",
      options: [
        { text: "Buy immediately at full price", isCorrect: false, emoji: "🎮" },
        { text: "Buy on credit card", isCorrect: false, emoji: "💳" },
        { text: "Check reviews and wait for discounts", isCorrect: true, emoji: "🔍" },
        { text: "Skip it completely", isCorrect: false, emoji: "❌" }
      ],
      explanation: "Research and patience often lead to better purchasing decisions"
    },
    {
      id: 4,
      question: "An online service offers a free trial but requires your credit card. What should you do?",
      correctAnswer: "Read terms and set a reminder to cancel",
      options: [
        { text: "Sign up without reading terms", isCorrect: false, emoji: "📝" },
        { text: "Use a fake card number", isCorrect: false, emoji: "🚫" },
        { text: "Never try free trials", isCorrect: false, emoji: "🙅" },
        { text: "Read terms and set a reminder to cancel", isCorrect: true, emoji: "📅" }
      ],
      explanation: "Understanding commitments prevents unexpected charges"
    },
    {
      id: 5,
      question: "You see a 'Buy 1 Get 1 Free' deal on items you don't need. What should you do?",
      correctAnswer: "Pass on the deal",
      options: [
        { text: "Pass on the deal", isCorrect: true, emoji: "✅" },
        { text: "Buy both items to 'save money'", isCorrect: false, emoji: "🛒" },
        { text: "Buy and gift the extra", isCorrect: false, emoji: "🎁" },
        { text: "Buy and resell later", isCorrect: false, emoji: "💰" }
      ],
      explanation: "Buying unnecessary items is wasteful regardless of deals"
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
    setStreak(0);
    setBestStreak(0);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    const isLastQuestion = currentRound === questions.length;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1500);
  };

  const currentQuestion = questions[currentRound - 1];
  const finalScore = score;

  return (
    <GameShell
      title="Reflex Control"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Control your spending impulses!` : "Control your spending impulses!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="text-center text-white space-y-6">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-5xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-white mb-3">Get Ready!</h3>
            <p className="text-white/90 text-sm mb-4">
              Answer questions about controlling spending impulses!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 text-xs mb-4">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-full text-base font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 gap-2">
              <div className="text-white text-xs">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold text-xs ${timeLeft <= 2 ? 'text-red-400 animate-pulse' : timeLeft <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white text-xs">
                <span className="font-bold">Score:</span> {score}/{TOTAL_ROUNDS}
              </div>
              <div className="text-yellow-400 text-xs">
                <span className="font-bold">Streak:</span> {streak}x
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  timeLeft <= 2 ? 'bg-red-500' : timeLeft <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
              />
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
                {currentQuestion.question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`w-full min-h-[70px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-3 py-3 rounded-xl text-white font-semibold text-xs transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center justify-center gap-1 ${
                      answered && option.isCorrect ? 'ring-4 ring-green-400' : ''
                    } ${answered && !option.isCorrect && option === currentQuestion.options.find(opt => !opt.isCorrect && opt.text === option.text) ? 'ring-4 ring-red-400' : ''}`}
                  >
                    <span className="text-2xl">{option.emoji}</span> 
                    <span className="text-center leading-tight">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
              <span className="text-white/80 text-xs">
                Best Streak: {bestStreak}
              </span>
              <span className="text-yellow-400 text-xs">
                Bonus Points: {bestStreak * 10}
              </span>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-6xl mb-4">
              {finalScore === TOTAL_ROUNDS ? "🏆" : finalScore >= 3 ? "🎉" : "💪"}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Game Complete!</h2>
            <p className="text-white/90 text-base mb-4">
              You got {finalScore} out of {TOTAL_ROUNDS} questions correct!
            </p>
            <div className="mb-4">
              <p className="text-xl font-bold text-white mb-2">
                Score: {finalScore}/{TOTAL_ROUNDS}
              </p>
              <p className="text-white/80 text-sm">
                Best Streak: {bestStreak} | Bonus: {bestStreak * 10} points
              </p>
            </div>
            {finalScore >= 3 && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-5 rounded-full inline-flex items-center gap-2 mb-4">
                <span>+{finalScore} Coins</span>
              </div>
            )}
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 px-5 rounded-full font-bold transition-all text-sm"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexControl;