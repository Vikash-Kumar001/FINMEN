import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Calculator, Calendar, Coins, TrendingUp, AlertCircle } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationLoanRepayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-118";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [months, setMonths] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [interestRate, setInterestRate] = useState(0);

  const stages = [
    { 
      id: 1, 
      amount: 1000, 
      monthly: 200, 
      correctMonths: 5,
      scenario: "You need a laptop for school. Total cost: ₹1000",
      purpose: "Education",
      interest: 0
    },
    { 
      id: 2, 
      amount: 1200, 
      monthly: 300, 
      correctMonths: 4,
      scenario: "Emergency medical expense for a family member",
      purpose: "Healthcare",
      interest: 5
    },
    { 
      id: 3, 
      amount: 800, 
      monthly: 200, 
      correctMonths: 4,
      scenario: "Starting a small business selling handmade crafts",
      purpose: "Entrepreneurship",
      interest: 8
    },
    { 
      id: 4, 
      amount: 1500, 
      monthly: 500, 
      correctMonths: 3,
      scenario: "Home repair after a storm damaged your family's house",
      purpose: "Housing",
      interest: 3
    },
    { 
      id: 5, 
      amount: 900, 
      monthly: 150, 
      correctMonths: 6,
      scenario: "Taking a professional certification course for your career",
      purpose: "Career Development",
      interest: 6
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      // Time's up, show correct answer
      handleTimeUp();
    }
  }, [timeLeft, showResult]);

  const handleTimeUp = () => {
    resetFeedback();
    const stage = stages[currentStage];
    setFeedbackMessage(`Time's up! Correct answer: ${stage.correctMonths} months`);
    setIsSuccess(false);
    
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        moveToNextStage();
      } else {
        finishGame();
      }
    }, 2000);
  };

  const moveToNextStage = () => {
    setCurrentStage(prev => prev + 1);
    setMonths("");
    setTimeLeft(30);
    setFeedbackMessage('');
    setInterestRate(stages[currentStage + 1].interest);
  };

  const finishGame = () => {
    setShowResult(true);
    setTimeLeft(0);
  };

  const handleSubmit = () => {
    if (!months) return;
    
    resetFeedback();
    const stage = stages[currentStage];
    const isCorrect = Number(months) === stage.correctMonths;
    
    if (isCorrect) {
      const points = 20 * multiplier;
      setScore(score + points);
      setTotalScore(totalScore + points);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Update multiplier based on streak
      if (newStreak >= 4) {
        setMultiplier(3);
      } else if (newStreak >= 2) {
        setMultiplier(2);
      }
      
      showCorrectAnswerFeedback(points, true);
      setFeedbackMessage(`Correct! +${points} points. Streak: ${newStreak}x`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage(`Incorrect. Correct answer: ${stage.correctMonths} months`);
      setIsSuccess(false);
    }
    
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        moveToNextStage();
      } else {
        finishGame();
      }
    }, 2500);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === '' || (Number(value) > 0 && Number(value) <= 24)) {
      setMonths(value);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/teen");

  // Calculate total interest for display
  const calculateTotalRepayment = (stage) => {
    const totalRepayment = stage.monthly * stage.correctMonths;
    const interest = totalRepayment - stage.amount;
    return { totalRepayment, interest };
  };

  return (
    <GameShell
      title="Loan Repayment Simulator"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={totalScore}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && totalScore>= 60}
      score={totalScore}
      gameId="finance-teens-118"
      gameType="simulation"
      totalScore={150} // Max possible score
    >
      <div className="text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Loan Repayment Challenge</h3>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-400">Streak: {streak}x</div>
                  {multiplier > 1 && (
                    <div className="text-sm font-semibold text-orange-400">Multiplier: {multiplier}x</div>
                  )}
                </div>
                <div className="bg-red-500/20 px-3 py-1 rounded-full">
                  <div className="text-lg font-bold text-red-400">{timeLeft}s</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-300" />
                <h4 className="font-bold text-blue-200">Scenario:</h4>
              </div>
              <p className="text-blue-100">{stages[currentStage].scenario}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-blue-400/30 px-2 py-1 rounded mr-2">
                  {stages[currentStage].purpose}
                </span>
                {stages[currentStage].interest > 0 && (
                  <span className="text-xs bg-purple-400/30 px-2 py-1 rounded">
                    Interest: {stages[currentStage].interest}%
                  </span>
                )}
              </div>
            </div>
            
            {feedbackMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                isSuccess ? 'bg-green-500/30 text-green-200 border border-green-400' : 'bg-red-500/30 text-red-200 border border-red-400'
              }`}>
                {feedbackMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-500/20 rounded-lg p-4 text-center">
                <Coins className="w-8 h-8 mx-auto text-indigo-300 mb-2" />
                <div className="text-2xl font-bold">₹{stages[currentStage].amount}</div>
                <div className="text-sm text-indigo-200">Loan Amount</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto text-green-300 mb-2" />
                <div className="text-2xl font-bold">₹{stages[currentStage].monthly}</div>
                <div className="text-sm text-green-200">Monthly Payment</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                <Calculator className="w-8 h-8 mx-auto text-yellow-300 mb-2" />
                <div className="text-2xl font-bold">{stages[currentStage].correctMonths}</div>
                <div className="text-sm text-yellow-200">Months to Repay</div>
              </div>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-purple-200 mb-2">Total Repayment Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Principal:</span>
                  <span className="font-bold">₹{stages[currentStage].amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest:</span>
                  <span className="font-bold">₹{calculateTotalRepayment(stages[currentStage]).interest}</span>
                </div>
                <div className="flex justify-between col-span-2 border-t border-purple-400/30 pt-2 mt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg">₹{calculateTotalRepayment(stages[currentStage]).totalRepayment}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label className="whitespace-nowrap text-white/90">Months to Repay:</label>
                <input
                  type="number"
                  value={months}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-24 bg-white/10 text-white border-white/30 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter months"
                  min="1"
                  max="24"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!months}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center ${
                  months 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white transform hover:scale-105' 
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Repayment
              </button>
            </div>
            
            <div className="mt-6 bg-gray-800/30 rounded-lg p-3">
              <p className="text-sm text-gray-300">
                <span className="font-bold">Tip:</span> Divide the loan amount by the monthly payment to find the number of months needed to repay.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h3 className="text-3xl font-bold mb-4">Loan Repayment Expert!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {totalScore} out of 150 points!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-4xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <p className="text-white/90">
                {totalScore >= 120 ? "🏆 Financial Math Master!" : 
                 totalScore >= 90 ? "🥇 Loan Calculation Pro!" : 
                 totalScore >= 60 ? "🥈 Smart Repayer!" : 
                 "🥉 Keep Practicing!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-500/20 rounded-lg p-3">
                <Coins className="mx-auto w-8 h-8 text-indigo-400 mb-2" />
                <div className="font-bold">{stages.length}</div>
                <div className="text-xs text-white/80">Scenarios</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3">
                <TrendingUp className="mx-auto w-8 h-8 text-green-400 mb-2" />
                <div className="font-bold">{streak}</div>
                <div className="text-xs text-white/80">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Calculator className="mx-auto w-8 h-8 text-purple-400 mb-2" />
                <div className="font-bold">{multiplier}x</div>
                <div className="text-xs text-white/80">Max Multiplier</div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-200 mb-2">Key Lesson:</h4>
              <p className="text-blue-100">
                Understanding loan repayment terms helps you make informed financial decisions and avoid debt traps.
              </p>
            </div>
            
            <button
              onClick={handleFinish}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Continue Financial Journey
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationLoanRepayment;