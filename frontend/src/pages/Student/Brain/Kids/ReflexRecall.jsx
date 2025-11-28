import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { CheckCircle, XCircle } from 'lucide-react';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexRecall = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-23");
  const gameId = gameData?.id || "brain-kids-23";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexRecall, using fallback ID");
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

  // Words that will be shown initially (fruits - these are the "seen" words)
  const seenWords = [
    { word: "Apple", emoji: "🍎" },
    { word: "Banana", emoji: "🍌" },
    { word: "Orange", emoji: "🍊" },
    { word: "Grape", emoji: "🍇" },
    { word: "Mango", emoji: "🥭" }
  ];

  // Words that are new (not shown initially)
  const newWords = [
    { word: "Car", emoji: "🚗" },
    { word: "Book", emoji: "📚" },
    { word: "Tree", emoji: "🌳" },
    { word: "Sun", emoji: "☀️" },
    { word: "Moon", emoji: "🌙" }
  ];

  // Questions with mix of seen and new words
  const questions = [
    { word: seenWords[0], isSeen: true }, // Apple - seen
    { word: newWords[0], isSeen: false }, // Car - new
    { word: seenWords[1], isSeen: true }, // Banana - seen
    { word: newWords[1], isSeen: false }, // Book - new
    { word: seenWords[2], isSeen: true }  // Orange - seen
  ];

  const handleTimeUp = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      setAnswered(false);
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
    if (gameState === "playing" && !answered && timeLeft > 0 && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
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

  // Ensure game always starts fresh when component mounts
  useEffect(() => {
    setGameState("ready");
    setCurrentRound(0);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    
    const currentQuestion = questions[currentRound - 1];
    // answerType is "seen" or "new"
    // isSeen is true if the word was shown initially
    const isCorrect = (answerType === "seen" && currentQuestion.isSeen) || 
                      (answerType === "new" && !currentQuestion.isSeen);
    
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

  const currentQuestion = currentRound > 0 && currentRound <= TOTAL_ROUNDS ? questions[currentRound - 1] : null;

  return (
    <GameShell
      title="Reflex Recall"
      subtitle={gameState === "ready" ? "Get Ready!" : gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : "Game Complete!"}
      score={score}
      currentLevel={currentRound || 1}
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
            <h3 className="text-2xl font-bold text-white mb-4">Test Your Memory Recall!</h3>
            <p className="text-white/90 mb-4 text-lg">Remember these words:</p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {seenWords.map((item, idx) => (
                <div key={idx} className="bg-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-white font-semibold">{item.word}</span>
                </div>
              ))}
            </div>
            <p className="text-white/80 mb-6 text-lg">Tap "Seen Before" if you remember seeing the word, or "New Word" if it's new!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/60 mt-4">You'll have {ROUND_TIME} seconds per round</p>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}/{TOTAL_ROUNDS}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Have you seen this word before?
              </h3>
              
              <div className="mb-8">
                <div className="inline-block p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <div className="text-white text-6xl mb-4">
                    {currentQuestion.word.emoji}
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {currentQuestion.word.word}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => handleAnswer('seen')}
                  disabled={answered}
                  className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center shadow-lg"
                >
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <span className="font-bold text-lg">Seen Before</span>
                  <span className="text-sm text-white/90 mt-1">I remember this word</span>
                </button>
                
                <button
                  onClick={() => handleAnswer('new')}
                  disabled={answered}
                  className="p-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center shadow-lg"
                >
                  <XCircle className="w-8 h-8 mb-2" />
                  <span className="font-bold text-lg">New Word</span>
                  <span className="text-sm text-white/90 mt-1">I haven't seen this</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexRecall;
