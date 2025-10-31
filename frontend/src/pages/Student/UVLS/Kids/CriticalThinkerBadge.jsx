import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CriticalThinkerBadge = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState([]); // State for tracking selected tasks
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      tasks: ["Healthy choice", "Safe decision", "Honest act"]
    },
    {
      id: 2,
      tasks: ["Solve puzzle", "Spot false", "Journal reason"]
    },
    {
      id: 3,
      tasks: ["Cause effect", "Logic sequence", "Ethics choice"]
    },
    {
      id: 4,
      tasks: ["Risk avoid", "True false", "Poster steps"]
    },
    {
      id: 5,
      tasks: ["Think critically", "Decide wisely", "Badge earned"]
    }
  ];

  // Function to toggle task selection
  const toggleTaskSelection = (task) => {
    setSelectedTasks(prev => {
      if (prev.includes(task)) {
        return prev.filter(t => t !== task);
      } else {
        return [...prev, task];
      }
    });
  };

  const handleTask = () => {
    const newTasks = [...tasks, selectedTasks];
    setTasks(newTasks);

    const isComplete = selectedTasks.length >= 2;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedTasks([]); // Reset selection for next level
      }, isComplete ? 800 : 0);
    } else {
      const completeLevels = newTasks.filter(sel => sel.length >= 2).length;
      setFinalScore(completeLevels);
      if (completeLevels >= 3) {
        setCoins(5); // Achievement
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setTasks([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedTasks([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Critical Thinker Badge"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-60"
      gameType="uvls"
      totalLevels={70}
      currentLevel={60}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Complete decision tasks!</p>
              <div className="space-y-3">
                {getCurrentLevel().tasks.map(task => (
                  <button 
                    key={task} 
                    onClick={() => toggleTaskSelection(task)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedTasks.includes(task)
                        ? "bg-green-500/30 border-2 border-green-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedTasks.includes(task) ? "✅" : "🤔"}
                    </div>
                    <div className="text-white font-medium text-left">{task}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleTask} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedTasks.length === 0} // Disable if no tasks selected
              >
                Submit ({selectedTasks.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Thinker Achieved!" : "💪 More Tasks!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed tasks in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned the Badge! 🏆" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CriticalThinkerBadge;