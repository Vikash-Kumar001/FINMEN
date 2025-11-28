import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Smile, Frown, Heart, Star, Zap } from 'lucide-react';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 8;

const HappyThoughtsReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-53");
  const gameId = gameData?.id || "brain-kids-53";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for HappyThoughtsReflex, using fallback ID");
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
      question: "Is 'Smile' a positive thought?",
      action: "Smile",
      type: "positive",
      emoji: "😊",
      icon: <Smile className="w-8 h-8" />
    },
    {
      id: 2,
      question: "Is 'Complain' a positive thought?",
      action: "Complain",
      type: "negative",
      emoji: "😤",
      icon: <Frown className="w-8 h-8" />
    },
    {
      id: 3,
      question: "Is 'Hope' a positive thought?",
      action: "Hope",
      type: "positive",
      emoji: "🌟",
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 4,
      question: "Is 'Give Up' a positive thought?",
      action: "Give Up",
      type: "negative",
      emoji: "😔",
      icon: <Frown className="w-8 h-8" />
    },
    {
      id: 5,
      question: "Is 'Thanks' a positive thought?",
      action: "Thanks",
      type: "positive",
      emoji: "🙏",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const handleTimeUp = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0 && currentRound > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            handleTimeUp();
            return 0;
          }
          return newTime;
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
  }, [gameState, answered, timeLeft, currentRound, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (answerType) => {
    if (answered || gameState !== "playing") return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setAnswered(true);
    resetFeedback();
    
    const currentQ = questions[currentRound - 1];
    const isCorrect = (answerType === "tap" && currentQ.type === "positive") || 
                      (answerType === "skip" && currentQ.type === "negative");
    
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
    }, 1000);
  };

  const currentQ = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Happy Thoughts"
      subtitle={gameState === "ready" ? "Get Ready!" : gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : "Game Complete!"}
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
      gameType="brain"
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Tap for positive thoughts, skip for negative!</h3>
            <p className="text-white/90 mb-6">You'll see words appear. Tap if it's a positive thought, skip if it's negative.</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold transition-all"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQ && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Round {currentRound}/{TOTAL_ROUNDS}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{TOTAL_ROUNDS}</span>
              <span className="text-red-400 font-bold">Time: {timeLeft}s</span>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentQ.emoji}</div>
              <h3 className="text-3xl font-bold text-white mb-2">{currentQ.action}</h3>
              <p className="text-white/80 text-lg">{currentQ.question}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer("tap")}
                disabled={answered}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-3xl mb-2">👆</div>
                <h3 className="font-bold text-xl">Tap</h3>
                <p className="text-white/90 text-sm">It's positive</p>
              </button>
              
              <button
                onClick={() => handleAnswer("skip")}
                disabled={answered}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-3xl mb-2">⏭️</div>
                <h3 className="font-bold text-xl">Skip</h3>
                <p className="text-white/90 text-sm">It's negative</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HappyThoughtsReflex;
