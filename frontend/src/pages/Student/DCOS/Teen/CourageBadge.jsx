import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CourageBadge = () => {
  const navigate = useNavigate();
  const [completedActs, setCompletedActs] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const antiBullyingActs = [
    { id: 1, text: "Blocked and reported cyberbullying", emoji: "🚫", completed: true },
    { id: 2, text: "Refused to join trolling group", emoji: "🛡️", completed: true },
    { id: 3, text: "Stopped a gossip chain", emoji: "✋", completed: true },
    { id: 4, text: "Defended someone being discriminated against", emoji: "🏳️‍🌈", completed: true },
    { id: 5, text: "Stood up as an upstander", emoji: "💪", completed: true }
  ];

  useEffect(() => {
    const completed = antiBullyingActs.filter(act => act.completed);
    setCompletedActs(completed);
    
    if (completed.length === 5) {
      setTimeout(() => {
        setShowBadge(true);
        showCorrectAnswerFeedback(1, true);
      }, 1000);
    }
  }, []);

  const handleFinish = () => {
    navigate("/games/digital-citizenship/teens");
  };

  return (
    <GameShell
      title="Courage Badge"
      subtitle="Anti-Bullying Hero"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={3}
      gameId="dcos-teen-20"
      gameType="dcos"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showBadge}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 Ultimate Achievement!" : "Anti-Bullying Acts Progress"}
          </h2>
          
          <p className="text-white/80 mb-6 text-center">
            You've completed all anti-bullying challenges!
          </p>

          <div className="space-y-3 mb-6">
            {antiBullyingActs.map(act => (
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
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 text-center animate-pulse">
              <div className="text-9xl mb-4">🦸</div>
              <h3 className="text-white text-4xl font-bold mb-3">Courage Hero!</h3>
              <p className="text-white/90 text-lg mb-2">You've completed all 5 anti-bullying acts!</p>
              <p className="text-white/80 text-sm mt-4">
                You're making the internet a safer, kinder place! 🌟
              </p>
              <p className="text-white/70 text-xs mt-3">
                Continue standing up for others and spreading kindness!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default CourageBadge;

