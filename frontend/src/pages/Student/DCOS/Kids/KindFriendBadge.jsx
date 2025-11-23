import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const KindFriendBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [completedActs, setCompletedActs] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const kindnessActs = [
    { id: 1, text: "Said something nice about someone's post", emoji: "💬", completed: true },
    { id: 2, text: "Reported a mean comment", emoji: "📢", completed: true },
    { id: 3, text: "Stood up for a friend being teased", emoji: "🛡️", completed: true },
    { id: 4, text: "Included someone who was left out", emoji: "🤝", completed: true },
    { id: 5, text: "Wrote about helping someone", emoji: "📝", completed: true }
  ];

  useEffect(() => {
    // Simulate checking completed acts from previous games
    const completed = kindnessActs.filter(act => act.completed);
    setCompletedActs(completed);
    
    if (completed.length === 5) {
      setTimeout(() => {
        setShowBadge(true);
        showCorrectAnswerFeedback(1, true);
      }, 1000);
    }
  }, []);

  const handleFinish = () => {
    navigate("/games/digital-citizenship/kids");
  };

  return (
    <GameShell
      title="Kind Friend Badge"
      subtitle="Complete Kindness Acts"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={1}
      gameId="dcos-kids-20"
      gameType="educational"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showBadge}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 Achievement Unlocked!" : "Kindness Acts Progress"}
          </h2>
          
          <p className="text-white/80 mb-6 text-center">
            You've been spreading kindness online!
          </p>

          <div className="space-y-3 mb-6">
            {kindnessActs.map(act => (
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
              <div className="text-9xl mb-4">🏆</div>
              <h3 className="text-white text-4xl font-bold mb-3">Kind Online Friend Badge!</h3>
              <p className="text-white/90 text-lg">You've completed all 5 kindness acts!</p>
              <p className="text-white/80 text-sm mt-4">
                You're making the internet a kinder place! 💖
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default KindFriendBadge;

