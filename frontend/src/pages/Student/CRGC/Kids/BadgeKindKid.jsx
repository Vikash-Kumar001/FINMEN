import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeKindKid = () => {
  const navigate = useNavigate();
  const [completedActs, setCompletedActs] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const acts = [
    { id: 1, act: "Comforted a sad friend" },
    { id: 2, act: "Showed empathy to others" },
    { id: 3, act: "Identified kind actions" },
    { id: 4, act: "Showed compassion to animals" },
    { id: 5, act: "Stood up against bullying" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedActs(5);
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowBadge(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCorrectAnswerFeedback]);

  const handleNext = () => {
    navigate("/student/civic-responsibility/kids/classroom-story");
  };

  return (
    <GameShell
      title="Badge: Kind Kid"
      subtitle="Achievement Unlocked"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="crgc-kids-10"
      gameType="crgc"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showBadge}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {!showBadge ? (
            <>
              <div className="text-7xl mb-4 text-center animate-pulse">🔄</div>
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                Checking your empathy acts...
              </h3>
            </>
          ) : (
            <>
              <div className="text-9xl mb-4 text-center animate-bounce">💖</div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Kind Kid Badge!
              </h2>

              <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  Empathy Acts Completed:
                </h3>
                <div className="space-y-2">
                  {acts.map(act => (
                    <div
                      key={act.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-3"
                    >
                      <div className="text-2xl">✅</div>
                      <div className="text-white font-semibold">{act.act}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  🌟 Congratulations! You've shown empathy in 5 different cases! You're a truly 
                  kind and caring person. Keep spreading kindness!
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold text-center">
                Badge Earned: Kind Kid! 💖
              </p>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeKindKid;

