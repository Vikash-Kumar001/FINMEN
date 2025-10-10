import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeGratitudeHero = () => {
  const navigate = useNavigate();
  const [completedActs, setCompletedActs] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const gratitudeActs = [
    { id: 1, text: "Thanked friend for sharing notes", emoji: "📔", completed: true },
    { id: 2, text: "Used polite language consistently", emoji: "🙏", completed: true },
    { id: 3, text: "Returned lost money to bus conductor", emoji: "💵", completed: true },
    { id: 4, text: "Led group by listening to everyone", emoji: "👥", completed: true },
    { id: 5, text: "Expressed gratitude quickly and genuinely", emoji: "💖", completed: true }
  ];

  useEffect(() => {
    const completed = gratitudeActs.filter(act => act.completed);
    setCompletedActs(completed);
    
    if (completed.length === 5) {
      setTimeout(() => {
        setShowBadge(true);
        showCorrectAnswerFeedback(1, true);
      }, 1000);
    }
  }, []);

  const handleFinish = () => {
    navigate("/games/moral-values/teens");
  };

  return (
    <GameShell
      title="Badge: Gratitude Hero"
      subtitle="Gratitude Mastery"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={3}
      gameId="moral-teen-20"
      gameType="moral"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showBadge}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 Achievement Unlocked!" : "Gratitude Acts Progress"}
          </h2>
          
          <p className="text-white/80 mb-6 text-center">
            You've completed all gratitude and respect challenges!
          </p>

          <div className="space-y-3 mb-6">
            {gratitudeActs.map(act => (
              <div
                key={act.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  completedActs.find(a => a.id === act.id)
                    ? 'bg-green-500/30 border-green-400'
                    : 'bg-white/10 border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{act.emoji}</div>
                  <div className="flex-1 text-white font-semibold">{act.text}</div>
                  {completedActs.find(a => a.id === act.id) && (
                    <div className="text-2xl">✅</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showBadge && (
            <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl p-8 text-center animate-pulse">
              <div className="text-9xl mb-4">🙏</div>
              <h3 className="text-white text-4xl font-bold mb-3">Gratitude Hero!</h3>
              <p className="text-white/90 text-lg">You've completed all 5 gratitude acts!</p>
              <p className="text-white/80 text-sm mt-4">
                You spread respect and gratitude everywhere! 💖
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeGratitudeHero;

