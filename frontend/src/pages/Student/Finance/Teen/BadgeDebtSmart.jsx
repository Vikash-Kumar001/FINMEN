import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Coins, AlertTriangle, CheckCircle, XCircle, Wallet, CreditCard, PiggyBank, User, School, Home, Car, Smartphone } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";

const BadgeDebtSmart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('intro'); // intro, challenge, completed
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);

  // Responsible borrowing scenarios
  const scenarios = [
    {
      id: 1,
      title: "Educational Investment",
      scenario: "You need ₹50,000 for college tuition but only have ₹20,000 saved",
      choices: [
        { 
          id: 1, 
          name: "Take a student loan with low interest for education", 
          type: "responsible", 
          icon: School,
          reason: "Education loans are investments in your future"
        },
        { 
          id: 2, 
          name: "Use a high-interest credit card to pay for tuition", 
          type: "irresponsible", 
          icon: CreditCard,
          reason: "Credit cards have high interest rates unsuitable for large expenses"
        }
      ],
      correct: 1,
      explanation: "Student loans typically have lower interest rates and are considered investments in your future. Credit cards have high interest rates that make them unsuitable for large educational expenses."
    },
    {
      id: 2,
      title: "Emergency Situation",
      scenario: "Your laptop breaks the night before an important project is due",
      choices: [
        { 
          id: 1, 
          name: "Borrow ₹30,000 from a friend to buy a new laptop immediately", 
          type: "irresponsible", 
          icon: User,
          reason: "Large personal loans can strain relationships"
        },
        { 
          id: 2, 
          name: "Use library computers and borrow a friend's laptop temporarily", 
          type: "responsible", 
          icon: School,
          reason: "Finding temporary solutions avoids unnecessary debt"
        }
      ],
      correct: 2,
      explanation: "Temporary solutions like library computers or borrowing a friend's laptop can help in emergencies without creating debt. Large personal loans can strain relationships and create financial burdens."
    },
    {
      id: 3,
      title: "Wants vs Needs",
      scenario: "You want the latest smartphone but your current one works fine",
      choices: [
        { 
          id: 1, 
          name: "Take a personal loan to buy the new smartphone", 
          type: "irresponsible", 
          icon: Smartphone,
          reason: "Loans should be for needs, not wants"
        },
        { 
          id: 2, 
          name: "Save up for the phone over time without borrowing", 
          type: "responsible", 
          icon: PiggyBank,
          reason: "Saving avoids interest payments and builds discipline"
        }
      ],
      correct: 2,
      explanation: "Borrowing for wants rather than needs creates unnecessary debt. Saving up over time avoids interest payments and builds financial discipline."
    },
    {
      id: 4,
      title: "Debt Management",
      scenario: "You have multiple small debts with different due dates",
      choices: [
        { 
          id: 1, 
          name: "Take a consolidation loan to combine all debts into one payment", 
          type: "responsible", 
          icon: Wallet,
          reason: "Consolidation can simplify payments and reduce interest"
        },
        { 
          id: 2, 
          name: "Ignore the debts and hope they go away", 
          type: "irresponsible", 
          icon: XCircle,
          reason: "Ignoring debts leads to penalties and credit damage"
        }
      ],
      correct: 1,
      explanation: "Debt consolidation can simplify payments and potentially reduce interest rates. Ignoring debts leads to penalties, increased interest, and damage to your credit score."
    },
    {
      id: 5,
      title: "Home Improvement",
      scenario: "Your family needs essential home repairs that cost ₹40,000",
      choices: [
        { 
          id: 1, 
          name: "Take a home improvement loan with fixed low interest", 
          type: "responsible", 
          icon: Home,
          reason: "Home loans have purpose and favorable terms"
        },
        { 
          id: 2, 
          name: "Use multiple credit cards to cover the repairs", 
          type: "irresponsible", 
          icon: CreditCard,
          reason: "Credit cards have high interest for large purchases"
        }
      ],
      correct: 1,
      explanation: "Home improvement loans are secured by the property and typically have lower interest rates. Using multiple credit cards for large purchases leads to high interest payments."
    },
    {
      id: 6,
      title: "Vehicle Purchase",
      scenario: "You need a vehicle for work but can't afford to buy one outright",
      choices: [
        { 
          id: 1, 
          name: "Take an auto loan with reasonable terms and down payment", 
          type: "responsible", 
          icon: Car,
          reason: "Auto loans are secured and have reasonable terms"
        },
        { 
          id: 2, 
          name: "Lease a luxury car with high monthly payments", 
          type: "irresponsible", 
          icon: Car,
          reason: "Luxury leases create ongoing financial obligations"
        }
      ],
      correct: 1,
      explanation: "Auto loans for necessary vehicles with reasonable down payments are responsible borrowing. Leasing luxury cars with high payments creates ongoing financial obligations without building equity."
    },
    {
      id: 7,
      title: "Credit Assessment",
      scenario: "You're considering a loan but aren't sure if you can afford it",
      choices: [
        { 
          id: 1, 
          name: "Calculate if the monthly payments fit in your budget first", 
          type: "responsible", 
          icon: CheckCircle,
          reason: "Affordability should always be assessed before borrowing"
        },
        { 
          id: 2, 
          name: "Apply for the loan and worry about payments later", 
          type: "irresponsible", 
          icon: AlertTriangle,
          reason: "Borrowing without planning leads to financial stress"
        }
      ],
      correct: 1,
      explanation: "Before borrowing, always calculate whether the monthly payments fit comfortably in your budget. Borrowing without a repayment plan leads to financial stress and potential default."
    },
    {
      id: 8,
      title: "Debt-Free Goal",
      scenario: "You want to become debt-free as quickly as possible",
      choices: [
        { 
          id: 1, 
          name: "Pay more than the minimum on high-interest debts first", 
          type: "responsible", 
          icon: Coins,
          reason: "This strategy minimizes total interest paid"
        },
        { 
          id: 2, 
          name: "Pay only the minimum on all debts equally", 
          type: "irresponsible", 
          icon: Wallet,
          reason: "This approach maximizes interest payments over time"
        }
      ],
      correct: 1,
      explanation: "Paying more than the minimum on high-interest debts first (debt avalanche method) minimizes the total interest paid and helps you become debt-free faster. Paying only minimums maximizes interest payments over time."
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'challenge' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'challenge' && selectedChoice === null) {
      // Time's up, auto-select the irresponsible option
      handleChoiceSelect(scenarios[currentScenario].choices[1]);
    }
  }, [gameState, timeLeft, selectedChoice]);

  const startGame = () => {
    setGameState('challenge');
    setCurrentScenario(0);
    setScore(0);
    setTotalScore(0);
    setTimeLeft(25);
    setSelectedChoice(null);
    setStreak(0);
    setMultiplier(1);
    setShowExplanation(false);
  };

  const handleChoiceSelect = (choice) => {
    if (gameState !== 'challenge' || selectedChoice !== null) return;
    
    resetFeedback();
    setSelectedChoice(choice);
    setShowExplanation(true);
    
    const isCorrect = choice.type === "responsible";
    
    if (isCorrect) {
      const points = 25 * multiplier;
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
      setFeedbackMessage(`Responsible choice! +${points} points. Streak: ${newStreak}x`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage("Irresponsible borrowing! Streak reset!");
      setIsSuccess(false);
    }
    
    // Move to next scenario or complete game
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setScore(0);
        setTimeLeft(25);
        setSelectedChoice(null);
        setShowExplanation(false);
        setFeedbackMessage('');
      } else {
        setGameState('completed');
        setFeedbackMessage(`Game complete! Total score: ${totalScore + (isCorrect ? 25 * multiplier : 0)}`);
        setIsSuccess(true);
      }
    }, 3000);
  };

  const getTypeColor = (type) => {
    return type === "responsible" 
      ? "bg-green-500/20 border-green-400 text-green-300" 
      : "bg-red-500/20 border-red-400 text-red-300";
  };

  const getTypeLabel = (type) => {
    return type === "responsible" ? "Responsible" : "Irresponsible";
  };

  return (
    <GameShell
      title="Debt Smart Challenge"
      gameId="finance-teens-120"
      gameType="achievement"
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentScenario + 1}
      score={totalScore}
      totalScore={800} // Max possible score
      onNext={() => navigate("/games/financial-literacy/teen")}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextEnabled={gameState === 'completed'}
      showGameOver={gameState === 'completed'}
      showConfetti={gameState === 'completed' && totalScore >= 600}
    >
      <div className="text-center text-white space-y-6">
        <h3 className="text-3xl font-bold mb-4">Debt Smart Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Master Responsible Borrowing!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your knowledge of responsible borrowing in 8 real-world scenarios
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the responsible borrowing practice. 
                Build streaks for bonus points and become a Debt Smart expert!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="font-bold text-green-300">Responsible</div>
                <div className="text-sm text-white/80">Smart borrowing practices</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Irresponsible</div>
                <div className="text-sm text-white/80">Risky borrowing habits</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Debt Smart Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">Scenario {currentScenario + 1}</h4>
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
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-lg font-medium mb-2">Situation:</p>
              <p className="text-blue-100">{scenarios[currentScenario].scenario}</p>
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
                const isCorrectChoice = choice.type === "responsible";
                
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
                          <span className="text-green-300">✓ Responsible borrowing</span>
                        ) : (
                          <span className="text-red-300">✗ Irresponsible borrowing</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {showExplanation && (
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400 mb-4">
                <p className="font-bold text-yellow-200 mb-1">Explanation:</p>
                <p className="text-yellow-100">{scenarios[currentScenario].explanation}</p>
              </div>
            )}
            
            <div className="bg-purple-500/20 rounded-lg p-3">
              <p className="text-purple-200 text-sm">
                <span className="font-bold">Key Principle:</span> Borrow only for needs, not wants. 
                Always ensure you can afford the repayments before taking on debt.
              </p>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Debt Smart Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering responsible borrowing!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <p className="text-white/90">
                {totalScore >= 700 ? "🏆 Debt Management Expert!" : 
                 totalScore >= 500 ? "🥇 Responsible Borrower!" : 
                 totalScore >= 300 ? "🥈 Smart Financial Planner!" : 
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
                <CheckCircle className="mx-auto w-8 h-8 text-blue-400 mb-2" />
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
              <h4 className="font-bold text-blue-200 mb-2">Key Lesson:</h4>
              <p className="text-blue-100">
                Master responsible borrowing by only taking debt for necessary expenses, 
                ensuring affordability, and having a clear repayment plan.
              </p>
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

export default BadgeDebtSmart;