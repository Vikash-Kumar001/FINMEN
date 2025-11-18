import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexAwarenessTeen = () => {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [roundFinished, setRoundFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Reproductive health education:",
      correctOption: "normal",
      options: [
        { id: "normal", text: "✅ Reproductive Health = Normal", emoji: "✅", isCorrect: true },
        { id: "shame", text: "❌ Reproductive Health = Shame", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Learning about body changes:",
      correctOption: "normal",
      options: [
        { id: "normal", text: "✅ Reproductive Health = Normal", emoji: "✅", isCorrect: true },
        { id: "shame", text: "❌ Reproductive Health = Shame", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Talking to doctor about concerns:",
      correctOption: "normal",
      options: [
        { id: "normal", text: "✅ Reproductive Health = Normal", emoji: "✅", isCorrect: true },
        { id: "shame", text: "❌ Reproductive Health = Shame", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Understanding wet dreams:",
      correctOption: "normal",
      options: [
        { id: "normal", text: "✅ Reproductive Health = Normal", emoji: "✅", isCorrect: true },
        { id: "shame", text: "❌ Reproductive Health = Shame", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Asking questions in class:",
      correctOption: "normal",
      options: [
        { id: "normal", text: "✅ Reproductive Health = Normal", emoji: "✅", isCorrect: true },
        { id: "shame", text: "❌ Reproductive Health = Shame", emoji: "❌", isCorrect: false }
      ]
    }
  ];

  useEffect(() => {
    if (showQuestion && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showQuestion && timeLeft === 0) {
      handleTimeout();
    }
  }, [showQuestion, timeLeft]);

  useEffect(() => {
    if (currentRound < scenarios.length) {
      startRound();
    } else {
      setGameFinished(true);
    }
  }, [currentRound]);

  const startRound = () => {
    setShowQuestion(true);
    setTimeLeft(3);
    setRoundFinished(false);
  };

  const handleChoice = (optionId) => {
    if (roundFinished) return;

    const currentScenario = scenarios[currentRound];
    const selectedOption = currentScenario.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, {
      round: currentRound,
      optionId,
      isCorrect,
      timeLeft
    }]);

    setRoundFinished(true);
    setShowQuestion(false);

    setTimeout(() => {
      if (currentRound < scenarios.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleTimeout = () => {
    setChoices([...choices, {
      round: currentRound,
      optionId: null,
      isCorrect: false,
      timeLeft: 0
    }]);

    setRoundFinished(true);
    setShowQuestion(false);

    setTimeout(() => {
      if (currentRound < scenarios.length - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentRound];

  const handleNext = () => {
    navigate("/student/health-male/teens/reproductive-match-puzzle-teen");
  };

  const correctAnswers = choices.filter(c => c.isCorrect).length;
  const totalCoins = correctAnswers * 3;

  return (
    <GameShell
      title="Reflex Awareness (Teen)"
      subtitle={`Round ${currentRound + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={totalCoins}
      gameId="health-male-teen-33"
      gameType="health-male"
      totalLevels={100}
      currentLevel={33}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 33/100</span>
            <span className="text-yellow-400 font-bold">Coins: {totalCoins}</span>
          </div>

          {!showQuestion ? (
            <div className="text-center">
              <p className="text-white text-lg mb-4">Get ready for the next challenge!</p>
              <p className="text-white/80">Quick! Tap the healthy attitude when it appears!</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-white text-lg mb-2">{getCurrentScenario().text}</p>
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {timeLeft}
                </div>
                <p className="text-white/80">seconds left!</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {getCurrentScenario().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-center ${
                      option.isCorrect
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                    } text-white`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-lg">{option.text}</h3>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexAwarenessTeen;
