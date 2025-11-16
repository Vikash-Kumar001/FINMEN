import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionProGirlBadge = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, text: "Master balanced diet principles", emoji: "🥗", completed: false },
    { id: 2, text: "Understand nutrient functions", emoji: "🧬", completed: false },
    { id: 3, text: "Practice healthy food choices", emoji: "🍎", completed: false },
    { id: 4, text: "Learn sports nutrition", emoji: "🏃", completed: false },
    { id: 5, text: "Build nutrition confidence", emoji: "💪", completed: false }
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
    navigate("/games/health-female/teens");
  };

  return (
    <GameShell
      title="Badge: Nutrition Pro Girl"
      subtitle={`Complete ${completedTasks.length} of ${tasks.length} nutrition scenarios`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedTasks.length * 2}
      gameId="health-female-teen-20"
      gameType="health-female"
      totalLevels={20}
      currentLevel={20}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nutrition Pro Challenge</h3>
            <p className="text-white/90">
              Complete 5 smart nutrition scenarios to earn your Nutrition Pro Girl Badge!
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
                <h3 className="text-3xl font-bold text-white mb-2">Nutrition Pro Girl Badge Earned!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Congratulations! You've mastered all teen nutrition skills and earned the Nutrition Pro Girl Badge!
                </p>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">NUTRITION PRO GIRL</div>
                </div>
                <p className="text-white/80">
                  You completed all 5 nutrition scenarios perfectly! You're ready for healthy teen years! 🥗
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default NutritionProGirlBadge;