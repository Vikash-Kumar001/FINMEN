import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeBudgetKid = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();

  const [currentStep, setCurrentStep] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState({ name: "", amount: "", category: "" });
  const [showBadge, setShowBadge] = useState(false);

  const categories = [
    { name: "Food", emoji: "🍽️" },
    { name: "School", emoji: "📚" },
    { name: "Fun", emoji: "🎮" },
    { name: "Savings", emoji: "💰" },
    { name: "Transport", emoji: "🚌" },
  ];

  const handleInputChange = (field, value) => {
    setCurrentBudget({ ...currentBudget, [field]: value });
  };

  const addBudget = () => {
    if (currentBudget.name && currentBudget.amount && currentBudget.category) {
      setBudgets([...budgets, currentBudget]);
      setCurrentBudget({ name: "", amount: "", category: "" });
      setCurrentStep(currentStep + 1);
      
      if (budgets.length + 1 === 3) {
        setTimeout(() => {
          setShowBadge(true);
          showCorrectAnswerFeedback(5, true);
        }, 500);
      }
    } else {
      alert("Please fill all fields!");
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Badge: Budget Kid"
      subtitle="Create 3 small budgets to earn your badge!"
      coins={0}
      currentLevel={budgets.length + 1}
      totalLevels={3}
      onNext={showBadge ? handleFinish : null}
      nextEnabled={showBadge}
      nextLabel="Finish"
      showConfetti={showBadge}
      score={0}
      gameId="finance-kids-badge"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
        {!showBadge ? (
          <>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <h3 className="text-2xl font-bold mb-4">
                Create Budget {budgets.length + 1} of 3
              </h3>
              
              {budgets.length > 0 && (
                <div className="mb-6 bg-green-500/20 rounded-lg p-4 border border-green-500/50">
                  <p className="text-green-400 font-semibold">✅ {budgets.length} Budget(s) Created!</p>
                  {budgets.map((b, idx) => (
                    <div key={idx} className="text-sm text-white/80 mt-2">
                      {b.category} - {b.name}: ₹{b.amount}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 text-left max-w-xl mx-auto">
                <div>
                  <label className="block text-sm font-semibold mb-2">Budget Name</label>
                  <input
                    type="text"
                    value={currentBudget.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Weekly Snacks"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={currentBudget.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {categories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleInputChange("category", cat.name)}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          currentBudget.category === cat.name
                            ? "bg-blue-500 text-white scale-105"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <div className="text-2xl mb-1">{cat.emoji}</div>
                        <div className="text-xs">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={addBudget}
                disabled={!currentBudget.name || !currentBudget.amount || !currentBudget.category}
                className="w-full max-w-xl mx-auto block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full text-xl font-bold transition-transform hover:scale-105 mt-6"
              >
                {budgets.length < 2 ? "Add Budget" : "Complete & Get Badge!"}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🏆</div>
            <h3 className="text-3xl font-bold mb-4">Budget Kid Badge Unlocked!</h3>
            <p className="text-white/90 text-lg mb-6">
              Awesome! You created 3 budgets like a pro!
            </p>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6 border border-blue-500/50">
              <p className="font-semibold mb-3">Your Budgets:</p>
              {budgets.map((b, idx) => (
                <div key={idx} className="text-left text-white/90 mb-2 bg-white/5 p-3 rounded">
                  <span className="font-bold">{idx + 1}.</span> {b.category} - {b.name}: ₹{b.amount}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +5 Coins Bonus!
            </div>

            <p className="text-white/80">
              💡 Lesson: Planning budgets helps you manage money wisely!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeBudgetKid;