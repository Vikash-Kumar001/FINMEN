import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PlanYourDayPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-94";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [plans, setPlans] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      tasks: ["Study", "Play", "Eat"],
      correctOrder: ["Eat", "Study", "Play"]
    },
    {
      id: 2,
      tasks: ["Chore", "Friend time", "Rest"],
      correctOrder: ["Chore", "Friend time", "Rest"]
    },
    {
      id: 3,
      tasks: ["Exercise", "Homework", "Fun"],
      correctOrder: ["Exercise", "Homework", "Fun"]
    },
    {
      id: 4,
      tasks: ["Read", "Help home", "Sleep prep"],
      correctOrder: ["Help home", "Read", "Sleep prep"]
    },
    {
      id: 5,
      tasks: ["Breakfast", "School work", "Hobby"],
      correctOrder: ["Breakfast", "School work", "Hobby"]
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

  const handlePlan = () => {
    const newPlans = [...plans, userOrder];
    setPlans(newPlans);

    const isCorrect = userOrder.join(',') === questions[currentLevel].correctOrder.join(',');
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setUserOrder([]); // Reset user order for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctPlans = newPlans.filter((uo, idx) => uo.join(',') === questions[idx].correctOrder.join(',')).length;
      setFinalScore(correctPlans);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPlans([]);
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
      title="Plan Your Day Puzzle"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-94"
      gameType="uvls"
      totalLevels={100}
      currentLevel={94}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Order tasks for day!</p>
              
              {/* Display user's current selection order */}
              <div className="mb-4 min-h-[40px]">
                <p className="text-white/80 mb-2">Your plan:</p>
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
                    <p className="text-white/50 italic">Click on tasks below to add them to your plan</p>
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
                      {task} 📅
                    </div>
                  ))}
              </div>
              
              <button 
                onClick={handlePlan} 
                className="mt-4 bg-purple-500 text-white p-2 rounded disabled:opacity-50"
                disabled={userOrder.length !== getCurrentLevel().tasks.length}
              >
                Submit Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Day Planner!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You planned correctly {finalScore} out of {questions.length} times!
                  You know how to organize your day!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Planning your day helps you get things done and have time for fun too!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Plan Better!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You planned correctly {finalScore} out of {questions.length} times.
                  Keep practicing to plan your day better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Plan your day by putting important tasks first, then fun activities!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlanYourDayPuzzle;