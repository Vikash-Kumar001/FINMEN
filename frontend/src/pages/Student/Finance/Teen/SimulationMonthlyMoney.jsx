import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMonthlyMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-8";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Allowance Management",
      description: "You receive ₹500 as monthly allowance. How should you manage it?",
      choices: [
        { 
          id: "save", 
          text: "Save half (₹250)", 
          emoji: "💰", 
          description: "Put ₹250 in savings, use ₹250 for expenses",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all", 
          emoji: "🛍️", 
          description: "Use the entire ₹500 for entertainment and treats",
          isCorrect: false
        },
        { 
          id: "lend", 
          text: "Lend risky", 
          emoji: "🎲", 
          description: "Lend to a friend with uncertain repayment",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Unexpected Expense",
      description: "Your phone breaks and needs ₹300 repair. You have ₹200 saved. What do you do?",
      choices: [
        { 
          id: "spend", 
          text: "Borrow from parents", 
          emoji: "👨‍👩‍👧‍👦", 
          description: "Ask parents to pay for the full repair",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Use savings + earn more", 
          emoji: "🏦", 
          description: "Use ₹200 savings and do extra chores to earn the remaining ₹100",
          isCorrect: true
        },
        { 
          id: "lend", 
          text: "Use credit", 
          emoji: "💳", 
          description: "Use a credit card to pay and pay later with interest",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Bonus Opportunity",
      description: "You get ₹200 bonus for good grades. How should you use it?",
      choices: [
        { 
          id: "spend", 
          text: "Spend all on treats", 
          emoji: "🎉", 
          description: "Buy expensive items you wanted",
          isCorrect: false
        },
        { 
          id: "lend", 
          text: "Lend to friends", 
          emoji: "👥", 
          description: "Lend to friends who promised to return",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save most, small treat", 
          emoji: "🎯", 
          description: "Save ₹150 and use ₹50 for a small reward",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Part-time Job",
      description: "You earn ₹1000 from a part-time job. What's the best approach?",
      choices: [
        { 
          id: "spend", 
          text: "Spend on lifestyle", 
          emoji: "🛍️", 
          description: "Upgrade your lifestyle with better clothes and gadgets",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save 50%, use 50%", 
          emoji: "📈", 
          description: "Save ₹500 for future goals, use ₹500 for necessary expenses",
          isCorrect: true
        },
        { 
          id: "lend", 
          text: "Invest risky", 
          emoji: "🎰", 
          description: "Invest in a friend's risky business idea",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Wants vs Needs",
      description: "You want ₹800 shoes but need ₹500 textbooks. What do you prioritize?",
      choices: [
        { 
          id: "lend", 
          text: "Buy both on credit", 
          emoji: "💸", 
          description: "Buy both items using credit cards",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Buy textbooks first", 
          emoji: "📚", 
          description: "Buy necessary textbooks first, save for shoes later",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy shoes first", 
          emoji: "👟", 
          description: "Buy the shoes you want now",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      scenarioId: scenarios[currentScenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next scenario or show results
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/teen/reflex-wise-use");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Monthly Money"
      score={coins}
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      
      gameId="finance-teens-8"
      gameType="finance"
      totalLevels={20}
      currentLevel={8}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentScenario().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentScenario().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-3">{choice.emoji}</div>
                      <h4 className="font-bold text-lg mb-2">{choice.text}</h4>
                      <p className="text-white/90 text-sm">{choice.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Simulation!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart money decisions out of {scenarios.length} scenarios!
                  You're learning to manage money wisely!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of saving, prioritizing needs over wants, and avoiding risky financial decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart money decisions out of {scenarios.length} scenarios.
                  Remember, saving money and making thoughtful financial decisions are important!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money and makes thoughtful financial decisions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMonthlyMoney;