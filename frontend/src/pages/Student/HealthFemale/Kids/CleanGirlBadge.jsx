import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';

const CleanGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Wash hands before eating', completed: false },
    { id: 2, text: 'Brush teeth twice today', completed: false },
    { id: 3, text: 'Take a bath or shower', completed: false },
    { id: 4, text: 'Wear clean clothes', completed: false },
    { id: 5, text: 'Comb/brush hair', completed: false },
  ]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const tasksCompleted = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (taskId) => {
    // Only allow completing the current task
    if (taskId !== tasks[currentTaskIndex].id) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true } 
        : task
    );
    
    const allTasksCompleted = updatedTasks.every(task => task.completed);
    
    if (allTasksCompleted) {
      setBadgeUnlocked(true);
    }
    
    setTasks(updatedTasks);
    
    // Move to next task if available and not all tasks are completed
    if (currentTaskIndex < tasks.length - 1 && !allTasksCompleted) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  if (!gameStarted) {
    return (
      <GameShell
        title="Clean Girl Badge"
        subtitle="Loading..."
        backPath="/games/health-female/kids"
      
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-white">Preparing your badge challenge...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Clean Girl Badge"
      subtitle={badgeUnlocked ? "Badge Unlocked!" : "Complete 5 Hygiene Tasks"}
      onNext={handleNext}
      nextEnabled={badgeUnlocked}
      nextButtonText="Back to Games"
      showGameOver={badgeUnlocked}
      score={badgeUnlocked ? 1 : 0}
      gameId="health-female-kids-10"
      gameType="health-female"
      totalLevels={10}
      currentLevel={10}
      showConfetti={badgeUnlocked}
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        {!badgeUnlocked ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🧼✨</div>
              <h2 className="text-2xl font-bold text-white mb-2">Become a Clean Girl!</h2>
              <p className="text-white/80">Complete {tasksCompleted} of {totalTasks} tasks to earn your badge</p>
              
              <div className="w-full bg-gray-700/50 rounded-full h-4 mt-4">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(tasksCompleted / totalTasks) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center ${
                    task.completed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                    task.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-white/30'
                  }`}>
                    {task.completed && <span className="text-white">✓</span>}
                  </div>
                  <span className={task.completed ? 'text-white' : 'text-white/80'}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
              <p className="text-blue-300 text-sm">
                💡 Complete all tasks to earn your special "Clean Girl" badge!
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-8 rounded-2xl border border-pink-500/30 mb-8">
              <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-full mb-6">
                <span className="text-6xl">👑</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
              <p className="text-white/90 mb-6">You've earned the</p>
              <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-6 rounded-full text-xl mb-6">
                Clean Girl Badge
              </div>
              <p className="text-white/80 max-w-md mx-auto">
                You've shown excellent hygiene habits! Keep up the great work in staying clean and healthy!
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
              >
                Start Over
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
              >
                Back to Games
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CleanGirlBadge;
