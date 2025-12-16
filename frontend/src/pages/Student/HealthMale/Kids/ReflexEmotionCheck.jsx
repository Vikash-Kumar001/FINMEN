import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexEmotionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-53";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const ROUND_TIME = 5;
  const TOTAL_ROUNDS = 5;

  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null); // 'correct', 'wrong', 'timeout'

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const timerRef = useRef(null);

  const scenarios = [
    {
      id: 1,
      question: "Tap the emoji that shows HAPPY!",
      options: [
        { text: "Happy", emoji: "😊", isCorrect: true },
        { text: "Angry", emoji: "😠", isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "Tap the emoji that shows SAD!",
      options: [
        { text: "Happy", emoji: "😄", isCorrect: false },
        { text: "Sad", emoji: "😢", isCorrect: true }
      ]
    },
    {
      id: 3,
      question: "Tap the emoji that shows ANGRY!",
      options: [
        { text: "Angry", emoji: "😠", isCorrect: true },
        { text: "Happy", emoji: "😊", isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "Tap the emoji that shows SCARED!",
      options: [
        { text: "Sad", emoji: "😢", isCorrect: false },
        { text: "Scared", emoji: "😨", isCorrect: true }
      ]
    },
    {
      id: 5,
      question: "Tap the emoji that shows EXCITED!",
      options: [
        { text: "Excited", emoji: "🤩", isCorrect: true },
        { text: "Bored", emoji: "😐", isCorrect: false }
      ]
    }
  ];

  const startGame = () => {
    setIsActive(true);
    setTimeLeft(ROUND_TIME);
    setShowResult(false);
    setLastResult(null);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleAnswer(false, 'timeout');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, timeLeft]);

  // Reset timer when round changes
  useEffect(() => {
    if (currentRound < TOTAL_ROUNDS && !gameFinished) {
      startGame();
    }
  }, [currentRound]);

  const handleAnswer = (isCorrect, type = 'answer') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setLastResult('correct');
    } else {
      setLastResult(type === 'timeout' ? 'timeout' : 'wrong');
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
      title="Reflex Emotion Check"
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
                    {currentScenario.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentScenario.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option.isCorrect)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <div className="text-4xl mb-3">{option.emoji}</div>
                        <h3 className="font-bold text-xl">{option.text}</h3>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12">
                  <div className="text-8xl mb-6">
                    {lastResult === 'correct' ? '🎉' : lastResult === 'timeout' ? '⏰' : '❌'}
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {lastResult === 'correct' ? 'Great Job!' : lastResult === 'timeout' ? 'Time\'s Up!' : 'Oops!'}
                  </h2>
                  <p className="text-xl text-white/80">
                    {lastResult === 'correct' ? '+1 Point' : 'Keep trying!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexEmotionCheck;
