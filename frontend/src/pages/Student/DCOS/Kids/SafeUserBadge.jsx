import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafeUserBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, text: "Never share passwords", emoji: "🔒", completed: true },
    { id: 2, text: "Don't talk to strangers online", emoji: "🚫", completed: true },
    { id: 3, text: "Keep personal info private", emoji: "🛡️", completed: true },
    { id: 4, text: "Follow family device rules", emoji: "👨‍👩‍👧", completed: true },
    { id: 5, text: "Tell parents about stranger messages", emoji: "📢", completed: true }
  ];

  useEffect(() => {
    // Simulate checking completed tasks from previous games
    const completed = tasks.filter(t => t.completed);
    setCompletedTasks(completed);
    
    if (completed.length === 5) {
      setTimeout(() => {
        setShowBadge(true);
        showCorrectAnswerFeedback(1, true);
      }, 1000);
    }
  }, []);

  const handleNext = () => {
    navigate("/student/dcos/kids/spot-bully-quiz");
  };

  return (
    <GameShell
      title="Safe User Badge"
      subtitle="Complete Safety Habits"
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={1}
      gameId="dcos-kids-10"
      gameType="educational"
      totalLevels={20}
      currentLevel={10}
      showConfetti={showBadge}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {showBadge ? "🏆 Achievement Unlocked!" : "Safety Habits Progress"}
          </h2>
          
          <div className="space-y-3 mb-6">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  completedTasks.find(t => t.id === task.id)
                    ? 'bg-green-500/30 border-green-400'
                    : 'bg-white/10 border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{task.emoji}</div>
                  <div className="flex-1 text-white font-semibold">{task.text}</div>
                  {completedTasks.find(t => t.id === task.id) && (
                    <div className="text-2xl">✅</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showBadge && (
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 text-center animate-pulse">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-white text-3xl font-bold mb-2">Safe Online Kid Badge!</h3>
              <p className="text-white/90">You've completed all 5 safety habits!</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default SafeUserBadge;

