import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexPeerCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-63";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds per round
  const [isActive, setIsActive] = useState(false);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const timerRef = useRef(null);
  const ROUND_TIME = 5;
  const TOTAL_ROUNDS = 5;

  const scenarios = [
    {
      id: 1,
      instruction: "Friends want you to try smoking. Tap the SAFE choice!",
      wrongEmoji: "❌",
      correctEmoji: "✅",
      correctAnswer: "✅",
      correctText: "Safe Choices",
      wrongText: "Risky Dares"
    },
    {
      id: 2,
      instruction: "Someone dares you to jump from high place. Tap the SAFE choice!",
      correctEmoji: "✅",
      wrongEmoji: "❌",
      correctAnswer: "✅",
      correctText: "Safe Choices",
      wrongText: "Risky Dares"
    },
    {
      id: 3,
      instruction: "Friends pressure you to cheat on test. Tap the SAFE choice!",
      wrongEmoji: "❌",
      correctEmoji: "✅",
      correctAnswer: "✅",
      correctText: "Safe Choices",
      wrongText: "Risky Dares"
    },
    {
      id: 4,
      instruction: "Someone wants you to steal candy. Tap the SAFE choice!",
      wrongEmoji: "❌",
      correctEmoji: "✅",
      correctAnswer: "✅",
      correctText: "Safe Choices",
      wrongText: "Risky Dares"
    },
    {
      id: 5,
      instruction: "Friends dare you to cross street without looking. Tap the SAFE choice!",
      correctEmoji: "✅",
      wrongEmoji: "❌",
      correctAnswer: "✅",
      correctText: "Safe Choices",
      wrongText: "Risky Dares"
    }
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      handleTimeout();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (currentRound < TOTAL_ROUNDS && !gameFinished) {
      startRound();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentRound]);

  const startRound = () => {
    setTimeLeft(ROUND_TIME);
    setIsActive(true);
    setShowResult(false);
  };

  const handleTimeout = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetFeedback();
    setLastResult({ correct: false, message: "Time's up!" });
    setShowResult(true);

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 500);
  };

  const handleChoice = (emoji) => {
    if (!isActive) return;

    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetFeedback();

    const currentScenario = scenarios[currentRound];
    const isCorrect = emoji === currentScenario.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setLastResult({ correct: true, message: "Great choice!" });
    } else {
      setLastResult({ correct: false, message: "Oops! Try to be safer!" });
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const currentScenario = scenarios[currentRound];

  return (
    <GameShell
      title="Reflex Peer Check"
      subtitle={gameFinished ? "Game Complete!" : `Round ${currentRound + 1} of ${TOTAL_ROUNDS}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound + 1}
      showConfetti={gameFinished && score >= 3}
    >
      <div className="space-y-8">
        {!gameFinished && currentScenario && (
          <div className="space-y-6">
            {!showResult && (
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-white">
                  <span className="font-bold">Round:</span> {currentRound + 1}/{TOTAL_ROUNDS}
                </div>
                <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                  <span className="text-white">Time:</span> {timeLeft}s
                </div>
                <div className="text-white">
                  <span className="font-bold">Score:</span> {score}/{TOTAL_ROUNDS}
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              {!showResult ? (
                <>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                    {currentScenario.instruction}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleChoice(currentScenario.correctEmoji)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="text-4xl mb-3">{currentScenario.correctEmoji}</div>
                      <h3 className="font-bold text-xl">{currentScenario.correctText}</h3>
                    </button>
                    <button
                      onClick={() => handleChoice(currentScenario.wrongEmoji)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="text-4xl mb-3">{currentScenario.wrongEmoji}</div>
                      <h3 className="font-bold text-xl">{currentScenario.wrongText}</h3>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {lastResult.correct ? "🌟" : "⚠️"}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lastResult.message}
                  </h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexPeerCheck;
