import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AdvancedBreathing = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-83";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [calmness, setCalmness] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      sequence: "Inhale 4s."
    },
    {
      id: 2,
      sequence: "Hold 4s."
    },
    {
      id: 3,
      sequence: "Exhale 4s."
    },
    {
      id: 4,
      sequence: "Hold 4s."
    },
    {
      id: 5,
      sequence: "Repeat."
    }
  ];

  const handleComplete = () => {
    setCoins(prev => prev + 1);
    showCorrectAnswerFeedback(1, false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setCompleted(true);
      setShowResult(true);
      if (calmness > 5) {
        setCoins(prev => prev + 1);
      }
    }
  };

  const handleRate = (rate) => {
    setCalmness(rate);
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Advanced Breathing"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && completed}
      showGameOver={showResult && completed}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-83"
      gameType="uvls"
      totalLevels={20}
      currentLevel={83}
      showConfetti={showResult && completed}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6 text-center">{questions[currentQuestion].sequence}</p>
              
              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                Completed
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Breathing Complete!
            </h2>
            <p className="text-white/90 mb-4">Rate calmness (1-10):</p>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleRate(i + 1)}
                  className={`py-2 rounded-xl text-white ${calmness === i + 1 ? 'bg-blue-500' : 'bg-white/20'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {calmness > 5 ? "Earned 5 Coins!" : "Practice more."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Offer quiet space.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AdvancedBreathing;