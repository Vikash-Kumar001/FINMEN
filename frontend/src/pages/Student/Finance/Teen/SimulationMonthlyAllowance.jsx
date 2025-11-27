import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMonthlyAllowance = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-28");
  const gameId = gameData?.id || "finance-teens-28";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [allocations, setAllocations] = useState({
    food: 0,
    transport: 0,
    save: 0,
    fun: 0
  });

  const scenarios = [
    {
      id: 1,
      title: "Monthly Allowance Budget",
      description: "You receive ₹1000 as monthly allowance. Allocate it wisely:",
      correctAllocation: { food: 400, transport: 300, save: 200, fun: 100 },
      total: 1000
    },
    {
      id: 2,
      title: "Part-time Job Earnings",
      description: "You earn ₹1500 from a part-time job. Plan your budget:",
      correctAllocation: { food: 500, transport: 400, save: 400, fun: 200 },
      total: 1500
    },
    {
      id: 3,
      title: "Scholarship Money",
      description: "You receive ₹2000 as scholarship. Allocate it smartly:",
      correctAllocation: { food: 600, transport: 500, save: 600, fun: 300 },
      total: 2000
    },
    {
      id: 4,
      title: "Birthday Gift Money",
      description: "You get ₹800 as birthday gift. Budget it carefully:",
      correctAllocation: { food: 300, transport: 200, save: 200, fun: 100 },
      total: 800
    },
    {
      id: 5,
      title: "Summer Job Income",
      description: "You earn ₹2500 from summer job. Create a balanced budget:",
      correctAllocation: { food: 800, transport: 600, save: 800, fun: 300 },
      total: 2500
    }
  ];

  const handleAllocationChange = (category, value) => {
    const numValue = parseInt(value) || 0;
    setAllocations(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleSubmit = () => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const current = scenarios[currentScenario];
    const totalAllocated = allocations.food + allocations.transport + allocations.save + allocations.fun;
    const isCorrect = 
      totalAllocated === current.total &&
      allocations.food === current.correctAllocation.food &&
      allocations.transport === current.correctAllocation.transport &&
      allocations.save === current.correctAllocation.save &&
      allocations.fun === current.correctAllocation.fun;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAllocations({ food: 0, transport: 0, save: 0, fun: 0 });
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    setAllocations({ food: 0, transport: 0, save: 0, fun: 0 });
    resetFeedback();
  };

  const current = scenarios[currentScenario];
  const totalAllocated = allocations.food + allocations.transport + allocations.save + allocations.fun;
  const remaining = current.total - totalAllocated;

  return (
    <GameShell
      title="Simulation: Monthly Allowance"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}: Allocate ₹${current.total}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <span className="text-2xl">🍔</span> Food
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={current.total}
                    value={allocations.food || ""}
                    onChange={(e) => handleAllocationChange("food", e.target.value)}
                    disabled={answered}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  />
                  <p className="text-white/60 text-sm mt-2">Recommended: ₹{current.correctAllocation.food}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <span className="text-2xl">🚌</span> Transport
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={current.total}
                    value={allocations.transport || ""}
                    onChange={(e) => handleAllocationChange("transport", e.target.value)}
                    disabled={answered}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <p className="text-white/60 text-sm mt-2">Recommended: ₹{current.correctAllocation.transport}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-yellow-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <span className="text-2xl">💰</span> Savings
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={current.total}
                    value={allocations.save || ""}
                    onChange={(e) => handleAllocationChange("save", e.target.value)}
                    disabled={answered}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  />
                  <p className="text-white/60 text-sm mt-2">Recommended: ₹{current.correctAllocation.save}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-pink-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <span className="text-2xl">🎉</span> Fun/Entertainment
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={current.total}
                    value={allocations.fun || ""}
                    onChange={(e) => handleAllocationChange("fun", e.target.value)}
                    disabled={answered}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
                  />
                  <p className="text-white/60 text-sm mt-2">Recommended: ₹{current.correctAllocation.fun}</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Allocated:</span>
                  <span className={`text-lg font-bold ${remaining === 0 ? "text-green-400" : remaining > 0 ? "text-yellow-400" : "text-red-400"}`}>
                    ₹{totalAllocated} / ₹{current.total}
                  </span>
                </div>
                {remaining !== 0 && (
                  <p className={`text-sm mt-2 ${remaining > 0 ? "text-yellow-400" : "text-red-400"}`}>
                    {remaining > 0 ? `Remaining: ₹${remaining}` : `Over budget by: ₹${Math.abs(remaining)}`}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={answered || totalAllocated !== current.total}
                className={`w-full px-6 py-3 rounded-full font-bold text-base transition-all ${
                  answered || totalAllocated !== current.total
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                }`}
              >
                Submit Budget
              </button>
              
              <p className="text-white/60 text-sm mt-4 text-center">
                Hint: A balanced budget allocates approximately 40% for food, 30% for transport, 20% for savings, and 10% for fun.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Budgeting!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You're mastering the art of balanced budgeting!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: A balanced budget prioritizes needs (food, transport) while saving for the future and allowing some fun!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember the balanced budget formula: 40% food, 30% transport, 20% savings, 10% fun!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Allocate money to cover essential needs first, then save, and finally allow some fun money.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMonthlyAllowance;