import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexEmotionCheck = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      instruction: "Tap the emoji that shows HAPPY!",
      correctEmoji: "😊",
      wrongEmoji: "😠",
      correctAnswer: "😊",
      timeout: 3000
    },
    {
      id: 2,
      instruction: "Tap the emoji that shows SAD!",
      correctEmoji: "😢",
      wrongEmoji: "😄",
      correctAnswer: "😢",
      timeout: 3000
    },
    {
      id: 3,
      instruction: "Tap the emoji that shows ANGRY!",
      correctEmoji: "😠",
      wrongEmoji: "😊",
      correctAnswer: "😠",
      timeout: 3000
    },
    {
      id: 4,
      instruction: "Tap the emoji that shows SCARED!",
      correctEmoji: "😨",
      wrongEmoji: "😢",
      correctAnswer: "😨",
      timeout: 3000
    },
    {
      id: 5,
      instruction: "Tap the emoji that shows EXCITED!",
      correctEmoji: "🤩",
      wrongEmoji: "😐",
      correctAnswer: "🤩",
      timeout: 3000
    }
  ];

  useEffect(() => {
    if (showQuestion && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 100);
      }, 100);
      return () => clearTimeout(timer);
    } else if (showQuestion && timeLeft <= 0) {
      // Time's up - wrong answer
      handleTimeout();
    }
  }, [showQuestion, timeLeft]);

  const startQuestion = (timeout) => {
    setQuestionStartTime(Date.now());
    setTimeLeft(timeout);
    setShowQuestion(true);
  };

  const handleTimeout = () => {
    setShowQuestion(false);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        startQuestion(questions[currentQuestion + 1].timeout);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleEmojiClick = (selectedEmoji) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedEmoji === currentQ.correctAnswer;
    const responseTime = Date.now() - questionStartTime;

    setShowQuestion(false);

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        startQuestion(questions[currentQuestion + 1].timeout);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/emotion-match-puzzle");
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const progress = ((currentQuestion + (showQuestion ? 0 : 1)) / questions.length) * 100;

  return (
    <GameShell
      title="Reflex Emotion Check"
      subtitle={`Challenge ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-53"
      gameType="health-male"
      totalLevels={60}
      currentLevel={53}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Challenge {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          {showQuestion && (
            <>
              <div className="text-center mb-6">
                <p className="text-white text-xl mb-2">{getCurrentQuestion().instruction}</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(timeLeft / getCurrentQuestion().timeout) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm">React quickly!</p>
              </div>

              <div className="flex justify-center gap-8">
                <button
                  onClick={() => handleEmojiClick(getCurrentQuestion().correctEmoji)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-110 text-6xl"
                >
                  {getCurrentQuestion().correctEmoji}
                </button>
                <button
                  onClick={() => handleEmojiClick(getCurrentQuestion().wrongEmoji)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-110 text-6xl"
                >
                  {getCurrentQuestion().wrongEmoji}
                </button>
              </div>
            </>
          )}

          {!showQuestion && !gameFinished && (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {timeLeft <= 0 ? "⏰" : "⚡"}
              </div>
              <p className="text-white text-lg">
                {timeLeft <= 0 ? "Time's up!" : "Great job!"}
              </p>
            </div>
          )}

          {gameFinished && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white">Reflex Challenge Complete!</h3>
              <p className="text-white/90">
                You tested your emotion recognition reflexes! Fast thinking helps you understand feelings quickly!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexEmotionCheck;
