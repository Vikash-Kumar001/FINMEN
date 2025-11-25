import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmotionPatternJournal = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-70";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [moods, setMoods] = useState(["", "", "", "", ""]);
  const [currentMood, setCurrentMood] = useState(0);
  const [reflection, setReflection] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  const handleMoodChange = (e) => {
    const newMoods = [...moods];
    newMoods[currentMood] = e.target.value;
    setMoods(newMoods);
  };

  const handleReflectionChange = (e) => {
    setReflection(e.target.value);
  };

  const handleSubmit = () => {
    if (currentMood < 4 && moods[currentMood].trim() === "") return;
    if (currentMood === 4 && reflection.trim() === "") return;
    showCorrectAnswerFeedback(1, false);
    if (currentMood < 4) {
      setTimeout(() => {
        setCurrentMood(prev => prev + 1);
        setTimeLeft(30);
      }, 1500);
    } else {
      setShowResult(true);
      if (moods.every(m => m.trim() !== "") && reflection.trim() !== "") {
        setCoins(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = moods.every(m => m.trim() !== "") && reflection.trim() !== "";

  return (
    <GameShell
      title="Emotion Pattern Journal"
      subtitle={`Question ${currentMood + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-70"
      gameType="uvls"
      totalLevels={20}
      currentLevel={70}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              {currentMood < 4 ? (
                <>
                  <p className="text-white text-xl mb-6">Enter mood for day {currentMood + 1}:</p>
                  <input
                    value={moods[currentMood]}
                    onChange={handleMoodChange}
                    className="w-full p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="Mood..."
                  />
                </>
              ) : (
                <>
                  <p className="text-white text-xl mb-6">Reflect on patterns:</p>
                  <textarea
                    value={reflection}
                    onChange={handleReflectionChange}
                    className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="Patterns and plan..."
                  />
                </>
              )}
              <button
                onClick={handleSubmit}
                disabled={(currentMood < 4 ? moods[currentMood].trim() === "" : reflection.trim() === "") && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  (currentMood < 4 ? moods[currentMood].trim() !== "" : reflection.trim() !== "") || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Log
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Journal Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your patterns are tracked.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use anonymized class trends for discussion.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionPatternJournal;