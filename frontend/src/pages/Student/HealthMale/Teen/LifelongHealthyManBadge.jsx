import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LifelongHealthyManBadge = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, text: "Master personal hygiene routines", emoji: "🧼", completed: false },
    { id: 2, text: "Build healthy eating and exercise habits", emoji: "🥗", completed: false },
    { id: 3, text: "Develop emotional intelligence and resilience", emoji: "🧠", completed: false },
    { id: 4, text: "Practice responsible decision making", emoji: "⚖️", completed: false },
    { id: 5, text: "Commit to lifelong learning and growth", emoji: "📈", completed: false }
  ];

  const handleTaskComplete = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prev => [...prev, taskId]);
      showCorrectAnswerFeedback(2, true);
    }
  };

  useEffect(() => {
    if (completedTasks.length === tasks.length && !gameFinished) {
      setGameFinished(true);
    }
  }, [completedTasks, gameFinished]);

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  return (
    <GameShell
      title="Badge: Lifelong Healthy Man"
      subtitle={`Complete ${completedTasks.length} of ${tasks.length} healthy habit challenges`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedTasks.length * 2}
      gameId="health-male-teen-100"
      gameType="health-male"
      totalLevels={100}
      currentLevel={100}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Lifelong Healthy Challenge</h3>
            <p className="text-white/90">
              Complete all healthy habit challenges to earn your badge.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);

              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskComplete(task.id)}
                  disabled={isCompleted}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isCompleted
                      ? 'bg-green-100/20 border-green-500 text-white'
                      : 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-3xl mr-4 ${isCompleted ? 'opacity-100' : 'opacity-60'}`}>
                        {task.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                          {isCompleted ? '✅ ' : '☐ '}{task.text}
                        </h3>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="text-2xl">🎉</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-2">Lifelong Healthy Man Badge Earned!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Congratulations! You've completed all healthy habit challenges and earned the Lifelong Healthy Man Badge!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">LIFELONG HEALTHY MAN</div>
                </div>
                <p className="text-white/80">
                  You completed all 5 healthy habit challenges perfectly! You're committed to lifelong health and wellness! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default LifelongHealthyManBadge;
