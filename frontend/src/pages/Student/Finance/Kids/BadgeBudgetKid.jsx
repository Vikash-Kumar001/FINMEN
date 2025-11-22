import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeBudgetKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState({ name: "", amount: "", category: "" });
  const [showBadge, setShowBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Calculate back path
  const resolvedBackPath = useMemo(() => {
    if (location.state?.returnPath) {
      return location.state.returnPath;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "student" && pathSegments.length >= 3) {
      const categoryKey = pathSegments[1];
      const ageKey = pathSegments[2];

      const categorySlugMap = {
        finance: "financial-literacy",
        "financial-literacy": "financial-literacy",
      };

      const ageSlugMap = {
        kid: "kids",
        kids: "kids",
      };

      const mappedCategory = categorySlugMap[categoryKey] || categoryKey;
      const mappedAge = ageSlugMap[ageKey] || ageKey;

      return `/games/${mappedCategory}/${mappedAge}`;
    }

    return "/games";
  }, [location.pathname, location.state]);

  const handleGameOverClose = () => {
    navigate(resolvedBackPath);
  };

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
      const newBudgets = [...budgets, currentBudget];
      setBudgets(newBudgets);
      setCurrentBudget({ name: "", amount: "", category: "" });
      
      // Update coins in real-time for each budget created
      setCoins(prevCoins => prevCoins + 1);
      showCorrectAnswerFeedback(1, true);
      
      if (newBudgets.length === 3) {
        setTimeout(() => {
          setShowBadge(true);
        }, 500);
      }
    }
  };

  const handleNext = () => {
    navigate(resolvedBackPath);
  };

  const handleTryAgain = () => {
    setCurrentStep(0);
    setBudgets([]);
    setCurrentBudget({ name: "", amount: "", category: "" });
    setShowBadge(false);
    setCoins(0);
    resetFeedback();
  };

  const canAddBudget = currentBudget.name && currentBudget.amount && currentBudget.category;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 flex flex-col relative overflow-hidden">
      {/* Floating Budget Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-lg sm:text-2xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['📊', '💰', '📋', '🎯', '🏆', '✨'][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-yellow-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-yellow-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-yellow-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🏅</span>
            <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Badge: Budget Kid</span>
              <span className="xs:hidden">Budget Kid</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-yellow-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🏅</span>
            <span className="text-yellow-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showBadge ? (
          <div className="w-full max-w-4xl space-y-3 sm:space-y-4">
            {/* Progress Indicator */}
            <div className="mb-2 sm:mb-3">
              <p className="text-gray-700 text-xs sm:text-sm font-medium mb-2">
                Create Budget {budgets.length + 1} of 3
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${
                      num === budgets.length + 1
                        ? 'bg-yellow-500 w-6 sm:w-8'
                        : num < budgets.length + 1
                        ? 'bg-yellow-300'
                        : 'bg-yellow-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Budget Creation Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-yellow-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">📊</div>
              
              {budgets.length > 0 && (
                <div className="mb-4 sm:mb-6 bg-green-50 border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <p className="text-green-700 font-semibold text-xs sm:text-sm mb-2">✅ {budgets.length} Budget(s) Created!</p>
                  <div className="space-y-1">
                    {budgets.map((b, idx) => (
                      <div key={idx} className="text-sm text-gray-700 text-left bg-white/50 p-2 rounded">
                        <span className="font-bold">{idx + 1}.</span> {b.category} {b.emoji} - {b.name}: ₹{b.amount}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4 text-left max-w-xl mx-auto">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2 text-gray-700">Budget Name</label>
                  <input
                    type="text"
                    value={currentBudget.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Weekly Snacks"
                    className="w-full bg-white border-2 border-yellow-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2 text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    value={currentBudget.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-white border-2 border-yellow-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2 text-gray-700">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {categories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleInputChange("category", cat.name)}
                        className={`py-2 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                          currentBudget.category === cat.name
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white scale-105 shadow-lg"
                            : "bg-yellow-50 border-2 border-yellow-200 text-gray-700 hover:bg-yellow-100"
                        }`}
                      >
                        <div className="text-xl sm:text-2xl mb-1">{cat.emoji}</div>
                        <div>{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={addBudget}
                disabled={!canAddBudget}
                className={`w-full max-w-xl mx-auto mt-4 sm:mt-6 block py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base md:text-lg font-bold transition-all ${
                  canAddBudget
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {budgets.length < 2 ? "Add Budget" : "Complete & Get Badge!"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Badge Unlocked Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-yellow-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 animate-bounce">🏆</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Budget Kid Badge Unlocked!</h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                Awesome! You created 3 budgets like a pro!
              </p>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="font-semibold mb-2 sm:mb-3 text-gray-700 text-sm sm:text-base">Your Budgets:</p>
                <div className="space-y-2">
                  {budgets.map((b, idx) => {
                    const categoryData = categories.find(c => c.name === b.category);
                    return (
                      <div key={idx} className="text-left text-gray-700 bg-white/70 p-2 sm:p-3 rounded text-xs sm:text-sm">
                        <span className="font-bold">{idx + 1}.</span> {categoryData?.emoji} {b.category} - {b.name}: ₹{b.amount}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                💡 Lesson: Planning budgets helps you manage money wisely!
              </p>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
              >
                <span className="hidden sm:inline">Continue to Next Level</span>
                <span className="sm:hidden">Next Level</span> →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confetti and Score Flash */}
      {showAnswerConfetti && <Confetti duration={2000} />}
      {flashPoints > 0 && <ScoreFlash points={flashPoints} />}

      {/* Game Over Modal */}
      {showBadge && (
        <GameOverModal
          score={5}
          gameId="finance-kids-30"
          gameType="finance"
          totalLevels={1}
          coinsPerLevel={5}
          isReplay={location?.state?.isReplay || false}
          onClose={handleGameOverClose}
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default BadgeBudgetKid;
