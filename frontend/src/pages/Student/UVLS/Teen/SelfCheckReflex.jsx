import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfCheckReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [noticed, setNoticed] = useState(false);
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
      handleNoTension();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      cue: "Racing heart.",
      tension: true
    },
    {
      id: 2,
      cue: "Relaxed muscles.",
      tension: false
    },
    {
      id: 3,
      cue: "Sweaty palms.",
      tension: true
    },
    {
      id: 4,
      cue: "Steady breath.",
      tension: false
    },
    {
      id: 5,
      cue: "Tense shoulders.",
      tension: true
    }
  ];

  const handleNotice = () => {
    const question = questions[currentQuestion];
    if (question.tension) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setNoticed(true);
    proceedToNext();
  };

  const handleNoTension = () => {
    const question = questions[currentQuestion];
    if (!question.tension) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setNoticed(true);
    proceedToNext();
  };

  const proceedToNext = () => {
    setTimeout(() => {
      setNoticed(false);
      setTimeLeft(30);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 70) {
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
      title="Self-check Reflex"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / questions.length * 100 >= 70)}
      showGameOver={showResult && (score / questions.length * 100 >= 70)}
      score={coins}
      gameId="emotion-148"
      gameType="emotion"
      totalLevels={10}
      currentLevel={8}
      showConfetti={showResult && (score / questions.length * 100 >= 70)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6 text-center">Cue: "{questions[currentQuestion].cue}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleNotice}
                  className="py-3 rounded-xl font-bold text-white bg-red-500 hover:opacity-90"
                >
                  Tension!
                </button>
                <button
                  onClick={handleNoTension}
                  className="py-3 rounded-xl font-bold text-white bg-green-500 hover:opacity-90"
                >
                  No Tension
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
              {(score / questions.length * 100 >= 70) ? "Earned 3 Coins!" : "Aim for 70% next time."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach grounding techniques.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SelfCheckReflex;