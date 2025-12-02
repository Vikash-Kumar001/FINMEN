import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TimeBudgetSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-98";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [allocations, setAllocations] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeAllocations, setTimeAllocations] = useState({});
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      time: "2 hours.",
      activities: ["Study", "Fun", "Sleep prep"],
      text: "Allocate time balanced."
    },
    {
      id: 2,
      time: "3 hours.",
      activities: ["Homework", "Play", "Chore"],
      text: "Balance afternoon."
    },
    {
      id: 3,
      time: "1 hour.",
      activities: ["Read", "Exercise", "Rest"],
      text: "Evening plan."
    },
    {
      id: 4,
      time: "4 hours.",
      activities: ["Family", "Hobby", "Study", "Fun"],
      text: "Weekend slot."
    },
    {
      id: 5,
      time: "2.5 hours.",
      activities: ["Help home", "Watch TV", "Prepare tomorrow"],
      text: "After school."
    }
  ];

  const handleTimeChange = (activity, value) => {
    setTimeAllocations(prev => ({
      ...prev,
      [activity]: parseFloat(value) || 0
    }));
  };

  const handleAllocation = () => {
    const newAllocations = [...allocations, timeAllocations];
    setAllocations(newAllocations);

    const isBalanced = checkBalance(timeAllocations);
    if (isBalanced) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setTimeAllocations({}); // Reset allocations for next level
      }, isBalanced ? 800 : 0);
    } else {
      const balancedAlloc = newAllocations.filter(ta => checkBalance(ta)).length;
      setFinalScore(balancedAlloc);
      setShowResult(true);
    }
  };

  const checkBalance = (alloc) => {
    const total = Object.values(alloc).reduce((sum, time) => sum + time, 0);
    const hasAllActivities = getCurrentLevel().activities.every(activity => alloc[activity] > 0);
    return hasAllActivities && total > 0;
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setAllocations([]);
    setCoins(0);
    setFinalScore(0);
    setTimeAllocations({});
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Time Budget Simulation"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-98"
      gameType="uvls"
      totalLevels={100}
      currentLevel={98}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">{getCurrentLevel().text} {getCurrentLevel().time}</p>
              <div className="space-y-4">
                {getCurrentLevel().activities.map(act => (
                  <div key={act} className="flex items-center justify-between bg-white/20 p-3 rounded">
                    <span className="text-white">{act} ⏰</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={timeAllocations[act] || ''}
                      onChange={(e) => handleTimeChange(act, e.target.value)}
                      className="w-20 p-2 rounded bg-white/30 text-white placeholder-white/50"
                      placeholder="Hours"
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={handleAllocation}
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Submit Allocation
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Time Balancer!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You balanced {finalScore} out of {questions.length} times!
                  You know how to manage your time well!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Balancing your time between study, play, and rest helps you stay healthy and happy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Balance Better!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You balanced {finalScore} out of {questions.length} times.
                  Keep practicing to balance your time better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Make sure to allocate time for all activities - study, play, rest, and chores!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TimeBudgetSimulation;