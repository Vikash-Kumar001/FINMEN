import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexSafety = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-73";
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
      instruction: "You see a red light at the crosswalk. Tap the SAFE choice!",
      wrongEmoji: "🏃",
      correctEmoji: "🛑",
      correctAnswer: "🛑",
      correctText: "Stop & Wait",
      wrongText: "Run Across"
    },
    {
      id: 2,
      instruction: "You find a bottle of cleaning liquid. Tap the SAFE choice!",
      correctEmoji: "🚫",
      wrongEmoji: "🥤",
      correctAnswer: "🚫",
      correctText: "Don't Touch",
      wrongText: "Drink It"
    },
    {
      id: 3,
      instruction: "A stranger asks you to go with them. Tap the SAFE choice!",
      wrongEmoji: "🤝",
      correctEmoji: "🏃",
      correctAnswer: "🏃",
      correctText: "Run & Tell",
      wrongText: "Go With Them"
    },
    {
      id: 4,
      instruction: "You are riding a bike. Tap the SAFE choice!",
      correctEmoji: "⛑️",
      wrongEmoji: "🧢",
      correctAnswer: "⛑️",
      correctText: "Wear Helmet",
      wrongText: "Wear Hat"
    },
    {
      id: 5,
      instruction: "You see a hot stove. Tap the SAFE choice!",
      correctEmoji: "🚫",
      wrongEmoji: "👆",
      correctAnswer: "🚫",
      correctText: "Stay Away",
      wrongText: "Touch It"
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
      setLastResult({ correct: true, message: "Safe choice!" });
    } else {
      setLastResult({ correct: false, message: "Oops! Be safe!" });
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
    navigate("/student/health-male/kids/safety-match-puzzle");
  };

  const currentQ = questions[currentRound];

  return (
    <GameShell
      title="Reflex Safety"
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-110 text-6xl flex flex-col items-center"
                  >
                    <div className="text-4xl mb-2">{currentQ.correctEmoji}</div>
                    <div className="text-sm font-medium">{currentQ.correctText}</div>
                  </button>
                  <button
                    onClick={() => handleEmojiClick(currentQ.wrongEmoji)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-110 text-6xl flex flex-col items-center"
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
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold text-white">Safety Reflex Complete!</h3>
              <p className="text-white/90">
                You made quick, safe choices! Fast thinking keeps you safe from danger!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexSafety;
