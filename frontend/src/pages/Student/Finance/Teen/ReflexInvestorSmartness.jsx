import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexInvestorSmartness = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-63");
  const gameId = gameData?.id || "finance-teens-63";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexInvestorSmartness, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  const questions = [
    {
      id: 1,
      question: "Choose the smart investment choice:",
      correctAnswer: "Diversify",
      options: [
        { text: "Diversify", isCorrect: true, emoji: "📊" },
        { text: "Put All in One", isCorrect: false, emoji: "🎯" },
        { text: "Avoid Investing", isCorrect: false, emoji: "🚫" }
      ]
    },
    {
      id: 2,
      question: "Choose the smart investment choice:",
      correctAnswer: "Research First",
      options: [
        { text: "Invest Blindly", isCorrect: false, emoji: "🙈" },
        { text: "Research First", isCorrect: true, emoji: "🔍" },
        { text: "Follow Hype", isCorrect: false, emoji: "📢" }
      ]
    },
    {
      id: 3,
      question: "Choose the smart investment choice:",
      correctAnswer: "Long Term Plan",
      options: [
        { text: "Quick Profit", isCorrect: false, emoji: "⚡" },
        { text: "No Plan", isCorrect: false, emoji: "😴" },
        { text: "Long Term Plan", isCorrect: true, emoji: "📅" }
      ]
    },
    {
      id: 4,
      question: "Choose the smart investment choice:",
      correctAnswer: "Mix Safe & Risky",
      options: [
        { text: "Mix Safe & Risky", isCorrect: true, emoji: "⚖️" },
        { text: "Only Risky", isCorrect: false, emoji: "🎲" },
        { text: "Only Safe", isCorrect: false, emoji: "🛡️" }
      ]
    },
    {
      id: 5,
      question: "Choose the smart investment choice:",
      correctAnswer: "Start Early",
      options: [
        { text: "Wait Forever", isCorrect: false, emoji: "⏳" },
        { text: "Start Early", isCorrect: true, emoji: "🌱" },
        { text: "Never Invest", isCorrect: false, emoji: "❌" }
      ]
    }
  ];

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, [currentRound]);

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

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
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

  const handleTryAgain = () => {
    setGameState("ready");
    setCurrentRound(0);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Investor Smartness"
      subtitle={
        gameState === "ready" 
          ? "Test your investment reflexes!" 
          : gameState === "playing" 
          ? `Round ${currentRound} of ${TOTAL_ROUNDS}` 
          : "Game Complete!"
      }
      score={score}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameState === "finished" && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your Investment Reflexes?</h3>
            <p className="text-white/90 text-lg mb-6">
              Choose the smart investment choice quickly!
              You have {ROUND_TIME} seconds per question.
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Round {currentRound}/{TOTAL_ROUNDS}</span>
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold">Score: {score}/{TOTAL_ROUNDS}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${timeLeft <= 3 ? "text-red-400 animate-pulse" : "text-blue-400"}`}>
                      ⏱️ {timeLeft}s
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-2 mb-6">
                <div 
                  className={`h-2 rounded-full transition-all ${timeLeft <= 3 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
                />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {currentQuestion.question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="text-white font-semibold text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Investment Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {TOTAL_ROUNDS}!
                  You have quick reflexes for smart investing!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Diversify investments, research first, plan long-term, mix safe and risky, and start early!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {TOTAL_ROUNDS}.
                  Practice makes perfect with smart investing!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always diversify, research before investing, plan long-term, mix safe and risky options, and start early!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexInvestorSmartness;
