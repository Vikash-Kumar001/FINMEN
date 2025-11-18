import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeVolunteerLeaderTeen = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    {
      id: 1,
      title: "Organize a Community Event",
      description: "Plan and execute a volunteer event that brings people together for a cause",
      completed: false,
      coins: 2
    },
    {
      id: 2,
      title: "Mentor Another Volunteer",
      description: "Guide someone new to volunteering and help them find their passion",
      completed: false,
      coins: 2
    },
    {
      id: 3,
      title: "Lead a Fundraising Campaign",
      description: "Take charge of raising funds or resources for a charitable organization",
      completed: false,
      coins: 2
    },
    {
      id: 4,
      title: "Advocate for a Cause",
      description: "Raise awareness about an important issue through education or activism",
      completed: false,
      coins: 2
    },
    {
      id: 5,
      title: "Create Sustainable Impact",
      description: "Develop a project or initiative that creates lasting positive change",
      completed: false,
      coins: 2
    }
  ];

  const handleTaskComplete = (taskId) => {
    if (completedTasks.includes(taskId)) return; // Already completed
    
    const newCompletedTasks = [...completedTasks, taskId];
    setCompletedTasks(newCompletedTasks);
    
    // Add coins for task completion
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setCoins(prev => prev + task.coins);
      showCorrectAnswerFeedback(task.coins, true);
    }
    
    // Check if all tasks are completed
    if (newCompletedTasks.length === tasks.length) {
      setTimeout(() => setGameFinished(true), 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  if (gameFinished) {
    return (
      <GameShell
        title="Badge: Volunteer Leader Teen"
        subtitle="Badge Earned!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-60"
        gameType="civic-responsibility"
        totalLevels={60}
        currentLevel={60}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏅</div>
          <h2 className="text-2xl font-bold mb-4">Volunteer Leader Teen Badge Earned!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by completing all volunteer leadership challenges!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're a champion of community service!
          </div>
          <p className="text-white/80">
            Remember: Your leadership in volunteering inspires others and creates positive change in your community!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Badge: Volunteer Leader Teen"
      subtitle="Complete 5 teen volunteer challenges to earn your badge"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Volunteer Leadership Challenges</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="space-y-4">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  completedTasks.includes(task.id)
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <p className="text-white/80 mt-1">{task.description}</p>
                  </div>
                  
                  {completedTasks.includes(task.id) ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white">✓</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
                
                {!completedTasks.includes(task.id) && (
                  <div className="mt-3 text-sm text-yellow-400">
                    Reward: {task.coins} coins
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-white">Progress:</span>
              <span className="text-white font-bold">{completedTasks.length}/{tasks.length} completed</span>
            </div>
            <div className="mt-2 bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeVolunteerLeaderTeen;