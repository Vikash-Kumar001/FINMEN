import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MorningRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [routines, setRoutines] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      tasks: ["Brush teeth", "Pack bag", "Eat breakfast"],
      correctOrder: ["Brush teeth", "Eat breakfast", "Pack bag"]
    },
    {
      id: 2,
      tasks: ["Wake up", "Dress", "Comb hair"],
      correctOrder: ["Wake up", "Dress", "Comb hair"]
    },
    {
      id: 3,
      tasks: ["Wash face", "Put shoes", "Say bye"],
      correctOrder: ["Wash face", "Put shoes", "Say bye"]
    },
    {
      id: 4,
      tasks: ["Make bed", "Check time", "Go school"],
      correctOrder: ["Make bed", "Check time", "Go school"]
    },
    {
      id: 5,
      tasks: ["Exercise", "Drink water", "Plan day"],
      correctOrder: ["Exercise", "Drink water", "Plan day"]
    }
  ];

  const handleTaskClick = (task) => {
    // Add task to user order if not already selected
    if (!userOrder.includes(task)) {
      setUserOrder([...userOrder, task]);
    }
  };

  const handleRemoveTask = (task) => {
    // Remove task from user order
    setUserOrder(userOrder.filter(t => t !== task));
  };

  const handleRoutine = () => {
    const newRoutines = [...routines, userOrder];
    setRoutines(newRoutines);

    const isCorrect = userOrder.join(',') === questions[currentLevel].correctOrder.join(',');
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setUserOrder([]); // Reset user order for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctRoutines = newRoutines.filter((uo, idx) => uo.join(',') === questions[idx].correctOrder.join(',')).length;
      setFinalScore(correctRoutines);
      if (correctRoutines >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setRoutines([]);
    setCoins(0);
    setFinalScore(0);
    setUserOrder([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Morning Routine"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-91"
      gameType="uvls"
      totalLevels={100}
      currentLevel={91}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Build morning routine!</p>
              
              {/* Display user's current selection order */}
              <div className="mb-4 min-h-[40px]">
                <p className="text-white/80 mb-2">Your routine:</p>
                <div className="flex flex-wrap gap-2">
                  {userOrder.map((task, index) => (
                    <div 
                      key={`${task}-${index}`} 
                      className="bg-green-500 p-2 rounded flex items-center cursor-pointer"
                      onClick={() => handleRemoveTask(task)}
                    >
                      {index + 1}. {task} ❌
                    </div>
                  ))}
                  {userOrder.length === 0 && (
                    <p className="text-white/50 italic">Click on tasks below to add them to your routine</p>
                  )}
                </div>
              </div>
              
              {/* Available tasks to select */}
              <div className="flex flex-wrap gap-4 mb-4">
                {getCurrentLevel().tasks
                  .filter(task => !userOrder.includes(task))
                  .map(task => (
                    <div 
                      key={task} 
                      className="bg-blue-500 p-2 rounded cursor-pointer hover:bg-blue-600 transition"
                      onClick={() => handleTaskClick(task)}
                    >
                      {task} ⏰
                    </div>
                  ))}
              </div>
              
              <button 
                onClick={handleRoutine} 
                className="mt-4 bg-purple-500 text-white p-2 rounded disabled:opacity-50"
                disabled={userOrder.length !== getCurrentLevel().tasks.length}
              >
                Submit Routine
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Routine Builder!" : "💪 Build Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You built correctly {finalScore} routines!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
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

export default MorningRoutine;