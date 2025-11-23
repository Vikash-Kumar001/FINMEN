import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeCivicLeaderTeen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    {
      id: 1,
      title: "Organize a Community Service Project",
      description: "Plan and execute a service project that addresses a local need in your community",
      completed: false,
      coins: 3
    },
    {
      id: 2,
      title: "Participate in Local Government",
      description: "Attend a city council meeting or engage with local officials about an issue you care about",
      completed: false,
      coins: 3
    },
    {
      id: 3,
      title: "Lead a School Initiative",
      description: "Take leadership of a school club, event, or improvement project",
      completed: false,
      coins: 3
    },
    {
      id: 4,
      title: "Practice Responsible Citizenship",
      description: "Demonstrate consistent civic engagement through voting (when eligible) and staying informed",
      completed: false,
      coins: 3
    },
    {
      id: 5,
      title: "Mentor Younger Students",
      description: "Provide guidance and support to younger students in academic or extracurricular activities",
      completed: false,
      coins: 3
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
        title="Badge: Civic Leader Teen"
        subtitle="Badge Earned!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-100"
        gameType="civic-responsibility"
        totalLevels={100}
        currentLevel={100}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏅</div>
          <h2 className="text-2xl font-bold mb-4">Civic Leader Teen Badge Earned!</h2>
          <p className="text-white mb-6">
            You scored {coins} coins by completing all civic leadership activities!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're a model civic leader!
          </div>
          <p className="text-white/80">
            Remember: Your commitment to civic leadership helps strengthen democracy and creates positive change in your community!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Badge: Civic Leader Teen"
      subtitle="Complete 5 civic leadership activities to earn your badge"
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Civic Leadership Activities</span>
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

export default BadgeCivicLeaderTeen;