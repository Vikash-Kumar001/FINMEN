import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationLoanRepayment = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-58");
  const gameId = gameData?.id || "finance-teens-58";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationLoanRepayment, using fallback ID");
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
  const [months, setMonths] = useState(0);

  const scenarios = [
    {
      id: 1,
      title: "Loan Repayment Calculation",
      description: "You borrow ₹1000. You repay ₹200 per month. How many months will it take to fully repay?",
      loanAmount: 1000,
      monthlyPayment: 200,
      correctMonths: 5
    },
    {
      id: 2,
      title: "Education Loan Repayment",
      description: "You borrow ₹2000 for education. You repay ₹400 per month. How many months to repay?",
      loanAmount: 2000,
      monthlyPayment: 400,
      correctMonths: 5
    },
    {
      id: 3,
      title: "Phone Loan Repayment",
      description: "You borrow ₹1500 for a phone. You repay ₹300 per month. How many months needed?",
      loanAmount: 1500,
      monthlyPayment: 300,
      correctMonths: 5
    },
    {
      id: 4,
      title: "Bike Loan Repayment",
      description: "You borrow ₹3000 for a bike. You repay ₹500 per month. How many months to clear?",
      loanAmount: 3000,
      monthlyPayment: 500,
      correctMonths: 6
    },
    {
      id: 5,
      title: "Emergency Loan Repayment",
      description: "You borrow ₹1200 for emergency. You repay ₹200 per month. How many months required?",
      loanAmount: 1200,
      monthlyPayment: 200,
      correctMonths: 6
    }
  ];

  const handleMonthsChange = (value) => {
    const numValue = parseInt(value) || 0;
    setMonths(numValue);
  };

  const handleSubmit = () => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const current = scenarios[currentScenario];
    const isCorrect = months === current.correctMonths;

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
        setMonths(0);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    setMonths(0);
    resetFeedback();
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Loan Repayment"
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
                    <span className="text-white font-semibold">Loan Amount:</span>
                    <span className="text-red-400 font-bold">₹{current.loanAmount}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-3">
                    <span className="text-white font-semibold">Monthly Payment:</span>
                    <span className="text-green-400 font-bold">₹{current.monthlyPayment}/month</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <label className="block text-white font-semibold mb-3">
                  How many months will it take to fully repay the loan?
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={months || ""}
                  onChange={(e) => handleMonthsChange(e.target.value)}
                  disabled={answered}
                  placeholder="Enter number of months"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-white/60 text-sm mt-2">
                  Hint: Months = Loan Amount ÷ Monthly Payment
                </p>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={answered || months === 0}
                className={`w-full px-6 py-3 rounded-full font-bold text-base transition-all ${
                  answered || months === 0
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
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Calculation!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You're mastering loan repayment calculations!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always calculate how long it will take to repay a loan before borrowing. Months = Loan Amount ÷ Monthly Payment!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember: Months = Loan Amount ÷ Monthly Payment!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Divide the loan amount by the monthly payment to find how many months it will take to repay!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationLoanRepayment;
