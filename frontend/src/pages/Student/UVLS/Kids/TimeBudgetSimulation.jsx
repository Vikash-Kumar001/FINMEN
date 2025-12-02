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
  const [allocations, setAllocations] = useState([]); // Array of { levelIndex, allocation }
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeAllocations, setTimeAllocations] = useState({});
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      totalMinutes: 120,
      activities: [
        { name: "Study", emoji: "📚" },
        { name: "Fun", emoji: "🎮" },
        { name: "Sleep prep", emoji: "😴" }
      ],
      scenario: "You have 2 hours (120 minutes) before bedtime. How will you spend your time?",
      instruction: "Divide all 120 minutes between the activities. Make sure to give time to each activity!"
    },
    {
      id: 2,
      totalMinutes: 180,
      activities: [
        { name: "Homework", emoji: "✏️" },
        { name: "Play", emoji: "⚽" },
        { name: "Chore", emoji: "🧹" }
      ],
      scenario: "You have 3 hours (180 minutes) in the afternoon. Plan your time wisely!",
      instruction: "Use all 180 minutes. Give time to homework, play, and chores!"
    },
    {
      id: 3,
      totalMinutes: 60,
      activities: [
        { name: "Read", emoji: "📖" },
        { name: "Exercise", emoji: "🏃" },
        { name: "Rest", emoji: "🧘" }
      ],
      scenario: "You have 1 hour (60 minutes) in the evening. What will you do?",
      instruction: "Allocate all 60 minutes. Balance reading, exercise, and rest!"
    },
    {
      id: 4,
      totalMinutes: 240,
      activities: [
        { name: "Family", emoji: "👨‍👩‍👧" },
        { name: "Hobby", emoji: "🎨" },
        { name: "Study", emoji: "📝" },
        { name: "Fun", emoji: "🎉" }
      ],
      scenario: "You have 4 hours (240 minutes) on the weekend. Plan your day!",
      instruction: "Use all 240 minutes. Include family time, hobbies, study, and fun!"
    },
    {
      id: 5,
      totalMinutes: 150,
      activities: [
        { name: "Help home", emoji: "🏠" },
        { name: "Watch TV", emoji: "📺" },
        { name: "Prepare tomorrow", emoji: "📋" }
      ],
      scenario: "You have 2.5 hours (150 minutes) after school. How will you use it?",
      instruction: "Allocate all 150 minutes. Balance helping at home, relaxing, and preparing for tomorrow!"
    }
  ];

  const handleTimeChange = (activity, value) => {
    const numValue = parseFloat(value) || 0;
    setTimeAllocations(prev => ({
      ...prev,
      [activity]: numValue
    }));
  };

  const getCurrentLevel = () => questions[currentLevel];
  
  const getTotalAllocated = () => {
    return Object.values(timeAllocations).reduce((sum, time) => sum + (parseFloat(time) || 0), 0);
  };

  const getRemainingTime = () => {
    const current = getCurrentLevel();
    return current.totalMinutes - getTotalAllocated();
  };

  const checkBalance = (alloc, levelIndex = null) => {
    // Use provided levelIndex or default to currentLevel
    const levelIdx = levelIndex !== null ? levelIndex : currentLevel;
    const level = questions[levelIdx];
    if (!level) return false;
    
    const total = Object.values(alloc).reduce((sum, time) => sum + (parseFloat(time) || 0), 0);
    const hasAllActivities = level.activities.every(activity => (alloc[activity.name] || 0) > 0);
    const totalMatches = Math.abs(total - level.totalMinutes) < 0.01; // Allow small floating point differences
    return hasAllActivities && totalMatches;
  };

  const getValidationMessage = () => {
    const current = getCurrentLevel();
    const total = getTotalAllocated();
    const remaining = getRemainingTime();
    const hasAllActivities = current.activities.every(activity => (timeAllocations[activity.name] || 0) > 0);

    if (total === 0) {
      return "Start allocating time to activities!";
    }
    if (!hasAllActivities) {
      return `Give at least some time to all ${current.activities.length} activities!`;
    }
    if (remaining > 0) {
      return `You still have ${remaining} minutes left to allocate!`;
    }
    if (remaining < 0) {
      return `You've allocated ${Math.abs(remaining)} minutes too many! Total should be ${current.totalMinutes} minutes.`;
    }
    return "Perfect! All time is allocated. Click Submit!";
  };

  const handleAllocation = () => {
    const isBalanced = checkBalance(timeAllocations, currentLevel);
    
    if (!isBalanced) {
      showCorrectAnswerFeedback(0, false);
      return;
    }

    // Store allocation with its level index for proper validation
    const newAllocations = [...allocations, { levelIndex: currentLevel, allocation: { ...timeAllocations } }];
    setAllocations(newAllocations);

    setCoins(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setTimeAllocations({}); // Reset allocations for next level
      }, 1000);
    } else {
      setTimeout(() => {
        // Calculate final score by validating each allocation against its own level
        const balancedCount = newAllocations.filter(({ levelIndex, allocation }) => 
          checkBalance(allocation, levelIndex)
        ).length;
        setFinalScore(balancedCount);
        setShowResult(true);
      }, 1000);
    }
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

  return (
    <GameShell
      title="Time Budget Simulation"
      score={coins}
      subtitle={!showResult ? `Question ${currentLevel + 1} of ${questions.length}` : "Simulation Complete!"}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      maxScore={questions.length}
      currentLevel={currentLevel + 1}
      totalLevels={questions.length}
      gameId="uvls-kids-98"
      gameType="uvls"
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {/* Scenario Description */}
              <div className="bg-blue-500/20 border-2 border-blue-400/50 rounded-lg p-4 mb-6">
                <p className="text-white text-lg font-semibold mb-2">{getCurrentLevel().scenario}</p>
                <p className="text-blue-200 text-sm">{getCurrentLevel().instruction}</p>
              </div>

              {/* Total Time Display */}
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-4 mb-6 text-center">
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-yellow-200 text-sm">Total Time Available</p>
                    <p className="text-yellow-300 text-3xl font-bold">{getCurrentLevel().totalMinutes} min</p>
                  </div>
                  <div className="text-white/50 text-2xl">→</div>
                  <div>
                    <p className="text-yellow-200 text-sm">Time Allocated</p>
                    <p className={`text-3xl font-bold ${getRemainingTime() === 0 ? 'text-green-400' : getRemainingTime() < 0 ? 'text-red-400' : 'text-yellow-300'}`}>
                      {getTotalAllocated()} min
                    </p>
                  </div>
                  <div className="text-white/50 text-2xl">→</div>
                  <div>
                    <p className="text-yellow-200 text-sm">Remaining</p>
                    <p className={`text-3xl font-bold ${getRemainingTime() === 0 ? 'text-green-400' : getRemainingTime() < 0 ? 'text-red-400' : 'text-yellow-300'}`}>
                      {getRemainingTime()} min
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Inputs */}
              <div className="space-y-3 mb-6">
                {getCurrentLevel().activities.map(activity => {
                  const allocated = timeAllocations[activity.name] || 0;
                  const percentage = getCurrentLevel().totalMinutes > 0 
                    ? ((allocated / getCurrentLevel().totalMinutes) * 100).toFixed(0) 
                    : 0;
                  
                  return (
                    <div key={activity.name} className="bg-white/10 border-2 border-white/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{activity.emoji}</span>
                          <span className="text-white font-semibold text-lg">{activity.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="0"
                            step="5"
                            max={getCurrentLevel().totalMinutes}
                            value={timeAllocations[activity.name] || ''}
                            onChange={(e) => handleTimeChange(activity.name, e.target.value)}
                            className="w-24 p-2 rounded bg-white/30 text-white placeholder-white/50 text-center font-semibold border-2 border-white/30 focus:border-blue-400 focus:outline-none"
                            placeholder="0"
                          />
                          <span className="text-white/70 text-sm w-12">min</span>
                          {allocated > 0 && (
                            <span className="text-blue-300 text-sm font-semibold w-12">
                              {percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                      {allocated > 0 && (
                        <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Validation Message */}
              <div className={`rounded-lg p-3 mb-4 ${
                getRemainingTime() === 0 && getCurrentLevel().activities.every(a => (timeAllocations[a.name] || 0) > 0)
                  ? 'bg-green-500/20 border-2 border-green-400'
                  : 'bg-orange-500/20 border-2 border-orange-400'
              }`}>
                <p className={`text-sm font-semibold ${
                  getRemainingTime() === 0 && getCurrentLevel().activities.every(a => (timeAllocations[a.name] || 0) > 0)
                    ? 'text-green-200'
                    : 'text-orange-200'
                }`}>
                  💡 {getValidationMessage()}
                </p>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleAllocation}
                disabled={!checkBalance(timeAllocations)}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                  checkBalance(timeAllocations)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg'
                    : 'bg-gray-500/50 cursor-not-allowed opacity-50'
                }`}
              >
                {checkBalance(timeAllocations) ? '✅ Submit Allocation' : 'Complete allocation to submit'}
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