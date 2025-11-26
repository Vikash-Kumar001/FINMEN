import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const ReflexSpending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-13";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Fixed list of 5 questions
  const questions = [
    { text: "Plan Purchase", type: "correct", emoji: "📋" },
    { text: "Save Money", type: "correct", emoji: "💰" },
    { text: "Impulse Buy", type: "wrong", emoji: "⚡" },
    { text: "Compare Prices", type: "correct", emoji: "🔍" },
    { text: "Budget First", type: "correct", emoji: "📊" }
  ];

  const currentQuestion = questions[currentRound - 1];

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
    }
  }, [currentRound, gameState]);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    // Start timer for current round
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
          if (currentRoundRef.current >= TOTAL_ROUNDS) {
            setGameState("finished");
            return 0;
          } else {
            // Move to next round automatically
            setCurrentRound(prevRound => {
              const nextRound = prevRound + 1;
              if (nextRound > TOTAL_ROUNDS) {
                setGameState("finished");
                return prevRound;
              }
              return nextRound;
            });
            return ROUND_TIME;
          }
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  // Start the game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setCurrentRound(1);
    resetFeedback();
  };

  // Handle word tap
  const handleWordTap = (wordType) => {
    if (gameState !== "playing" || !currentQuestion || currentRound > TOTAL_ROUNDS) return;

    const isCorrect = currentQuestion.type === wordType;
    
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next round after a short delay
    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        // Game finished after this click
        setGameState("finished");
      } else {
        // Move to next round (timer will reset automatically via useEffect)
        setCurrentRound(prev => prev + 1);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/puzzle-smart-vs-waste");
  };

  const finalScore = score;

  return (
    <GameShell
      title="Reflex Spending"
      subtitle={gameState === "playing" ? `Question ${currentRound}/${TOTAL_ROUNDS} | Time: ${timeLeft}s` : "Test your reflexes!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="finance-kids-13"
      gameType="finance"
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      currentLevel={3}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameState === "finished" && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Reflex Spending Challenge</h2>
            <p className="text-white/90 mb-6">
              Tap the words that represent smart spending habits! You have 5 seconds for each question.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-green-300 mb-2">Smart Choices</h3>
                <p className="text-white/80 text-sm">Plan Purchase, Save Money, Compare Prices, Budget First</p>
              </div>
              <div className="bg-red-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-red-300 mb-2">Impulse Choices</h3>
                <p className="text-white/80 text-sm">Impulse Buy, Spend All, Buy Now, No Plan</p>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Question:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className="text-white">
                <span className="font-bold">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
              <div className="text-6xl mb-6">{currentQuestion.emoji}</div>
              <div className="text-4xl font-bold text-white mb-8">
                {currentQuestion.text}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleWordTap("correct")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="font-bold text-xl">Smart Choice</h3>
                </button>
                
                <button
                  onClick={() => handleWordTap("wrong")}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">❌</div>
                  <h3 className="font-bold text-xl">Impulse Choice</h3>
                </button>
              </div>
              
              <p className="text-white/80 text-center mt-6">
                Tap the correct button based on the word shown above
              </p>
            </div>
          </div>
        )}

        {gameState === "finished" && null}
      </div>
    </GameShell>
  );
};

export default ReflexSpending;