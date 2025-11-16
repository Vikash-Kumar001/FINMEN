import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCompassionLeader = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    {
      id: 1,
      title: "Show Empathy",
      description: "Listen actively to a friend or family member who needs to talk",
      completed: false,
      coins: 2
    },
    {
      id: 2,
      title: "Help Someone",
      description: "Perform a kind act for someone who might be struggling",
      completed: false,
      coins: 2
    },
    {
      id: 3,
      title: "Stand Against Bullying",
      description: "Intervene or report when you witness bullying or unfair treatment",
      completed: false,
      coins: 2
    },
    {
      id: 4,
      title: "Volunteer Time",
      description: "Spend time helping at a local charity, shelter, or community organization",
      completed: false,
      coins: 2
    },
    {
      id: 5,
      title: "Practice Inclusivity",
      description: "Make an effort to include someone who might feel left out",
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
        title="Badge: Compassion Leader"
        subtitle="Badge Earned!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-10"
        gameType="civic-responsibility"
        totalLevels={10}
        currentLevel={10}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏅</div>
          <h2 className="text-2xl font-bold mb-4">Compassion Leader Badge Earned!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by completing all compassion challenges!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're a true leader in compassion!
          </div>
          <p className="text-white/80">
            Remember: Leading with compassion creates positive change in your community and beyond!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Badge: Compassion Leader"
      subtitle="Complete 5 acts of compassion to earn your badge"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Compassion Challenges</span>
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

export default BadgeCompassionLeader;