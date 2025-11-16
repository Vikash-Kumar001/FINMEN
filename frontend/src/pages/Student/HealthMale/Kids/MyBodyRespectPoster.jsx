import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MyBodyRespectPoster = () => {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, text: "Draw a person with a shield around their body", emoji: "🛡️", completed: false },
    { id: 2, text: "Write 'My Body, My Rules'", emoji: "✍️", completed: false },
    { id: 3, text: "Add respect symbols like hearts and hands", emoji: "💖", completed: false },
    { id: 4, text: "Show private areas covered with clothes", emoji: "👕", completed: false },
    { id: 5, text: "Write 'Every part deserves respect'", emoji: "📝", completed: false }
  ];

  const handleTaskComplete = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prev => [...prev, taskId]);
      showCorrectAnswerFeedback(3, true); // Give 3 coins per creative task
    }
  };

  React.useEffect(() => {
    if (completedTasks.length === tasks.length && !gameFinished) {
      setGameFinished(true);
    }
  }, [completedTasks, gameFinished]);

  const handleNext = () => {
    navigate("/student/health-male/kids/learning-body-journal");
  };

  return (
    <GameShell
      title="My Body, My Respect Poster"
      subtitle={`Complete ${completedTasks.length} of ${tasks.length} poster tasks`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={completedTasks.length * 3}
      gameId="health-male-kids-36"
      gameType="health-male"
      totalLevels={40}
      currentLevel={36}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Design Your Body Respect Poster</h3>
            <p className="text-white/90">
              Create a poster showing kids that every part of their body deserves respect! Complete all 5 design tasks.
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
                <div className="text-8xl mb-4">🎨</div>
                <h3 className="text-3xl font-bold text-white mb-2">Poster Complete!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Excellent work! Your body respect poster will help other kids understand that all bodies deserve respect!
                </p>
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">BODY RESPECT ARTIST</div>
                </div>
                <p className="text-white/80">
                  You completed all 5 poster design tasks perfectly! Your artwork promotes body respect and privacy! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default MyBodyRespectPoster;
