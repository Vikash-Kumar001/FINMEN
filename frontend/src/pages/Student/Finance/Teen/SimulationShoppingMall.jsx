import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const SimulationShoppingMall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [budget, setBudget] = useState(150);
  const [cart, setCart] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scores, setScores] = useState(Array(5).fill(0));
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per scenario
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
      budget: 80,
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

  // Reset timer when scenario changes
  useEffect(() => {
    setTimeLeft(scenarios[currentScenario].timeLimit);
    setBudget(scenarios[currentScenario].budget);
    setCart([]);
  }, [currentScenario]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up, evaluate the scenario
      evaluateScenario();
    }
  }, [timeLeft]);

  const addToCart = (item) => {
    resetFeedback();
    if (budget >= item.price) {
      setCart([...cart, item]);
      setBudget(budget - item.price);
      showCorrectAnswerFeedback(1, true);
      setFeedbackMessage("Added to cart!");
      setIsSuccess(true);
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedbackMessage('');
      }, 1000);
    } else {
      setFeedbackMessage("Not enough budget!");
      setIsSuccess(false);
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedbackMessage('');
      }, 1000);
    }
  };

  const removeFromCart = (itemId) => {
    resetFeedback();
    const itemToRemove = cart.find(item => item.id === itemId);
    if (itemToRemove) {
      setCart(cart.filter(item => item.id !== itemId));
      setBudget(budget + itemToRemove.price);
      showCorrectAnswerFeedback(1, true);
      setFeedbackMessage("Removed from cart");
      setIsSuccess(true);
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedbackMessage('');
      }, 1000);
    }
  };

  const evaluateScenario = () => {
    const scenario = scenarios[currentScenario];
    let score = 0;
    
    // Check if required items are purchased
    const requiredItems = scenario.required;
    const purchasedItems = cart.map(item => item.name);
    const allRequiredPurchased = requiredItems.every(item => 
      purchasedItems.includes(item)
    );
    
    if (allRequiredPurchased) {
      score += 1;
    }
    
    // Check if within budget
    if (budget >= 0) {
      score += 1;
    }
    
    // Check if saved money (bonus point)
    if (budget > scenario.budget * 0.1) {
      score += 1;
    }
    
    const newScores = [...scores];
    newScores[currentScenario] = score;
    setScores(newScores);
    
    const message = score > 0 
      ? `Great job! You scored ${score}/3 points.` 
      : "Try again to improve your shopping strategy.";
      
    setFeedbackMessage(message);
    setIsSuccess(score > 0);
    
    setTimeout(() => {
      setFeedbackMessage('');
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
      } else {
        // For the last scenario, navigate after a delay
        setTimeout(() => {
          navigate('/games/financial-literacy/teen');
        }, 3000);
      }
    }, 2000);
  };

  const calculateTotalScore = () => {
    return scores.reduce((total, score) => total + score, 0);
  };

  const handleGameComplete = () => {
    navigate('/games/financial-literacy/teen');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <GameShell
      gameId="finance-teens-18"
      gameType="simulation"
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentScenario + 1}
      score={calculateTotalScore()}
      totalScore={scenarios.length * 3} // Max 3 points per scenario
      onGameComplete={handleGameComplete}
    >
      <div className="game-content">
        <h3 className="text-xl font-bold mb-6 text-indigo-700">Shopping Mall Simulation</h3>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">{scenarios[currentScenario].title}</h4>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-700">Budget: ${budget}</div>
              <div className="text-sm text-gray-600">Time: {formatTime(timeLeft)}</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-blue-800 mb-2">Scenario Goal:</h5>
            <p className="text-blue-700">{scenarios[currentScenario].goal}</p>
            {scenarios[currentScenario].required.length > 0 && (
              <p className="mt-2 text-blue-700">
                <span className="font-medium">Required items:</span> {scenarios[currentScenario].required.join(", ")}
              </p>
            )}
          </div>
          
          {feedbackMessage && (
            <div className={`p-4 rounded-lg mb-4 ${
              isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-medium">{feedbackMessage}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <h5 className="font-medium text-gray-800">{item.name}</h5>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-indigo-600 font-bold">${item.price}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.necessity === 'need' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.necessity}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  disabled={budget < item.price}
                  className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    budget >= item.price
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h5 className="font-medium text-gray-800 mb-3">Your Shopping Cart:</h5>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span>{item.name} - ${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Scenario {currentScenario + 1} of {scenarios.length}
          </span>
          <span className="font-medium text-indigo-700">
            Score: {calculateTotalScore()}/{scenarios.length * 3}
          </span>
        </div>
      </div>
    </GameShell>
  );
};

export default SimulationShoppingMall;