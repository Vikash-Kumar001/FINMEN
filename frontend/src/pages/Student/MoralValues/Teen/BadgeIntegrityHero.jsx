import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeIntegrityHero = () => {
  const navigate = useNavigate();
  const [completedDilemmas, setCompletedDilemmas] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const integrityDilemmas = [
    { id: 1, text: "Refused to lie for a friend", emoji: "🤥", completed: true },
    { id: 2, text: "Chose truth over white lies", emoji: "💎", completed: true },
    { id: 3, text: "Refused a bribe offer", emoji: "💰", completed: true },
    { id: 4, text: "Didn't cheat in important exam", emoji: "📝", completed: true },
    { id: 5, text: "Led group with honesty", emoji: "👥", completed: true }
  ];

  useEffect(() => {
    const completed = integrityDilemmas.filter(d => d.completed);
    setCompletedDilemmas(completed);
    
    if (completed.length === 5) {
      setTimeout(() => {
        setShowBadge(true);
        showCorrectAnswerFeedback(1, true);
      }, 1000);
    }
  }, []);

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-obey-or-question");
  };

  return (
    <GameShell
      title="Badge: Integrity Hero"
      subtitle="Integrity Mastery"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={3}
      gameId="moral-teen-10"
      gameType="moral"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showBadge}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 Achievement Unlocked!" : "Integrity Dilemmas Progress"}
          </h2>
          
          <p className="text-white/80 mb-6 text-center">
            You've faced and conquered all integrity challenges!
          </p>

          <div className="space-y-3 mb-6">
            {integrityDilemmas.map(dilemma => (
              <div
                key={dilemma.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  completedDilemmas.find(d => d.id === dilemma.id)
                    ? 'bg-green-500/30 border-green-400'
                    : 'bg-white/10 border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{dilemma.emoji}</div>
                  <div className="flex-1 text-white font-semibold">{dilemma.text}</div>
                  {completedDilemmas.find(d => d.id === dilemma.id) && (
                    <div className="text-2xl">✅</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showBadge && (
            <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl p-8 text-center animate-pulse">
              <div className="text-9xl mb-4">💎</div>
              <h3 className="text-white text-4xl font-bold mb-3">Integrity Hero!</h3>
              <p className="text-white/90 text-lg">You've completed all 5 integrity dilemmas!</p>
              <p className="text-white/80 text-sm mt-4">
                You have unshakeable moral character! 🌟
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeIntegrityHero;

