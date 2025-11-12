import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Coins, PiggyBank, Wallet, ShoppingCart, Home, Car, GraduationCap, Heart } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";

const BadgeBudgetHero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('intro'); // intro, challenge, completed
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userChoices, setUserChoices] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Budgeting challenges
  const challenges = [
    {
      id: 1,
      title: "Back-to-School Budget",
      income: 200,
      expenses: [
        { id: 1, name: "Textbooks", amount: 80, icon: GraduationCap, priority: "essential" },
        { id: 2, name: "Backpack", amount: 40, icon: ShoppingCart, priority: "important" },
        { id: 3, name: "Designer Sneakers", amount: 120, icon: Car, priority: "want" },
        { id: 4, name: "Lunch Money", amount: 30, icon: Home, priority: "essential" },
        { id: 5, name: "Gadgets", amount: 100, icon: ShoppingCart, priority: "want" }
      ],
      goal: "Allocate your $200 wisely for school needs",
      tip: "Prioritize essential items first, then important ones"
    },
    {
      id: 2,
      title: "Monthly Allowance Challenge",
      income: 150,
      expenses: [
        { id: 1, name: "Savings", amount: 50, icon: PiggyBank, priority: "essential" },
        { id: 2, name: "Movie Tickets", amount: 25, icon: Heart, priority: "want" },
        { id: 3, name: "New Clothes", amount: 60, icon: ShoppingCart, priority: "important" },
        { id: 4, name: "Snacks", amount: 20, icon: Home, priority: "essential" },
        { id: 5, name: "Video Game", amount: 40, icon: ShoppingCart, priority: "want" }
      ],
      goal: "Balance saving with spending on wants",
      tip: "Always pay yourself first by saving before spending"
    },
    {
      id: 3,
      title: "Emergency Fund Setup",
      income: 100,
      expenses: [
        { id: 1, name: "Emergency Savings", amount: 40, icon: PiggyBank, priority: "essential" },
        { id: 2, name: "Phone Bill", amount: 30, icon: ShoppingCart, priority: "essential" },
        { id: 3, name: "Concert Tickets", amount: 50, icon: Heart, priority: "want" },
        { id: 4, name: "New Headphones", amount: 35, icon: ShoppingCart, priority: "important" },
        { id: 5, name: "Coffee Shop", amount: 15, icon: Home, priority: "want" }
      ],
      goal: "Build an emergency fund while covering necessary expenses",
      tip: "Emergency funds should be your top priority after essential expenses"
    },
    {
      id: 4,
      title: "Family Outing Budget",
      income: 120,
      expenses: [
        { id: 1, name: "Transportation", amount: 25, icon: Car, priority: "essential" },
        { id: 2, name: "Meals", amount: 40, icon: Home, priority: "essential" },
        { id: 3, name: "Souvenirs", amount: 30, icon: ShoppingCart, priority: "want" },
        { id: 4, name: "Activities", amount: 35, icon: Heart, priority: "important" },
        { id: 5, name: "Snacks", amount: 10, icon: Home, priority: "essential" }
      ],
      goal: "Plan a fun family outing within budget",
      tip: "Essential expenses come first, then allocate remaining funds for fun"
    },
    {
      id: 5,
      title: "Teen Entrepreneur Budget",
      income: 180,
      expenses: [
        { id: 1, name: "Business Supplies", amount: 50, icon: ShoppingCart, priority: "essential" },
        { id: 2, name: "Marketing", amount: 30, icon: Wallet, priority: "important" },
        { id: 3, name: "New Laptop", amount: 120, icon: ShoppingCart, priority: "want" },
        { id: 4, name: "Savings", amount: 40, icon: PiggyBank, priority: "essential" },
        { id: 5, name: "Business Training", amount: 35, icon: GraduationCap, priority: "important" }
      ],
      goal: "Invest in your business while saving for the future",
      tip: "Invest in your business growth, but don't forget to save"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'challenge' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'challenge') {
      // Time's up, move to next challenge or complete game
      handleChallengeComplete();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('challenge');
    setCurrentChallenge(0);
    setScore(0);
    setTotalScore(0);
    setTimeLeft(30);
    setUserChoices([]);
  };

  const selectExpense = (expense) => {
    if (gameState !== 'challenge') return;
    
    resetFeedback();
    
    // Check if expense is already selected
    const isSelected = userChoices.some(choice => choice.id === expense.id);
    
    if (isSelected) {
      // Remove expense
      setUserChoices(userChoices.filter(choice => choice.id !== expense.id));
      setScore(score - expense.amount);
    } else {
      // Add expense if within budget
      if (score + expense.amount <= challenges[currentChallenge].income) {
        setUserChoices([...userChoices, expense]);
        setScore(score + expense.amount);
        showCorrectAnswerFeedback(10, true);
        setFeedbackMessage(`+10 points! Added ${expense.name}`);
        setIsSuccess(true);
      } else {
        setFeedbackMessage("Not enough budget for this item!");
        setIsSuccess(false);
      }
    }
    
    // Clear feedback after delay
    setTimeout(() => {
      setFeedbackMessage('');
    }, 1500);
  };

  const handleChallengeComplete = () => {
    // Calculate points for this challenge
    const challengePoints = calculateChallengePoints();
    setTotalScore(totalScore + challengePoints);
    
    if (currentChallenge < challenges.length - 1) {
      // Move to next challenge
      setCurrentChallenge(currentChallenge + 1);
      setScore(0);
      setUserChoices([]);
      setTimeLeft(30);
      setFeedbackMessage(`Challenge complete! +${challengePoints} points`);
      setIsSuccess(true);
      
      setTimeout(() => {
        setFeedbackMessage('');
      }, 2000);
    } else {
      // Game completed
      setGameState('completed');
      setFeedbackMessage(`Game complete! Total score: ${totalScore + challengePoints}`);
      setIsSuccess(true);
    }
  };

  const calculateChallengePoints = () => {
    // Points based on how well they budgeted
    const selectedEssential = userChoices.filter(item => item.priority === 'essential').length;
    const selectedImportant = userChoices.filter(item => item.priority === 'important').length;
    const selectedWant = userChoices.filter(item => item.priority === 'want').length;
    
    // Base points for essential items
    let points = selectedEssential * 20;
    
    // Bonus points for important items if budget allows
    points += selectedImportant * 15;
    
    // Penalty for wants if budget is tight
    if (score > challenges[currentChallenge].income * 0.8) {
      points -= selectedWant * 10;
    } else if (selectedWant > 0) {
      points += selectedWant * 5; // Small bonus for reasonable wants
    }
    
    // Bonus for staying within budget
    if (score <= challenges[currentChallenge].income) {
      points += 30;
    }
    
    return Math.max(0, points); // Ensure non-negative points
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'essential': return 'bg-red-100 text-red-800 border-red-300';
      case 'important': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'want': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'essential': return 'Essential';
      case 'important': return 'Important';
      case 'want': return 'Want';
      default: return 'Other';
    }
  };

  return (
    <GameShell
      gameId="finance-teens-60"
      gameType="achievement"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentChallenge + 1}
      score={totalScore}
      totalScore={500} // Max possible score
      onGameComplete={() => navigate("/games/financial-literacy/teen")}
    >
      <div className="text-center text-white space-y-6">
        <h3 className="text-3xl font-bold mb-4">Budget Hero Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Become a Budget Hero!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your budgeting skills with 5 real-life financial challenges
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each challenge, allocate your income wisely by selecting expenses. 
                Prioritize essentials, balance wants, and stay within budget!
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Budgeting Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">{challenges[currentChallenge].title}</h4>
                <p className="text-white/80">{challenges[currentChallenge].goal}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">${score} / ${challenges[currentChallenge].income}</div>
                <div className="text-lg font-semibold text-red-400">{timeLeft}s</div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm">
                <span className="font-bold">Tip:</span> {challenges[currentChallenge].tip}
              </p>
            </div>
            
            {feedbackMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                isSuccess ? 'bg-green-500/30 text-green-200 border border-green-400' : 'bg-red-500/30 text-red-200 border border-red-400'
              }`}>
                {feedbackMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {challenges[currentChallenge].expenses.map((expense) => {
                const IconComponent = expense.icon;
                const isSelected = userChoices.some(choice => choice.id === expense.id);
                
                return (
                  <button
                    key={expense.id}
                    onClick={() => selectExpense(expense)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected 
                        ? 'bg-green-500/30 border-green-400 transform scale-[1.02]' 
                        : 'bg-white/5 hover:bg-white/10 border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className="w-6 h-6 mr-3 text-white" />
                        <div>
                          <div className="font-bold">{expense.name}</div>
                          <div className="text-sm">${expense.amount}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(expense.priority)}`}>
                        {getPriorityLabel(expense.priority)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="text-sm text-white/70">Selected Items: {userChoices.length}</div>
              </div>
              <button
                onClick={handleChallengeComplete}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
              >
                Finish Challenge
              </button>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Budget Hero Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering budgeting challenges!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <p className="text-white/90">
                {totalScore >= 400 ? "🏆 Budgeting Master!" : 
                 totalScore >= 300 ? "🥇 Financial Expert!" : 
                 totalScore >= 200 ? "🥈 Smart Budgeter!" : 
                 "🥉 Keep Practicing!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <Coins className="mx-auto w-8 h-8 text-green-400 mb-2" />
                <div className="font-bold">{challenges.length}</div>
                <div className="text-xs text-white/80">Challenges</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <PiggyBank className="mx-auto w-8 h-8 text-blue-400 mb-2" />
                <div className="font-bold">{userChoices.length}</div>
                <div className="text-xs text-white/80">Items Selected</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Wallet className="mx-auto w-8 h-8 text-purple-400 mb-2" />
                <div className="font-bold">${challenges[currentChallenge].income * challenges.length}</div>
                <div className="text-xs text-white/80">Total Budget</div>
              </div>
            </div>
            
            <p className="text-white/80 mb-6">
              Lesson: Smart budgeting leads to financial success!
            </p>
            
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

export default BadgeBudgetHero;