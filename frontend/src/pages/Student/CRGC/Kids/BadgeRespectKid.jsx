import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeRespectKid = () => {
  const navigate = useNavigate();
  const [completedExamples, setCompletedExamples] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const examples = [
    { id: 1, example: "Respected different languages" },
    { id: 2, example: "Treated everyone kindly" },
    { id: 3, example: "Listened without interrupting" },
    { id: 4, example: "Supported gender equality" },
    { id: 5, example: "Included everyone equally" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedExamples(5);
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowBadge(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCorrectAnswerFeedback]);

  const handleFinish = () => {
    navigate("/games/crgc/kids");
  };

  return (
    <GameShell
      title="Badge: Respect Kid"
      subtitle="Achievement Unlocked"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="crgc-kids-20"
      gameType="crgc"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showBadge}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {!showBadge ? (
            <>
              <div className="text-7xl mb-4 text-center animate-pulse">🔄</div>
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                Checking your respect examples...
              </h3>
            </>
          ) : (
            <>
              <div className="text-9xl mb-4 text-center animate-bounce">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Respect Kid Badge!
              </h2>

              <div className="bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  Respect Examples Completed:
                </h3>
                <div className="space-y-2">
                  {examples.map(example => (
                    <div
                      key={example.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-3"
                    >
                      <div className="text-2xl">✅</div>
                      <div className="text-white font-semibold">{example.example}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  🌟 Congratulations! You've shown respect in 5 different situations! You understand 
                  that everyone deserves kindness and inclusion. Keep being respectful!
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold text-center">
                Badge Earned: Respect Kid! 🏆
              </p>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeRespectKid;

