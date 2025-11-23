import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LittleEmpathBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const empathyTasks = [
    {
      id: 1,
      title: "Share Your Toy",
      description: "Share one of your toys with a friend",
      emoji: "🧸",
      category: "Sharing"
    },
    {
      id: 2,
      title: "Help Someone",
      description: "Help a classmate with something they're struggling with",
      emoji: "🤝",
      category: "Helping"
    },
    {
      id: 3,
      title: "Kind Words",
      description: "Say something nice to make someone smile",
      emoji: "💬",
      category: "Kindness"
    },
    {
      id: 4,
      title: "Listen to Friend",
      description: "Listen carefully when a friend is talking to you",
      emoji: "👂",
      category: "Listening"
    },
    {
      id: 5,
      title: "Comfort Someone Sad",
      description: "Help comfort someone who is feeling sad or upset",
      emoji: "🤗",
      category: "Caring"
    },
    {
      id: 6,
      title: "Include Everyone",
      description: "Invite someone who is alone to join your game",
      emoji: "⚽",
      category: "Inclusion"
    },
    {
      id: 7,
      title: "Say Thank You",
      description: "Thank someone who helped you or was kind to you",
      emoji: "🙏",
      category: "Gratitude"
    }
  ];

  const handleTaskToggle = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      const newCompletedTasks = [...completedTasks, taskId];
      setCompletedTasks(newCompletedTasks);
      
      if (newCompletedTasks.length === 5) {
        showCorrectAnswerFeedback(3, false);
        setEarnedBadge(true);
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    // This is the last level - navigate back to games menu
    navigate("/games/uvls/kids");
  };

  const progressPercentage = (completedTasks.length / 5) * 100;

  return (
    <GameShell
      title="Little Empath Badge"
      subtitle={`Complete 5 Empathy Tasks (${completedTasks.length}/5)`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={earnedBadge ? 3 : 0}
      gameId="uvls-kids-10"
      gameType="uvls"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={10}
      showConfetti={showResult}
      backPath="/games/uvls/kids"
    
      maxScore={10} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Progress to Badge</span>
                  <span className="text-yellow-400 font-bold">{completedTasks.length}/5</span>
                </div>
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-white/80 text-sm mb-6 text-center">
                Choose 5 acts of empathy to complete this week. Ask your teacher to verify!
              </p>

              <div className="space-y-3">
                {empathyTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskToggle(task.id)}
                    disabled={completedTasks.length >= 5 && !completedTasks.includes(task.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      completedTasks.includes(task.id)
                        ? 'bg-green-500/40 border-green-400 ring-2 ring-green-300'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${completedTasks.length >= 5 && !completedTasks.includes(task.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{task.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{task.title}</h4>
                          {completedTasks.includes(task.id) && (
                            <span className="text-green-400 text-xl">✓</span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mb-1">{task.description}</p>
                        <span className="inline-block bg-white/20 px-2 py-1 rounded text-white/70 text-xs">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 border-2 border-blue-400/50 rounded-xl">
                <p className="text-white/90 text-sm">
                  <strong>Teacher Tip:</strong> Allow teachers to verify acts for fairness. 
                  Students can check off tasks as they complete them during the week!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations!</h2>
            <p className="text-white/90 text-xl mb-6">
              You've earned the Little Empath Badge!
            </p>
            
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-6 mb-6 transform hover:scale-105 transition-all">
              <div className="text-6xl mb-3">🌟</div>
              <h3 className="text-white text-2xl font-bold mb-2">Little Empath</h3>
              <p className="text-white/90 text-sm">Badge of Kindness & Compassion</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold mb-3">Your Completed Tasks:</p>
              <div className="space-y-2">
                {empathyTasks
                  .filter(task => completedTasks.includes(task.id))
                  .map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-white/80 text-sm">
                      <span>{task.emoji}</span>
                      <span>{task.title}</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-yellow-400 text-xl font-bold mb-4">
              You earned 3 Coins! Achievement Unlocked! 🏆
            </p>
            <p className="text-white/70 text-sm">
              Keep being kind and empathetic every day!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LittleEmpathBadge;

