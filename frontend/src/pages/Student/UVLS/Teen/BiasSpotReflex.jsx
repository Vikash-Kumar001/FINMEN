import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BiasSpotReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [detected, setDetected] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleNoBias(); // Default to no bias if time out
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      clip: "Girls are bad at sports.",
      hasBias: true
    },
    {
      id: 2,
      clip: "Math is fun for everyone.",
      hasBias: false
    },
    {
      id: 3,
      clip: "Boys don't cry.",
      hasBias: true
    },
    {
      id: 4,
      clip: "Learning is important.",
      hasBias: false
    },
    {
      id: 5,
      clip: "Women can't lead.",
      hasBias: true
    }
  ];

  const handleDetect = () => {
    const question = questions[currentQuestion];
    if (question.hasBias) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setDetected(true);
    proceedToNext();
  };

  const handleNoBias = () => {
    const question = questions[currentQuestion];
    if (!question.hasBias) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setDetected(true);
    proceedToNext();
  };

  const proceedToNext = () => {
    setTimeout(() => {
      setDetected(false);
      setTimeLeft(30);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 75) {
          setCoins(3);
        }
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Bias Spot Reflex"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / questions.length * 100 >= 75)}
      showGameOver={showResult && (score / questions.length * 100 >= 75)}
      score={coins}
      gameId="gender-123"
      gameType="gender"
      totalLevels={10}
      currentLevel={3}
      showConfetti={showResult && (score / questions.length * 100 >= 75)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6 text-center">Clip: "{questions[currentQuestion].clip}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDetect}
                  className="py-3 rounded-xl font-bold text-white bg-red-500 hover:opacity-90"
                >
                  Bias Detected!
                </button>
                <button
                  onClick={handleNoBias}
                  className="py-3 rounded-xl font-bold text-white bg-green-500 hover:opacity-90"
                >
                  No Bias
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Reflex Test Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Score: {score} / {questions.length} ({(score / questions.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / questions.length * 100 >= 75) ? "Earned 3 Coins!" : "Aim for 75% next time."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Include subtle bias examples.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BiasSpotReflex;