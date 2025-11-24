import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Lightbulb, TrendingUp, Users, Zap, Coins, ShoppingCart, Target, AlertTriangle, CheckCircle, XCircle, Wallet, PiggyBank, BarChart3, Award } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungEntrepreneur = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-160";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('intro'); // intro, challenge, completed
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [businessRevenue, setBusinessRevenue] = useState(0); // Business revenue tracker

  // Entrepreneurship scenarios
  const scenarios = [
    {
      id: 1,
      title: "Business Idea Validation",
      scenario: "You have an idea for a mobile app that helps students organize study schedules",
      choices: [
        { 
          id: 1, 
          name: "Build the app immediately and launch it", 
          type: "risky", 
          icon: Zap,
          impact: -100 // Risk of building without validation
        },
        { 
          id: 2, 
          name: "Survey potential users and validate demand first", 
          type: "smart", 
          icon: Target,
          impact: 200 // Smart validation approach
        }
      ],
      correct: 2,
      explanation: "Successful entrepreneurs validate their ideas before investing time and money. Surveying potential users helps ensure there's real demand for your product.",
      revenueData: [0, 50, 100, 200, 150, 300] // Revenue growth
    },
    {
      id: 2,
      title: "Startup Funding",
      scenario: "You need ₹50,000 to start your tutoring business",
      choices: [
        { 
          id: 1, 
          name: "Ask parents for full amount as a loan", 
          type: "risky", 
          icon: AlertTriangle,
          impact: -150 // Risk of family financial strain
        },
        { 
          id: 2, 
          name: "Start small with ₹5,000 and reinvest profits", 
          type: "smart", 
          icon: PiggyBank,
          impact: 180 // Bootstrap approach
        }
      ],
      correct: 2,
      explanation: "Bootstrapping (starting small and reinvesting profits) reduces financial risk and teaches valuable lessons about resource management and sustainable growth.",
      revenueData: [0, 20, 60, 120, 200, 300] // Gradual growth
    },
    {
      id: 3,
      title: "Customer Service",
      scenario: "A customer complains about a product defect on social media",
      choices: [
        { 
          id: 1, 
          name: "Ignore the complaint to avoid negative attention", 
          type: "risky", 
          icon: XCircle,
          impact: -200 // Reputation damage
        },
        { 
          id: 2, 
          name: "Respond promptly and offer to replace the product", 
          type: "smart", 
          icon: CheckCircle,
          impact: 150 // Customer loyalty
        }
      ],
      correct: 2,
      explanation: "Exceptional customer service turns problems into opportunities. Promptly addressing complaints builds trust and loyalty, often resulting in positive word-of-mouth.",
      revenueData: [300, 320, 350, 380, 420, 450] // Customer retention
    },
    {
      id: 4,
      title: "Market Competition",
      scenario: "A big company launches a similar product to yours",
      choices: [
        { 
          id: 1, 
          name: "Lower prices to compete directly", 
          type: "risky", 
          icon: ShoppingCart,
          impact: -100 // Price war risk
        },
        { 
          id: 2, 
          name: "Differentiate by improving quality or service", 
          type: "smart", 
          icon: Award,
          impact: 250 // Value differentiation
        }
      ],
      correct: 2,
      explanation: "Successful businesses compete on value rather than just price. Differentiation through quality, service, or unique features creates a sustainable competitive advantage.",
      revenueData: [450, 470, 500, 550, 620, 700] // Value-based growth
    },
    {
      id: 5,
      title: "Financial Management",
      scenario: "Your business is growing rapidly with increased sales",
      choices: [
        { 
          id: 1, 
          name: "Spend all profits on personal luxuries", 
          type: "risky", 
          icon: Wallet,
          impact: -180 // No reinvestment
        },
        { 
          id: 2, 
          name: "Reinvest profits for business growth and save for emergencies", 
          type: "smart", 
          icon: BarChart3,
          impact: 300 // Sustainable growth
        }
      ],
      correct: 2,
      explanation: "Reinvesting profits fuels business growth and building emergency funds protects against unexpected downturns. Smart financial management ensures long-term sustainability.",
      revenueData: [700, 750, 820, 900, 1000, 1150] // Reinvestment growth
    },
    {
      id: 6,
      title: "Team Building",
      scenario: "Your business is growing and you need help managing it",
      choices: [
        { 
          id: 1, 
          name: "Hire friends without considering skills or fit", 
          type: "risky", 
          icon: Users,
          impact: -120 // Wrong hires
        },
        { 
          id: 2, 
          name: "Recruit skilled people who share your vision", 
          type: "smart", 
          icon: Users,
          impact: 220 // Strategic hiring
        }
      ],
      correct: 2,
      explanation: "Building a strong team with complementary skills is crucial for business success. Hiring based on skills and cultural fit rather than convenience leads to better performance.",
      revenueData: [1150, 1200, 1280, 1380, 1500, 1650] // Team-driven growth
    },
    {
      id: 7,
      title: "Business Planning",
      scenario: "You want to expand your business to a new city",
      choices: [
        { 
          id: 1, 
          name: "Jump into the new market without research", 
          type: "risky", 
          icon: Zap,
          impact: -250 // Market risk
        },
        { 
          id: 2, 
          name: "Study the market and create a detailed expansion plan", 
          type: "smart", 
          icon: Target,
          impact: 280 // Strategic expansion
        }
      ],
      correct: 2,
      explanation: "Strategic expansion requires market research and planning. Understanding local competition, customer needs, and regulations increases the chances of successful expansion.",
      revenueData: [1650, 1700, 1780, 1880, 2000, 2150] // Planned growth
    },
    {
      id: 8,
      title: "Innovation and Adaptation",
      scenario: "New technology threatens to make your product obsolete",
      choices: [
        { 
          id: 1, 
          name: "Ignore the threat and continue as before", 
          type: "risky", 
          icon: XCircle,
          impact: -300 // Obsolescence risk
        },
        { 
          id: 2, 
          name: "Invest in learning the new technology and adapting", 
          type: "smart", 
          icon: Lightbulb,
          impact: 350 // Innovation advantage
        }
      ],
      correct: 2,
      explanation: "Successful entrepreneurs continuously adapt to changing markets and technologies. Embracing innovation rather than fearing it creates new opportunities for growth.",
      revenueData: [2150, 2200, 2300, 2450, 2650, 2900] // Innovation-driven growth
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
    setTimeLeft(35);
    setSelectedChoice(null);
    setStreak(0);
    setMultiplier(1);
    setShowExplanation(false);
    setBusinessRevenue(0);
  };

  const handleChoiceSelect = (choice) => {
    if (gameState !== 'challenge' || selectedChoice !== null) return;
    
    resetFeedback();
    setSelectedChoice(choice);
    setShowExplanation(true);
    
    const isCorrect = choice.type === "smart";
    
    // Update business revenue based on choice
    const newRevenue = businessRevenue + choice.impact;
    setBusinessRevenue(Math.max(0, newRevenue)); // Ensure revenue doesn't go negative
    
    if (isCorrect) {
      const points = 35 * multiplier;
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
      setFeedbackMessage(`Smart business move! +${points} points. Revenue: ₹${newRevenue}`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage(`Risky decision! Revenue: ₹${newRevenue}. Streak reset!`);
      setIsSuccess(false);
    }
    
    // Move to next scenario or complete game
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setScore(0);
        setTimeLeft(35);
        setSelectedChoice(null);
        setShowExplanation(false);
        setFeedbackMessage('');
      } else {
        setGameState('completed');
        setFeedbackMessage(`Game complete! Final revenue: ₹${Math.max(0, newRevenue)}. Total score: ${totalScore + (isCorrect ? 35 * multiplier : 0)}`);
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
    return type === "smart" ? "Smart Business Move" : "Risky Decision";
  };

  // Simple revenue chart component
  const RevenueChart = ({ data }) => {
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
      title="Young Entrepreneur Challenge"
      gameId="finance-teens-160"
      gameType="achievement"
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentScenario + 1}
      score={totalScore}
      totalScore={1200} // Max possible score
      onNext={() => navigate("/games/financial-literacy/teen")}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextEnabled={gameState === 'completed'}
      showGameOver={gameState === 'completed'}
      showConfetti={gameState === 'completed' && totalScore >= 800}
    >
      <div className="text-center text-white space-y-6">
        <h3 className="text-3xl font-bold mb-4">Young Entrepreneur Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Build Your Business Empire!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your entrepreneurship skills in 8 real-world business scenarios
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the smart business strategy. 
                Build streaks for bonus points and grow your business revenue!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="font-bold text-green-300">Smart Business Move</div>
                <div className="text-sm text-white/80">Strategic, informed decisions</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Risky Decision</div>
                <div className="text-sm text-white/80">Emotional, uninformed choices</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Business Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">Business Scenario {currentScenario + 1}</h4>
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
              <p className="text-blue-200 text-lg font-medium mb-2">Business Challenge:</p>
              <p className="text-blue-100">{scenarios[currentScenario].scenario}</p>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-purple-200">Business Revenue</div>
                <div className="text-2xl font-bold text-yellow-400">₹{businessRevenue}</div>
              </div>
              <RevenueChart data={scenarios[currentScenario].revenueData} />
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
                          <span className="text-green-300">✓ Smart business strategy</span>
                        ) : (
                          <span className="text-red-300">✗ Risky business approach</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {showExplanation && (
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400 mb-4">
                <p className="font-bold text-yellow-200 mb-1">Business Insight:</p>
                <p className="text-yellow-100">{scenarios[currentScenario].explanation}</p>
              </div>
            )}
            
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-gray-300 text-sm">
                <span className="font-bold">Entrepreneur Tip:</span> Successful businesses solve real problems, 
                adapt to change, and prioritize customer satisfaction over quick profits.
              </p>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Young Entrepreneur Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on building your business empire!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <div className="text-2xl font-bold text-green-400 mb-4">Final Revenue: ₹{businessRevenue}</div>
              <p className="text-white/90">
                {totalScore >= 1000 ? "🏆 Business Mogul!" : 
                 totalScore >= 800 ? "🥇 Entrepreneur Pro!" : 
                 totalScore >= 600 ? "🥈 Smart Business Builder!" : 
                 "🥉 Keep Growing!"}
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
              <h4 className="font-bold text-blue-200 mb-2">Key Entrepreneurship Principles:</h4>
              <ul className="text-blue-100 text-left list-disc pl-5 space-y-1">
                <li>Validate ideas before investing resources</li>
                <li>Start small and scale gradually</li>
                <li>Prioritize customer satisfaction and service</li>
                <li>Differentiate through value, not just price</li>
                <li>Reinvest profits for sustainable growth</li>
                <li>Build strong teams with complementary skills</li>
                <li>Adapt to market changes and embrace innovation</li>
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

export default BadgeYoungEntrepreneur;