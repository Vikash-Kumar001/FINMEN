import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationDigitalSpend = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-48");
  const gameId = gameData?.id || "finance-teens-48";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationDigitalSpend, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [spent, setSpent] = useState(0);

  const scenarios = [
    {
      id: 1,
      title: "Digital Spending Budget",
      description: "You have ₹1000 in your digital wallet. Pay ₹200 for food, ₹300 for a book. What's the balance left?",
      total: 1000,
      expenses: [
        { name: "Food", amount: 200, emoji: "🍔" },
        { name: "Book", amount: 300, emoji: "📚" }
      ],
      correctBalance: 500
    },
    {
      id: 2,
      title: "Online Shopping Budget",
      description: "You have ₹1500. Pay ₹400 for clothes, ₹200 for transport. What's the balance left?",
      total: 1500,
      expenses: [
        { name: "Clothes", amount: 400, emoji: "👕" },
        { name: "Transport", amount: 200, emoji: "🚌" }
      ],
      correctBalance: 900
    },
    {
      id: 3,
      title: "Monthly Digital Budget",
      description: "You have ₹2000. Pay ₹500 for groceries, ₹300 for entertainment, ₹200 for savings. What's the balance?",
      total: 2000,
      expenses: [
        { name: "Groceries", amount: 500, emoji: "🛒" },
        { name: "Entertainment", amount: 300, emoji: "🎬" },
        { name: "Savings", amount: 200, emoji: "💰" }
      ],
      correctBalance: 1000
    },
    {
      id: 4,
      title: "Weekend Spending",
      description: "You have ₹800. Pay ₹150 for food, ₹100 for movie, ₹50 for snacks. What's the balance?",
      total: 800,
      expenses: [
        { name: "Food", amount: 150, emoji: "🍔" },
        { name: "Movie", amount: 100, emoji: "🎬" },
        { name: "Snacks", amount: 50, emoji: "🍿" }
      ],
      correctBalance: 500
    },
    {
      id: 5,
      title: "School Expenses Budget",
      description: "You have ₹1200. Pay ₹400 for books, ₹200 for supplies, ₹100 for lunch. What's the balance?",
      total: 1200,
      expenses: [
        { name: "Books", amount: 400, emoji: "📚" },
        { name: "Supplies", amount: 200, emoji: "✏️" },
        { name: "Lunch", amount: 100, emoji: "🍱" }
      ],
      correctBalance: 500
    }
  ];

  const handleSpendChange = (value) => {
    const numValue = parseInt(value) || 0;
    setSpent(numValue);
  };

  const handleSubmit = () => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const current = scenarios[currentScenario];
    const totalExpenses = current.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const calculatedBalance = current.total - totalExpenses;
    const isCorrect = spent === calculatedBalance && spent === current.correctBalance;

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
        setSpent(0);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    setSpent(0);
    resetFeedback();
  };

  const current = scenarios[currentScenario];
  const totalExpenses = current.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const calculatedBalance = current.total - totalExpenses;

  return (
    <GameShell
      title="Simulation: Digital Spend"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
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
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Starting Balance:</span>
                    <span className="text-green-400 font-bold">₹{current.total}</span>
                  </div>
                  {current.expenses.map((expense, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{expense.emoji}</span>
                        <span className="text-white">{expense.name}:</span>
                      </div>
                      <span className="text-red-400 font-semibold">-₹{expense.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-white/20">
                    <span className="text-white font-semibold">Total Expenses:</span>
                    <span className="text-red-400 font-bold">₹{totalExpenses}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <label className="block text-white font-semibold mb-3">
                  What's the balance left after these expenses?
                </label>
                <input
                  type="number"
                  min="0"
                  max={current.total}
                  value={spent || ""}
                  onChange={(e) => handleSpendChange(e.target.value)}
                  disabled={answered}
                  placeholder="Enter balance"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-white/60 text-sm mt-2">
                  Hint: Balance = Starting Amount - Total Expenses
                </p>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={answered || spent === 0}
                className={`w-full px-6 py-3 rounded-full font-bold text-base transition-all ${
                  answered || spent === 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                }`}
              >
                Submit Answer
              </button>
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
                  You're mastering digital spending calculations!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always track your digital spending and calculate remaining balance to stay within budget!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember: Balance = Starting Amount - Total Expenses!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Add up all expenses first, then subtract from your starting balance to find the remaining amount!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationDigitalSpend;
