import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GenderJusticeLeaderBadge = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-30";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [initiatives, setInitiatives] = useState([false, false, false, false, false]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Timer not really needed for badge, but to follow pattern
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, showResult]);

  const handleComplete = (index) => {
    const newInitiatives = [...initiatives];
    newInitiatives[index] = true;
    setInitiatives(newInitiatives);
    showCorrectAnswerFeedback(1, false);
    if (newInitiatives.every(i => i)) {
      setCoins(prev => prev + 1);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Gender Justice Leader Badge"
      subtitle="Complete 5 initiatives"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-30"
      gameType="uvls"
      totalLevels={20}
      currentLevel={30}
      showConfetti={showResult}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6">Mark initiatives as complete:</p>
              
              <div className="space-y-3">
                {initiatives.map((init, index) => (
                  <button
                    key={index}
                    onClick={() => handleComplete(index)}
                    disabled={initiatives[index]}
                    className={`w-full py-3 rounded-xl font-bold text-white transition ${
                      initiatives[index]
                        ? 'bg-green-500 cursor-default'
                        : 'bg-blue-500 hover:opacity-90'
                    }`}
                  >
                    Initiative {index + 1} {initiatives[index] ? '✅' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Achievement Unlocked!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You led 5 equality initiatives.
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Consider public recognition.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GenderJusticeLeaderBadge;