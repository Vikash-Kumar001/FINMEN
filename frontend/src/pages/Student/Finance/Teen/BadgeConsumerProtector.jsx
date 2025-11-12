import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Shield, AlertTriangle, CheckCircle, XCircle, Lock, Eye, EyeOff, Key, Mail, Phone, CreditCard, User, Wallet, Smartphone, Globe, Zap } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";

const BadgeConsumerProtector = () => {
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
  const [protectionLevel, setProtectionLevel] = useState(0); // Consumer protection level

  // Fraud protection scenarios
  const scenarios = [
    {
      id: 1,
      title: "Phishing Email",
      scenario: "You receive an email claiming to be from your bank asking for your account details immediately",
      choices: [
        { 
          id: 1, 
          name: "Click the link and enter your information", 
          type: "unsafe", 
          icon: XCircle,
          impact: -200 // Security risk
        },
        { 
          id: 2, 
          name: "Verify through official bank website or call customer service", 
          type: "safe", 
          icon: Shield,
          impact: 150 // Safe practice
        }
      ],
      correct: 2,
      explanation: "Phishing emails try to trick you into revealing personal information. Always verify requests through official channels rather than clicking links in suspicious emails.",
      protectionData: [0, 20, 40, 60, 80, 100] // Protection level increase
    },
    {
      id: 2,
      title: "Online Shopping",
      scenario: "An online store offers a popular gadget at 70% off MSRP with 'limited time offer'",
      choices: [
        { 
          id: 1, 
          name: "Buy immediately to get the deal", 
          type: "unsafe", 
          icon: Zap,
          impact: -150 // Scam risk
        },
        { 
          id: 2, 
          name: "Research the store and read reviews before purchasing", 
          type: "safe", 
          icon: CheckCircle,
          impact: 120 // Smart shopping
        }
      ],
      correct: 2,
      explanation: "Too-good-to-be-true deals are often scams. Research sellers and read reviews from multiple sources before making purchases, especially from unfamiliar websites.",
      protectionData: [100, 120, 140, 160, 180, 200] // Protection level increase
    },
    {
      id: 3,
      title: "Public WiFi Security",
      scenario: "You need to check your bank account while at a coffee shop with free WiFi",
      choices: [
        { 
          id: 1, 
          name: "Use the public WiFi to quickly check your balance", 
          type: "unsafe", 
          icon: Globe,
          impact: -180 // Security risk
        },
        { 
          id: 2, 
          name: "Wait until you're on secure mobile data or use bank app", 
          type: "safe", 
          icon: Lock,
          impact: 140 // Secure practice
        }
      ],
      correct: 2,
      explanation: "Public WiFi networks are often unsecured and can be intercepted by hackers. Use secure connections or mobile data for financial transactions.",
      protectionData: [200, 220, 240, 260, 280, 300] // Protection level increase
    },
    {
      id: 4,
      title: "ATM Security",
      scenario: "You notice someone acting suspiciously near the ATM while you're using it",
      choices: [
        { 
          id: 1, 
          name: "Continue with your transaction quickly", 
          type: "unsafe", 
          icon: AlertTriangle,
          impact: -160 // Security risk
        },
        { 
          id: 2, 
          name: "Cancel transaction and report suspicious behavior", 
          type: "safe", 
          icon: Shield,
          impact: 130 // Safe practice
        }
      ],
      correct: 2,
      explanation: "Shoulder surfing and skimming devices are common ATM fraud tactics. If you notice suspicious behavior, cancel your transaction and report it immediately.",
      protectionData: [300, 320, 340, 360, 380, 400] // Protection level increase
    },
    {
      id: 5,
      title: "Social Media Scams",
      scenario: "A friend's social media account posts about a 'guaranteed investment opportunity' with high returns",
      choices: [
        { 
          id: 1, 
          name: "Message your friend to ask about the investment", 
          type: "unsafe", 
          icon: User,
          impact: -140 // Account may be compromised
        },
        { 
          id: 2, 
          name: "Call your friend directly to verify before engaging", 
          type: "safe", 
          icon: Phone,
          impact: 110 // Verification practice
        }
      ],
      correct: 2,
      explanation: "Social media accounts are frequently hacked to promote scams. Always verify through a different communication channel before engaging with suspicious posts.",
      protectionData: [400, 420, 440, 460, 480, 500] // Protection level increase
    },
    {
      id: 6,
      title: "Credit Card Protection",
      scenario: "You receive a call from someone claiming to be from your credit card company about 'suspicious activity'",
      choices: [
        { 
          id: 1, 
          name: "Provide account details to verify your identity", 
          type: "unsafe", 
          icon: CreditCard,
          impact: -190 // Identity theft risk
        },
        { 
          id: 2, 
          name: "Hang up and call the number on your card directly", 
          type: "safe", 
          icon: Phone,
          impact: 160 // Safe verification
        }
      ],
      correct: 2,
      explanation: "Legitimate companies will never ask for full account details over the phone. Always initiate contact with financial institutions using official numbers.",
      protectionData: [500, 520, 540, 560, 580, 600] // Protection level increase
    },
    {
      id: 7,
      title: "Password Security",
      scenario: "You need to create a password for a new financial app",
      choices: [
        { 
          id: 1, 
          name: "Use '123456' because it's easy to remember", 
          type: "unsafe", 
          icon: Key,
          impact: -170 // Weak security
        },
        { 
          id: 2, 
          name: "Create a strong password with letters, numbers, and symbols", 
          type: "safe", 
          icon: Lock,
          impact: 140 // Strong security
        }
      ],
      correct: 2,
      explanation: "Weak passwords are easily guessed or cracked. Strong passwords with a mix of characters significantly reduce the risk of unauthorized access.",
      protectionData: [600, 620, 640, 660, 680, 700] // Protection level increase
    },
    {
      id: 8,
      title: "Two-Factor Authentication",
      scenario: "Your bank offers two-factor authentication for online banking",
      choices: [
        { 
          id: 1, 
          name: "Skip it because it's inconvenient", 
          type: "unsafe", 
          icon: XCircle,
          impact: -130 // Security gap
        },
        { 
          id: 2, 
          name: "Enable it for extra security protection", 
          type: "safe", 
          icon: CheckCircle,
          impact: 120 // Enhanced security
        }
      ],
      correct: 2,
      explanation: "Two-factor authentication adds an extra layer of security that significantly reduces the risk of unauthorized access, even if your password is compromised.",
      protectionData: [700, 720, 740, 760, 780, 800] // Protection level increase
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'challenge' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'challenge' && selectedChoice === null) {
      // Time's up, auto-select the unsafe option
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
    setProtectionLevel(0);
  };

  const handleChoiceSelect = (choice) => {
    if (gameState !== 'challenge' || selectedChoice !== null) return;
    
    resetFeedback();
    setSelectedChoice(choice);
    setShowExplanation(true);
    
    const isCorrect = choice.type === "safe";
    
    // Update protection level based on choice
    const newProtection = protectionLevel + choice.impact;
    setProtectionLevel(Math.max(0, newProtection)); // Ensure protection doesn't go negative
    
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
      setFeedbackMessage(`Safe choice! +${points} points. Protection Level: ${newProtection}`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage(`Unsafe practice! Protection Level: ${newProtection}. Streak reset!`);
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
        setFeedbackMessage(`Game complete! Final protection level: ${Math.max(0, newProtection)}. Total score: ${totalScore + (isCorrect ? 30 * multiplier : 0)}`);
        setIsSuccess(true);
      }
    }, 3500);
  };

  const getTypeColor = (type) => {
    return type === "safe" 
      ? "bg-green-500/20 border-green-400 text-green-300" 
      : "bg-red-500/20 border-red-400 text-red-300";
  };

  const getTypeLabel = (type) => {
    return type === "safe" ? "Safe Practice" : "Unsafe Practice";
  };

  // Simple protection level chart component
  const ProtectionChart = ({ data }) => {
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
      title="Consumer Protector Challenge"
      gameId="finance-teens-180"
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
        <h3 className="text-3xl font-bold mb-4">Consumer Protector Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Master Consumer Protection!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your fraud protection knowledge in 8 real-world scenarios
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the safe consumer practice. 
                Build streaks for bonus points and increase your protection level!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="font-bold text-green-300">Safe Practice</div>
                <div className="text-sm text-white/80">Protects your financial information</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Unsafe Practice</div>
                <div className="text-sm text-white/80">Puts your money at risk</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Protection Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">Fraud Scenario {currentScenario + 1}</h4>
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
              <p className="text-blue-200 text-lg font-medium mb-2">Fraud Situation:</p>
              <p className="text-blue-100">{scenarios[currentScenario].scenario}</p>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-purple-200">Protection Level</div>
                <div className="text-2xl font-bold text-yellow-400">{protectionLevel}</div>
              </div>
              <ProtectionChart data={scenarios[currentScenario].protectionData} />
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
                const isCorrectChoice = choice.type === "safe";
                
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
                          <span className="text-green-300">✓ Safe consumer practice</span>
                        ) : (
                          <span className="text-red-300">✗ Unsafe consumer practice</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {showExplanation && (
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400 mb-4">
                <p className="font-bold text-yellow-200 mb-1">Protection Insight:</p>
                <p className="text-yellow-100">{scenarios[currentScenario].explanation}</p>
              </div>
            )}
            
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-gray-300 text-sm">
                <span className="font-bold">Consumer Tip:</span> When in doubt about a financial transaction, 
                take a moment to verify through official channels before proceeding.
              </p>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Consumer Protector Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering fraud protection!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <div className="text-2xl font-bold text-green-400 mb-4">Final Protection Level: {protectionLevel}</div>
              <p className="text-white/90">
                {totalScore >= 900 ? "🏆 Fraud Prevention Expert!" : 
                 totalScore >= 700 ? "🥇 Financial Security Pro!" : 
                 totalScore >= 500 ? "🥈 Smart Consumer!" : 
                 "🥉 Keep Learning!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <Shield className="mx-auto w-8 h-8 text-green-400 mb-2" />
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
              <h4 className="font-bold text-blue-200 mb-2">Key Consumer Protection Principles:</h4>
              <ul className="text-blue-100 text-left list-disc pl-5 space-y-1">
                <li>Verify requests through official channels</li>
                <li>Research sellers and read reviews before purchasing</li>
                <li>Use secure connections for financial transactions</li>
                <li>Report suspicious behavior immediately</li>
                <li>Verify through different communication channels</li>
                <li>Never share account details over the phone</li>
                <li>Use strong, unique passwords for each account</li>
                <li>Enable two-factor authentication whenever possible</li>
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

export default BadgeConsumerProtector;