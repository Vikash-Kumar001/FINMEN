import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, TrendingUp, TrendingDown, PieChart, Coins, Zap, AlertTriangle, CheckCircle, XCircle, Wallet, Banknote, LineChart, PiggyBank, Smartphone, Home, Car } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";

const BadgeSmartInvestor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('intro'); // intro, challenge, completed
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(1000); // Starting portfolio value

  // Investment scenarios
  const scenarios = [
    {
      id: 1,
      title: "Diversification Strategy",
      scenario: "You have ₹10,000 to invest. How should you allocate it?",
      choices: [
        { 
          id: 1, 
          name: "Put all money in one high-risk stock for maximum returns", 
          type: "risky", 
          icon: TrendingUp,
          impact: -200 // Potential loss
        },
        { 
          id: 2, 
          name: "Spread investments across stocks, bonds, and mutual funds", 
          type: "smart", 
          icon: PieChart,
          impact: 150 // Steady growth
        }
      ],
      correct: 2,
      explanation: "Diversification reduces risk by spreading investments across different asset types. Putting all money in one stock exposes you to significant risk if that stock performs poorly.",
      chartData: [1000, 1050, 1100, 1150, 1100, 1200] // Diversified portfolio
    },
    {
      id: 2,
      title: "Emergency Fund First",
      scenario: "You have ₹5,000 saved. What should you do first?",
      choices: [
        { 
          id: 1, 
          name: "Invest all ₹5,000 in cryptocurrency for quick gains", 
          type: "risky", 
          icon: Zap,
          impact: -300 // High risk
        },
        { 
          id: 2, 
          name: "Keep ₹2,000 as emergency fund, invest ₹3,000 wisely", 
          type: "smart", 
          icon: Banknote,
          impact: 100 // Balanced approach
        }
      ],
      correct: 2,
      explanation: "Always maintain an emergency fund (3-6 months of expenses) before investing. Investing all money without an emergency fund exposes you to financial risk during unexpected events.",
      chartData: [1000, 1020, 1040, 1060, 1080, 1100] // Conservative growth
    },
    {
      id: 3,
      title: "Research Before Investing",
      scenario: "A friend recommends a 'hot' stock that promises 100% returns in a month",
      choices: [
        { 
          id: 1, 
          name: "Invest immediately based on friend's recommendation", 
          type: "risky", 
          icon: AlertTriangle,
          impact: -400 // Scam risk
        },
        { 
          id: 2, 
          name: "Research the company and consult financial advisor first", 
          type: "smart", 
          icon: CheckCircle,
          impact: 200 // Informed decision
        }
      ],
      correct: 2,
      explanation: "Never invest based solely on tips or promises of quick returns. Research companies thoroughly and consult professionals before making investment decisions.",
      chartData: [1000, 1030, 1060, 1090, 1120, 1150] // Steady research-based growth
    },
    {
      id: 4,
      title: "Long-term vs Short-term",
      scenario: "You're planning for retirement 30 years from now",
      choices: [
        { 
          id: 1, 
          name: "Focus on short-term trading for quick profits", 
          type: "risky", 
          icon: Smartphone,
          impact: -100 // High transaction costs
        },
        { 
          id: 2, 
          name: "Choose long-term index funds with compound growth", 
          type: "smart", 
          icon: LineChart,
          impact: 300 // Compound growth
        }
      ],
      correct: 2,
      explanation: "Long-term investing in diversified index funds typically outperforms short-term trading due to compound growth and lower transaction costs. Time in the market beats timing the market.",
      chartData: [1000, 1050, 1150, 1300, 1500, 1800] // Compound growth
    },
    {
      id: 5,
      title: "Risk Assessment",
      scenario: "You're 16 and saving for college in 2 years",
      choices: [
        { 
          id: 1, 
          name: "Invest in volatile stocks for higher potential returns", 
          type: "risky", 
          icon: TrendingDown,
          impact: -250 // Too risky for short term
        },
        { 
          id: 2, 
          name: "Choose safe investments like savings bonds or FDs", 
          type: "smart", 
          icon: Banknote,
          impact: 80 // Safe for short term
        }
      ],
      correct: 2,
      explanation: "For short-term goals (2-5 years), choose safer investments to protect your principal. High-risk investments are appropriate for long-term goals where you can ride out market volatility.",
      chartData: [1000, 1010, 1020, 1030, 1040, 1050] // Safe growth
    },
    {
      id: 6,
      title: "Investment Fees",
      scenario: "Two mutual funds offer similar returns but different fees",
      choices: [
        { 
          id: 1, 
          name: "Choose fund with 2% annual fees", 
          type: "risky", 
          icon: XCircle,
          impact: -150 // High fees eat returns
        },
        { 
          id: 2, 
          name: "Choose fund with 0.1% annual fees", 
          type: "smart", 
          icon: CheckCircle,
          impact: 250 // Low fees preserve returns
        }
      ],
      correct: 2,
      explanation: "Investment fees significantly impact long-term returns. A 2% fee can reduce your portfolio value by thousands of rupees over time compared to a 0.1% fee.",
      chartData: [1000, 1020, 1045, 1075, 1110, 1150] // Fee-efficient growth
    },
    {
      id: 7,
      title: "Emotional Investing",
      scenario: "The stock market crashes 20% in one day",
      choices: [
        { 
          id: 1, 
          name: "Panic sell all investments to prevent further losses", 
          type: "risky", 
          icon: TrendingDown,
          impact: -300 // Selling low locks in losses
        },
        { 
          id: 2, 
          name: "Stay calm and maintain your long-term investment strategy", 
          type: "smart", 
          icon: PiggyBank,
          impact: 200 // Discipline pays off
        }
      ],
      correct: 2,
      explanation: "Emotional decisions during market volatility often lead to poor outcomes. Sticking to your long-term strategy and buying during downturns (rupee-cost averaging) typically yields better results.",
      chartData: [1000, 950, 900, 950, 1050, 1200] // Recovery and growth
    },
    {
      id: 8,
      title: "Goal-based Investing",
      scenario: "You want to buy a car in 3 years and save for retirement",
      choices: [
        { 
          id: 1, 
          name: "Use one investment strategy for both goals", 
          type: "risky", 
          icon: Car,
          impact: -100 // Inappropriate allocation
        },
        { 
          id: 2, 
          name: "Use different strategies for each goal based on timeline", 
          type: "smart", 
          icon: Wallet,
          impact: 180 // Appropriate allocation
        }
      ],
      correct: 2,
      explanation: "Different financial goals require different investment strategies based on time horizons. Short-term goals need safer investments, while long-term goals can tolerate more risk.",
      chartData: [1000, 1025, 1055, 1090, 1130, 1175] // Balanced approach
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'challenge' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'challenge' && selectedChoice === null) {
      // Time's up, auto-select the risky option
      handleChoiceSelect(scenarios[currentScenario].choices[0]);
    }
  }, [gameState, timeLeft, selectedChoice]);

  const startGame = () => {
    setGameState('challenge');
    setCurrentScenario(0);
    setScore(0);
    setTotalScore(0);
    setTimeLeft(30);
    setSelectedChoice(null);
    setStreak(0);
    setMultiplier(1);
    setShowExplanation(false);
    setPortfolioValue(1000);
  };

  const handleChoiceSelect = (choice) => {
    if (gameState !== 'challenge' || selectedChoice !== null) return;
    
    resetFeedback();
    setSelectedChoice(choice);
    setShowExplanation(true);
    
    const isCorrect = choice.type === "smart";
    
    // Update portfolio value based on choice
    const newValue = portfolioValue + choice.impact;
    setPortfolioValue(Math.max(0, newValue)); // Ensure portfolio doesn't go negative
    
    if (isCorrect) {
      const points = 30 * multiplier;
      setScore(score + points);
      setTotalScore(totalScore + points);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Update multiplier based on streak
      if (newStreak >= 5) {
        setMultiplier(3);
      } else if (newStreak >= 3) {
        setMultiplier(2);
      }
      
      showCorrectAnswerFeedback(points, true);
      setFeedbackMessage(`Smart investment! +${points} points. Portfolio: ₹${newValue}`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage(`Risky move! Portfolio: ₹${newValue}. Streak reset!`);
      setIsSuccess(false);
    }
    
    // Move to next scenario or complete game
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setScore(0);
        setTimeLeft(30);
        setSelectedChoice(null);
        setShowExplanation(false);
        setFeedbackMessage('');
      } else {
        setGameState('completed');
        setFeedbackMessage(`Game complete! Final portfolio: ₹${Math.max(0, newValue)}. Total score: ${totalScore + (isCorrect ? 30 * multiplier : 0)}`);
        setIsSuccess(true);
      }
    }, 3500);
  };

  const getTypeColor = (type) => {
    return type === "smart" 
      ? "bg-green-500/20 border-green-400 text-green-300" 
      : "bg-red-500/20 border-red-400 text-red-300";
  };

  const getTypeLabel = (type) => {
    return type === "smart" ? "Smart Investment" : "Risky Move";
  };

  // Simple chart component
  const InvestmentChart = ({ data }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="h-24 w-full flex items-end space-x-1 mt-4">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isPositive = value >= data[0];
          
          return (
            <div 
              key={index} 
              className={`flex-1 rounded-t ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ height: `${Math.max(10, height)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <GameShell
      title="Smart Investor Challenge"
      gameId="finance-teens-140"
      gameType="achievement"
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentScenario + 1}
      score={totalScore}
      totalScore={1000} // Max possible score
      onNext={() => navigate("/games/financial-literacy/teen")}
      nextEnabled={gameState === 'completed'}
      showGameOver={gameState === 'completed'}
      showConfetti={gameState === 'completed' && totalScore >= 700}
    >
      <div className="text-center text-white space-y-6">
        <h3 className="text-3xl font-bold mb-4">Smart Investor Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Master Smart Investing!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your investment knowledge in 8 real-world scenarios
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the smart investment strategy. 
                Build streaks for bonus points and grow your investment portfolio!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="font-bold text-green-300">Smart Investment</div>
                <div className="text-sm text-white/80">Strategic, informed decisions</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Risky Move</div>
                <div className="text-sm text-white/80">Emotional, uninformed choices</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Investment Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">Investment Scenario {currentScenario + 1}</h4>
                <p className="text-white/80">{scenarios[currentScenario].title}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">Streak: {streak}x</div>
                {multiplier > 1 && (
                  <div className="text-md font-semibold text-orange-400">Multiplier: {multiplier}x</div>
                )}
                <div className="text-lg font-semibold text-red-400">{timeLeft}s</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-4 mb-6 border border-blue-400/30">
              <p className="text-blue-200 text-lg font-medium mb-2">Situation:</p>
              <p className="text-blue-100">{scenarios[currentScenario].scenario}</p>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-purple-200">Portfolio Value</div>
                <div className="text-2xl font-bold text-yellow-400">₹{portfolioValue}</div>
              </div>
              <InvestmentChart data={scenarios[currentScenario].chartData} />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>Start</span>
                <span>Now</span>
              </div>
            </div>
            
            {feedbackMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                isSuccess ? 'bg-green-500/30 text-green-200 border border-green-400' : 'bg-red-500/30 text-red-200 border border-red-400'
              }`}>
                {feedbackMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {scenarios[currentScenario].choices.map((choice) => {
                const IconComponent = choice.icon;
                const isSelected = selectedChoice && selectedChoice.id === choice.id;
                const isRevealed = selectedChoice !== null;
                const isCorrectChoice = choice.type === "smart";
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={selectedChoice !== null}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      isRevealed
                        ? (isCorrectChoice
                            ? 'bg-green-500/30 border-green-400'
                            : 'bg-red-500/30 border-red-400')
                        : (isSelected
                            ? 'bg-blue-500/30 border-blue-400 transform scale-[1.02]'
                            : 'bg-white/5 hover:bg-white/10 border-white/30')
                    } ${selectedChoice === null ? 'hover:shadow-lg cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <IconComponent className="w-6 h-6 mr-3 text-white" />
                        <div className="font-bold">{choice.name}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(choice.type)}`}>
                        {getTypeLabel(choice.type)}
                      </span>
                    </div>
                    
                    {isRevealed && (
                      <div className="mt-2 text-sm">
                        {isCorrectChoice ? (
                          <span className="text-green-300">✓ Smart investment strategy</span>
                        ) : (
                          <span className="text-red-300">✗ Risky investment approach</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {showExplanation && (
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400 mb-4">
                <p className="font-bold text-yellow-200 mb-1">Investment Insight:</p>
                <p className="text-yellow-100">{scenarios[currentScenario].explanation}</p>
              </div>
            )}
            
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-gray-300 text-sm">
                <span className="font-bold">Golden Rule:</span> Invest time in research before investing money. 
                Diversification and patience are key to long-term success.
              </p>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Smart Investor Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering investment strategies!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <div className="text-2xl font-bold text-green-400 mb-4">Final Portfolio: ₹{portfolioValue}</div>
              <p className="text-white/90">
                {totalScore >= 800 ? "🏆 Investment Guru!" : 
                 totalScore >= 600 ? "🥇 Financial Strategist!" : 
                 totalScore >= 400 ? "🥈 Smart Saver!" : 
                 "🥉 Keep Learning!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <Coins className="mx-auto w-8 h-8 text-green-400 mb-2" />
                <div className="font-bold">{scenarios.length}</div>
                <div className="text-xs text-white/80">Scenarios</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <TrendingUp className="mx-auto w-8 h-8 text-blue-400 mb-2" />
                <div className="font-bold">{streak}</div>
                <div className="text-xs text-white/80">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Trophy className="mx-auto w-8 h-8 text-purple-400 mb-2" />
                <div className="font-bold">{multiplier}x</div>
                <div className="text-xs text-white/80">Max Multiplier</div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-200 mb-2">Key Investment Principles:</h4>
              <ul className="text-blue-100 text-left list-disc pl-5 space-y-1">
                <li>Diversify your investments to reduce risk</li>
                <li>Maintain an emergency fund before investing</li>
                <li>Research thoroughly and avoid emotional decisions</li>
                <li>Focus on long-term growth over short-term gains</li>
                <li>Keep investment fees low to maximize returns</li>
              </ul>
            </div>
            
            <button
              onClick={() => navigate("/games/financial-literacy/teen")}
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

export default BadgeSmartInvestor;