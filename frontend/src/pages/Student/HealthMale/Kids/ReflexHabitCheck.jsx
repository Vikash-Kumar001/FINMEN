import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexHabitCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-93";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5000); // 5 seconds per round
  const [isActive, setIsActive] = useState(false);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const timerRef = useRef(null);
  const ROUND_TIME = 5000;
  const TOTAL_ROUNDS = 5;

  const questions = [
    {
      id: 1,
      instruction: "It's morning! Tap the GOOD habit!",
      wrongEmoji: "📺",
      correctEmoji: "🛏️",
      correctAnswer: "🛏️",
      correctText: "Make Bed",
      wrongText: "Watch TV"
    },
    {
      id: 2,
      instruction: "You finished lunch. Tap the GOOD habit!",
      wrongEmoji: "🏃",
      correctEmoji: "🍽️",
      correctAnswer: "🍽️",
      correctText: "Clean Up",
      wrongText: "Run Away"
    },
    {
      id: 3,
      instruction: "You have homework. Tap the GOOD habit!",
      correctEmoji: "📝",
      wrongEmoji: "🎮",
      correctAnswer: "📝",
      correctText: "Do It Now",
      wrongText: "Play Games"
    },
    {
      id: 4,
      instruction: "It's raining. Tap the GOOD habit!",
      wrongEmoji: "🌧️",
      correctEmoji: "📚",
      correctAnswer: "📚",
      correctText: "Read Book",
      wrongText: "Play in Mud"
    },
    {
      id: 5,
      instruction: "Bedtime is near. Tap the GOOD habit!",
      correctEmoji: "🦷",
      wrongEmoji: "🍬",
      correctAnswer: "🦷",
      correctText: "Brush Teeth",
      wrongText: "Eat Candy"
    }
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 100);
      }, 100);
    } else if (timeLeft <= 0 && isActive) {
      handleTimeout();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  useEffect(() => {
    startRound();
    return () => clearInterval(timerRef.current);
  }, [currentRound]);

  const startRound = () => {
    setTimeLeft(ROUND_TIME);
    setIsActive(true);
    setShowResult(false);
  };

  const handleTimeout = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    setLastResult({ correct: false, message: "Time's up!" });
    setShowResult(true);

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleEmojiClick = (selectedEmoji) => {
    if (!isActive) return;

    setIsActive(false);
    clearInterval(timerRef.current);

    const currentQ = questions[currentRound];
    const isCorrect = selectedEmoji === currentQ.correctAnswer;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setLastResult({ correct: true, message: "Great habit!" });
    } else {
      setLastResult({ correct: false, message: "Try again!" });
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
    navigate("/student/health-male/kids/daily-match-puzzle");
  };

  const currentQ = questions[currentRound];

  return (
    <GameShell
      title="Reflex Habit Check"
      subtitle={`Challenge ${currentRound + 1} of ${TOTAL_ROUNDS}`}
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
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {!gameFinished ? (
            <>
              <div className="text-center mb-6">
                <p className="text-white text-xl mb-4">{currentQ.instruction}</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm">Choose quickly!</p>
              </div>

              {!showResult ? (
                <div className="flex justify-center gap-8">
                  <button
                    onClick={() => handleEmojiClick(currentQ.correctEmoji)}
                    className=" text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-110 text-6xl flex flex-col items-center"
                  >
                    <div className="text-4xl mb-2">{currentQ.correctEmoji}</div>
                    <div className="text-sm font-medium">{currentQ.correctText}</div>
                  </button>
                  <button
                    onClick={() => handleEmojiClick(currentQ.wrongEmoji)}
                    className=" text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-110 text-6xl flex flex-col items-center"
                  >
                    <div className="text-4xl mb-2">{currentQ.wrongEmoji}</div>
                    <div className="text-sm font-medium">{currentQ.wrongText}</div>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {lastResult.correct ? "🌟" : "⚠️"}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lastResult.message}
                  </h3>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white">Reflex Challenge Complete!</h3>
              <p className="text-white/90">
                You're building great habits! Consistency is key to success!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexHabitCheck;
