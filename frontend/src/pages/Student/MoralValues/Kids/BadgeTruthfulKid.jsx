import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeTruthfulKid = () => {
  const navigate = useNavigate();
  const [completedActs, setCompletedActs] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const honestyActs = [
    { id: 1, text: "Returned a lost pencil", emoji: "✏️", completed: true },
    { id: 2, text: "Admitted not doing homework", emoji: "📚", completed: true },
    { id: 3, text: "Didn't cheat when asked", emoji: "✋", completed: true },
    { id: 4, text: "Returned extra candy", emoji: "🍬", completed: true },
    { id: 5, text: "Always chose truth over lies", emoji: "💎", completed: true }
  ];

  useEffect(() => {
    const completed = honestyActs.filter(act => act.completed);
    setCompletedActs(completed);
    
    if (completed.length === 5) {
      setTimeout(() => {
        setShowBadge(true);
        showCorrectAnswerFeedback(1, true);
      }, 1000);
    }
  }, []);

  const handleNext = () => {
    navigate("/student/moral-values/kids/respect-elders-story");
  };

  return (
    <GameShell
      title="Badge: Truthful Kid"
      subtitle="Honesty Achievement"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={3}
      gameId="moral-kids-10"
      gameType="educational"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showBadge}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 Achievement Unlocked!" : "Honesty Acts Progress"}
          </h2>
          
          <p className="text-white/80 mb-6 text-center">
            You've completed all honesty challenges!
          </p>

          <div className="space-y-3 mb-6">
            {honestyActs.map(act => (
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
            <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-2xl p-8 text-center animate-pulse">
              <div className="text-9xl mb-4">💎</div>
              <h3 className="text-white text-4xl font-bold mb-3">Truthful Kid Badge!</h3>
              <p className="text-white/90 text-lg">You've completed all 5 honesty acts!</p>
              <p className="text-white/80 text-sm mt-4">
                You're a champion of honesty! ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeTruthfulKid;

