import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LifeSkillsChampionBadge = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-86";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [challenges, setChallenges] = useState([false, false, false, false, false]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleComplete = (index) => {
    const newChallenges = [...challenges];
    newChallenges[index] = true;
    setChallenges(newChallenges);
    setCoins(prev => prev + 1);
    showCorrectAnswerFeedback(1, false);
    if (newChallenges.every(c => c)) {
      setBadge(true);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Life Skills Champion Badge"
      subtitle="Complete 5 challenges"
      onNext={handleNext}
      nextEnabled={showResult && badge}
      showGameOver={showResult && badge}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-86"
      gameType="uvls"
      totalLevels={20}
      currentLevel={86}
      showConfetti={showResult && badge}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Mark challenges complete:</p>
              
              <div className="space-y-3">
                {challenges.map((chal, index) => (
                  <button
                    key={index}
                    onClick={() => handleComplete(index)}
                    disabled={challenges[index]}
                    className={`w-full py-3 rounded-xl font-bold text-white transition ${
                      challenges[index]
                        ? 'bg-green-500 cursor-default'
                        : 'bg-blue-500 hover:opacity-90'
                    }`}
                  >
                    {challenges[index] ? '✅' : ''} Advanced life-skill {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Badge Earned!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You demonstrated 5 advanced life-skills.
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use badge for student portfolios / incubator pitch.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LifeSkillsChampionBadge;