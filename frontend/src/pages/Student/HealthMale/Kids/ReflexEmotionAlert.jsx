import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexEmotionAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-59";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const ROUND_TIME = 5;
  const TOTAL_ROUNDS = 5;

  const [coins, setCoins] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null); // 'correct', 'wrong', 'timeout'

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const timerRef = useRef(null);

  const scenarios = [
    {
      id: 1,
      instruction: "When you feel sad, should you...?",
      options: [
        { text: "Hide Emotions", emoji: "🤐", isCorrect: false },
        { text: "Talk About Feelings", emoji: "💬", isCorrect: true }
      ]
    },
    {
      id: 2,
      instruction: "When you're angry, you should...?",
      options: [
        { text: "Calm Down", emoji: "🧘", isCorrect: true },
        { text: "Yell Loudly", emoji: "😡", isCorrect: false }
      ]
    },
    {
      id: 3,
      instruction: "When excited, it's good to...?",
      options: [
        { text: "Act Bored", emoji: "😑", isCorrect: false },
        { text: "Share Excitement", emoji: "😊", isCorrect: true }
      ]
    },
    {
      id: 4,
      instruction: "When scared, you can...?",
      options: [
        { text: "Ask for Help", emoji: "🤝", isCorrect: true },
        { text: "Run Away", emoji: "🏃", isCorrect: false }
      ]
    },
    {
      id: 5,
      instruction: "When worried, try to...?",
      options: [
        { text: "Stay Worried", emoji: "😰", isCorrect: false },
        { text: "Think Positive", emoji: "💭", isCorrect: true }
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

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Reset timer when round changes
  useEffect(() => {
    if (currentRound < TOTAL_ROUNDS && !gameFinished) {
      startGame();
    }
  }, [currentRound]);

  const handleAnswer = (isCorrect, type = 'answer') => {
    clearInterval(timerRef.current);
    setIsActive(false);

    if (isCorrect) {
      setCoins(prev => prev + 1);
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
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const currentScenario = scenarios[currentRound];

  return (
    <GameShell
      title="Reflex Emotion Alert"
      subtitle={`Round ${currentRound + 1} of ${TOTAL_ROUNDS}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      backPath="/games/health-male/kids"
    >
      <div className="space-y-8 w-full max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">

          {!showResult ? (
            <>
              <div className="mb-8">
                <div className="text-6xl font-bold text-white mb-4 animate-pulse">
                  {timeLeft}s
                </div>
                <div className="w-full bg-white/20 rounded-full h-4">
                  <div
                    className="bg-yellow-400 h-4 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-8">
                {currentScenario.instruction}
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {currentScenario.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.isCorrect)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-8 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-4 group"
                  >
                    <span className="text-6xl group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </span>
                    <span className="text-xl font-bold">{option.text}</span>
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
                {lastResult === 'correct' ? '+1 Coin' : 'Keep trying!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexEmotionAlert;
