import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Heart, Users, Scale, Leaf, Zap, Coins, ShoppingCart, Target, AlertTriangle, CheckCircle, XCircle, Wallet, PiggyBank, HandHeart, Award } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeEthicalFinancier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-200";
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
  const [ethicalScore, setEthicalScore] = useState(0); // Ethical decision score

  // Ethical finance scenarios
  const scenarios = [
    {
      id: 1,
      title: "Sustainable Shopping",
      scenario: "You need new clothes but discovered your favorite brand uses child labor",
      choices: [
        { 
          id: 1, 
          name: "Continue buying from them because prices are low", 
          type: "unethical", 
          icon: ShoppingCart,
          impact: -100 // Ethical cost
        },
        { 
          id: 2, 
          name: "Choose ethically-made alternatives even if they cost more", 
          type: "ethical", 
          icon: Leaf,
          impact: 200 // Ethical benefit
        }
      ],
      correct: 2,
      explanation: "Ethical consumers consider the social and environmental impact of their purchases. Choosing ethically-made products supports fair labor practices and sustainable production, even if it costs more.",
      ethicalData: [0, 50, 100, 200, 150, 300] // Ethical score growth
    },
    {
      id: 2,
      title: "Financial Advice",
      scenario: "A friend asks for investment advice, but you're not qualified to give it",
      choices: [
        { 
          id: 1, 
          name: "Give advice anyway to help your friend", 
          type: "unethical", 
          icon: AlertTriangle,
          impact: -150 // Risk of harm
        },
        { 
          id: 2, 
          name: "Recommend consulting a qualified financial advisor", 
          type: "ethical", 
          icon: Scale,
          impact: 180 // Responsible guidance
        }
      ],
      correct: 2,
      explanation: "Providing financial advice without proper qualifications can harm others. Ethical behavior involves referring people to qualified professionals when you lack expertise.",
      ethicalData: [300, 320, 350, 380, 420, 450] // Ethical score growth
    },
    {
      id: 3,
      title: "Community Investment",
      scenario: "You have ₹10,000 to invest and must choose between two opportunities",
      choices: [
        { 
          id: 1, 
          name: "Invest in a company with high returns but polluting practices", 
          type: "unethical", 
          icon: Zap,
          impact: -200 // Environmental harm
        },
        { 
          id: 2, 
          name: "Invest in a local green business with moderate returns", 
          type: "ethical", 
          icon: Leaf,
          impact: 150 // Community benefit
        }
      ],
      correct: 2,
      explanation: "Ethical investing considers environmental and social impact alongside financial returns. Supporting sustainable businesses contributes to a better future, even with moderate financial returns.",
      ethicalData: [450, 470, 500, 550, 620, 700] // Ethical score growth
    },
    {
      id: 4,
      title: "Charitable Giving",
      scenario: "You receive a bonus and want to donate to charity",
      choices: [
        { 
          id: 1, 
          name: "Donate anonymously to avoid recognition", 
          type: "ethical", 
          icon: Heart,
          impact: 120 // Genuine altruism
        },
        { 
          id: 2, 
          name: "Donate publicly to gain social recognition", 
          type: "unethical", 
          icon: Award,
          impact: -80 // Self-serving motive
        }
      ],
      correct: 1,
      explanation: "Ethical giving is motivated by genuine desire to help others, not personal recognition. Anonymous donations ensure the focus remains on helping those in need rather than personal benefit.",
      ethicalData: [700, 720, 750, 780, 820, 850] // Ethical score growth
    },
    {
      id: 5,
      title: "Financial Transparency",
      scenario: "You accidentally overpaid a vendor by ₹500 and they haven't noticed",
      choices: [
        { 
          id: 1, 
          name: "Keep quiet and let them keep the money", 
          type: "unethical", 
          icon: Wallet,
          impact: -180 // Dishonesty
        },
        { 
          id: 2, 
          name: "Inform them immediately and request a refund", 
          type: "ethical", 
          icon: CheckCircle,
          impact: 250 // Integrity
        }
      ],
      correct: 2,
      explanation: "Ethical financial behavior requires honesty even when it's costly. Returning overpayments demonstrates integrity and builds trust in financial relationships.",
      ethicalData: [850, 870, 900, 950, 1000, 1150] // Ethical score growth
    },
    {
      id: 6,
      title: "Fair Employment",
      scenario: "You can hire either a qualified local worker or get cheaper labor overseas",
      choices: [
        { 
          id: 1, 
          name: "Choose cheaper overseas labor to maximize profits", 
          type: "unethical", 
          icon: Zap,
          impact: -120 // Local community impact
        },
        { 
          id: 2, 
          name: "Hire locally to support your community despite higher costs", 
          type: "ethical", 
          icon: Users,
          impact: 220 // Community support
        }
      ],
      correct: 2,
      explanation: "Ethical employers consider their impact on local communities. Supporting local employment strengthens the community even if it means accepting lower profits.",
      ethicalData: [1150, 1200, 1280, 1380, 1500, 1650] // Ethical score growth
    },
    {
      id: 7,
      title: "Environmental Responsibility",
      scenario: "Your business can increase profits by using cheaper, non-recyclable packaging",
      choices: [
        { 
          id: 1, 
          name: "Switch to cheaper packaging to boost profits", 
          type: "unethical", 
          icon: ShoppingCart,
          impact: -250 // Environmental harm
        },
        { 
          id: 2, 
          name: "Continue using eco-friendly packaging despite higher costs", 
          type: "ethical", 
          icon: Leaf,
          impact: 280 // Environmental stewardship
        }
      ],
      correct: 2,
      explanation: "Ethical businesses consider long-term environmental impact over short-term profits. Sustainable practices protect the planet for future generations, even if they increase costs.",
      ethicalData: [1650, 1700, 1780, 1880, 2000, 2150] // Ethical score growth
    },
    {
      id: 8,
      title: "Financial Inclusion",
      scenario: "You're developing a financial app and must decide on pricing structure",
      choices: [
        { 
          id: 1, 
          name: "Charge high fees that exclude low-income users", 
          type: "unethical", 
          icon: XCircle,
          impact: -300 // Exclusion
        },
        { 
          id: 2, 
          name: "Offer affordable options to include all income levels", 
          type: "ethical", 
          icon: HandHeart,
          impact: 350 // Inclusion
        }
      ],
      correct: 2,
      explanation: "Ethical financial services promote inclusion and accessibility. Designing products for all income levels helps reduce financial inequality and supports economic empowerment.",
      ethicalData: [2150, 2200, 2300, 2450, 2650, 2900] // Ethical score growth
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'challenge' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'challenge' && selectedChoice === null) {
      // Time's up, auto-select the unethical option
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
    setEthicalScore(0);
  };

  const handleChoiceSelect = (choice) => {
    if (gameState !== 'challenge' || selectedChoice !== null) return;
    
    resetFeedback();
    setSelectedChoice(choice);
    setShowExplanation(true);
    
    const isCorrect = choice.type === "ethical";
    
    // Update ethical score based on choice
    const newEthicalScore = ethicalScore + choice.impact;
    setEthicalScore(Math.max(0, newEthicalScore)); // Ensure score doesn't go negative
    
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
      setFeedbackMessage(`Ethical choice! +${points} points. Ethical Score: ${newEthicalScore}`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage(`Unethical decision! Ethical Score: ${newEthicalScore}. Streak reset!`);
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
        setFeedbackMessage(`Game complete! Final ethical score: ${Math.max(0, newEthicalScore)}. Total score: ${totalScore + (isCorrect ? 35 * multiplier : 0)}`);
        setIsSuccess(true);
      }
    }, 3500);
  };

  const getTypeColor = (type) => {
    return type === "ethical" 
      ? "bg-green-500/20 border-green-400 text-green-300" 
      : "bg-red-500/20 border-red-400 text-red-300";
  };

  const getTypeLabel = (type) => {
    return type === "ethical" ? "Ethical Choice" : "Unethical Choice";
  };

  // Simple ethical score chart component
  const EthicalChart = ({ data }) => {
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
      title="Ethical Financier Challenge"
      gameId="finance-teens-200"
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
        <h3 className="text-3xl font-bold mb-4">Ethical Financier Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Master Ethical Finance!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your ethical decision-making in 8 real-world financial scenarios
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the ethical financial practice. 
                Build streaks for bonus points and increase your ethical score!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="font-bold text-green-300">Ethical Choice</div>
                <div className="text-sm text-white/80">Morally responsible decisions</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Unethical Choice</div>
                <div className="text-sm text-white/80">Morally questionable decisions</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Ethical Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">Ethical Dilemma {currentScenario + 1}</h4>
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
              <p className="text-blue-200 text-lg font-medium mb-2">Moral Challenge:</p>
              <p className="text-blue-100">{scenarios[currentScenario].scenario}</p>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-purple-200">Ethical Score</div>
                <div className="text-2xl font-bold text-yellow-400">{ethicalScore}</div>
              </div>
              <EthicalChart data={scenarios[currentScenario].ethicalData} />
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
                const isCorrectChoice = choice.type === "ethical";
                
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
                          <span className="text-green-300">✓ Ethical financial practice</span>
                        ) : (
                          <span className="text-red-300">✗ Unethical financial practice</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {showExplanation && (
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400 mb-4">
                <p className="font-bold text-yellow-200 mb-1">Ethical Insight:</p>
                <p className="text-yellow-100">{scenarios[currentScenario].explanation}</p>
              </div>
            )}
            
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-gray-300 text-sm">
                <span className="font-bold">Ethical Finance Tip:</span> True financial success considers people and planet alongside profit. 
                Ethical decisions create long-term value for all stakeholders.
              </p>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Ethical Financier Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering ethical financial decision-making!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <div className="text-2xl font-bold text-green-400 mb-4">Final Ethical Score: {ethicalScore}</div>
              <p className="text-white/90">
                {totalScore >= 1000 ? "🏆 Ethical Finance Guru!" : 
                 totalScore >= 800 ? "🥇 Responsible Financier!" : 
                 totalScore >= 600 ? "🥈 Conscious Consumer!" : 
                 "🥉 Keep Learning!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <Heart className="mx-auto w-8 h-8 text-green-400 mb-2" />
                <div className="font-bold">{scenarios.length}</div>
                <div className="text-xs text-white/80">Scenarios</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <Scale className="mx-auto w-8 h-8 text-blue-400 mb-2" />
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
              <h4 className="font-bold text-blue-200 mb-2">Key Ethical Finance Principles:</h4>
              <ul className="text-blue-100 text-left list-disc pl-5 space-y-1">
                <li>Consider social and environmental impact of financial decisions</li>
                <li>Provide guidance within your area of expertise</li>
                <li>Invest in sustainable and socially responsible businesses</li>
                <li>Give charitably without expecting recognition</li>
                <li>Maintain honesty and transparency in all financial dealings</li>
                <li>Support local communities through employment and investment</li>
                <li>Prioritize long-term sustainability over short-term profits</li>
                <li>Promote financial inclusion and accessibility for all</li>
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

export default BadgeEthicalFinancier;