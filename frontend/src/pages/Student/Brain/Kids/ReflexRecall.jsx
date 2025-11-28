import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Zap, CheckCircle, XCircle, Brain } from 'lucide-react';

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
  const [seenWords, setSeenWords] = useState([]);
  const timerRef = useRef(null);

  const allWords = [
    { id: 1, word: "Apple", seen: true, emoji: "🍎" },
    { id: 2, word: "Banana", seen: true, emoji: "🍌" },
    { id: 3, word: "Orange", seen: true, emoji: "🍊" },
    { id: 4, word: "Grape", seen: true, emoji: "🍇" },
    { id: 5, word: "Mango", seen: true, emoji: "🥭" },
    { id: 6, word: "Car", seen: false, emoji: "🚗" },
    { id: 7, word: "Book", seen: false, emoji: "📚" },
    { id: 8, word: "Tree", seen: false, emoji: "🌳" },
    { id: 9, word: "Sun", seen: false, emoji: "☀️" },
    { id: 10, word: "Moon", seen: false, emoji: "🌙" }
  ];

  const questions = [
    { id: 1, word: allWords[0], correct: true }, // Apple - seen
    { id: 2, word: allWords[5], correct: false }, // Car - not seen
    { id: 3, word: allWords[1], correct: true }, // Banana - seen
    { id: 4, word: allWords[6], correct: false }, // Book - not seen
    { id: 5, word: allWords[2], correct: true }  // Orange - seen
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
    setSeenWords(["Apple", "Banana", "Orange", "Grape", "Mango"]);
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
    const isCorrect = answerType === "seen" ? currentQuestion.correct : !currentQuestion.correct;
    const isLastQuestion = currentRound === TOTAL_ROUNDS;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Recall"
      score={score}
      subtitle={gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : gameState === "finished" ? "Game Complete!" : "Tap for words seen before, skip new ones"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={gameState === "finished"}
      gameId={gameId}
      gameType="brain"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Test Your Memory Recall!</h3>
            <p className="text-white/80 mb-4 text-lg">Remember these words: Apple, Banana, Orange, Grape, Mango</p>
            <p className="text-white/80 mb-6 text-lg">Tap if you've seen the word before, skip if it's new</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleAnswer('seen')}
                  disabled={answered}
                  className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center shadow-lg"
                >
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <span className="font-bold text-lg">Seen Before!</span>
                </button>
                
                <button
                  onClick={() => handleAnswer('neutral')}
                  disabled={answered}
                  className="p-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center shadow-lg"
                >
                  <Brain className="w-8 h-8 mb-2" />
                  <span className="font-bold text-lg">Not Sure</span>
                </button>
                
                <button
                  onClick={() => handleAnswer('new')}
                  disabled={answered}
                  className="p-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex flex-col items-center shadow-lg"
                >
                  <XCircle className="w-8 h-8 mb-2" />
                  <span className="font-bold text-lg">New Word!</span>
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
