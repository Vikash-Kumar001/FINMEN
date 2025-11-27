import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

// Items available in the shopping mall
const items = [
  { id: 1, name: "Designer Jeans", price: 80, category: "Clothing", necessity: "want" },
  { id: 2, name: "Basic T-Shirt", price: 15, category: "Clothing", necessity: "need" },
  { id: 3, name: "Smartphone", price: 700, category: "Electronics", necessity: "want" },
  { id: 4, name: "School Supplies", price: 25, category: "Education", necessity: "need" },
  { id: 5, name: "Gaming Headset", price: 120, category: "Electronics", necessity: "want" },
  { id: 6, name: "Running Shoes", price: 90, category: "Footwear", necessity: "need" },
  { id: 7, name: "Coffee Shop Gift Card", price: 25, category: "Food", necessity: "want" },
  { id: 8, name: "Textbook", price: 120, category: "Education", necessity: "need" },
  { id: 9, name: "Movie Tickets", price: 30, category: "Entertainment", necessity: "want" },
  { id: 10, name: "Winter Coat", price: 150, category: "Clothing", necessity: "need" },
  { id: 11, name: "Video Game", price: 60, category: "Entertainment", necessity: "want" },
  { id: 12, name: "Toothbrush Set", price: 10, category: "Personal Care", necessity: "need" }
];

// Different shopping scenarios
const scenarios = [
    {
      id: 1,
      title: "Back to School Shopping",
      budget: 150,
      goal: "Buy essential school supplies and clothes while staying within budget",
      required: ["School Supplies"],
      timeLimit: 120
    },
    {
      id: 2,
      title: "Holiday Gift Shopping",
      budget: 100,
      goal: "Buy thoughtful gifts for family members with different needs",
      required: [],
      timeLimit: 120
    },
    {
      id: 3,
      title: "Emergency Clothing Needs",
      budget: 110,
      goal: "Replace essential clothing items after an unexpected situation",
      required: ["Basic T-Shirt", "Running Shoes"],
      timeLimit: 90
    },
    {
      id: 4,
      title: "Entertainment and Socializing",
      budget: 60,
      goal: "Plan for social activities while maintaining financial responsibility",
      required: [],
      timeLimit: 90
    },
    {
      id: 5,
      title: "Balanced Shopping Day",
      budget: 200,
      goal: "Make purchases for needs, some wants, and save some money",
      required: ["Toothbrush Set"],
      timeLimit: 150
    }
];

const SimulationShoppingMall = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-18";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [budget, setBudget] = useState(150);
  const [cart, setCart] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Reset budget and cart when scenario changes
  useEffect(() => {
    if (scenarios[currentScenario]) {
      setBudget(scenarios[currentScenario].budget);
      setCart([]);
      setAnswered(false);
    }
  }, [currentScenario]);

  const addToCart = (item) => {
    if (answered) return;
    if (budget >= item.price) {
      setCart([...cart, item]);
      setBudget(budget - item.price);
    }
  };

  const removeFromCart = (itemId) => {
    if (answered) return;
    const itemToRemove = cart.find(item => item.id === itemId);
    if (itemToRemove) {
      setCart(cart.filter(item => item.id !== itemId));
      setBudget(budget + itemToRemove.price);
    }
  };

  const handleSubmit = () => {
    if (answered) return;
    
    resetFeedback();
    setAnswered(true);
    
    const scenario = scenarios[currentScenario];
    let scenarioScore = 0;
    
    // Check if required items are purchased
    const requiredItems = scenario.required;
    const purchasedItems = cart.map(item => item.name);
    const allRequiredPurchased = requiredItems.length === 0 || requiredItems.every(item => 
      purchasedItems.includes(item)
    );
    
    // Check if within budget
    const withinBudget = budget >= 0;
    
    // Award points
    if (allRequiredPurchased && withinBudget) {
      scenarioScore = 1;
    }
    
    if (scenarioScore > 0) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastScenario = currentScenario >= scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
      }
    }, 1500);
  };

  const currentScenarioData = scenarios[currentScenario];
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <GameShell
      title="Simulation: Shopping Mall"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      gameId={gameId}
      gameType="finance"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      coinsPerLevel={coinsPerLevel}
      score={score}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      showConfetti={showResult && score === scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="text-center text-white space-y-4">
        {!showResult && currentScenarioData && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-white">{currentScenarioData.title}</h3>
                <div className="text-right">
                  <div className="text-base font-bold text-yellow-400">Budget: ₹{budget}</div>
                  <div className="text-xs text-white/70">Remaining</div>
                </div>
              </div>
              
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 mb-3">
                <h5 className="font-medium text-blue-300 mb-1 text-sm">Goal:</h5>
                <p className="text-white/90 text-xs">{currentScenarioData.goal}</p>
                {currentScenarioData.required.length > 0 && (
                  <p className="mt-1 text-white/80 text-xs">
                    <span className="font-medium">Required:</span> {currentScenarioData.required.join(", ")}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                {items.map((item) => {
                  const inCart = cart.some(cartItem => cartItem.id === item.id);
                  const canAfford = budget >= item.price;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`border rounded-lg p-2 transition duration-200 ${
                        inCart 
                          ? 'bg-green-500/30 border-green-400' 
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <h5 className="font-medium text-white text-xs mb-1">{item.name}</h5>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-yellow-400 font-bold text-xs">₹{item.price}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.necessity === 'need' 
                            ? 'bg-green-500/50 text-green-200' 
                            : 'bg-yellow-500/50 text-yellow-200'
                        }`}>
                          {item.necessity}
                        </span>
                      </div>
                      <button
                        onClick={() => inCart ? removeFromCart(item.id) : addToCart(item)}
                        disabled={!canAfford && !inCart || answered}
                        className={`w-full py-1.5 rounded-lg text-xs font-medium transition duration-200 ${
                          inCart
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : canAfford && !answered
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {inCart ? 'Remove' : 'Add to Cart'}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t border-white/20 pt-3">
                  <h5 className="font-medium text-white mb-2 text-sm">Shopping Cart ({cart.length} items):</h5>
                  <div className="space-y-1 mb-2 max-h-24 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white/10 p-1.5 rounded-lg">
                        <span className="text-white text-xs">{item.name} - ₹{item.price}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={answered}
                          className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-right text-white/80 text-xs">
                    Total: ₹{cartTotal} | Remaining: ₹{budget}
                  </div>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={answered || cart.length === 0}
                className={`mt-3 w-full py-2 rounded-full text-sm font-semibold transition-transform ${
                  !answered && cart.length > 0
                    ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                {currentScenario === scenarios.length - 1 ? 'Submit Final Cart' : 'Submit & Continue'}
              </button>
            </div>
            
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
              <span className="text-white/80 text-xs">
                Scenario {currentScenario + 1} of {scenarios.length}
              </span>
              <span className="font-medium text-yellow-400 text-xs">
                Score: {score}/{scenarios.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationShoppingMall;