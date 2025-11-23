import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Shield, Wifi, Key, CreditCard, Smartphone, Lock, AlertTriangle, CheckCircle, XCircle, Eye, EyeOff, User, Mail } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";

const BadgeDigitalMoneySmart = () => {
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

  // Digital money safety scenarios
  const scenarios = [
    {
      id: 1,
      title: "Public WiFi Transaction",
      scenario: "You want to check your bank account balance while at a coffee shop with free WiFi",
      choices: [
        { id: 1, name: "Use the public WiFi to quickly check your balance", type: "unsafe", icon: Wifi },
        { id: 2, name: "Wait until you're on your secure mobile data", type: "safe", icon: Smartphone }
      ],
      correct: 2,
      explanation: "Public WiFi networks are often unsecured and can be intercepted by hackers. Always use secure connections for financial transactions."
    },
    {
      id: 2,
      title: "Password Security",
      scenario: "You need to create a password for a new digital wallet app",
      choices: [
        { id: 1, name: "Use '123456' because it's easy to remember", type: "unsafe", icon: Key },
        { id: 2, name: "Create a strong password with letters, numbers, and symbols", type: "safe", icon: Lock }
      ],
      correct: 2,
      explanation: "Weak passwords are easily guessed or cracked. Strong passwords protect your financial accounts from unauthorized access."
    },
    {
      id: 3,
      title: "Phishing Email",
      scenario: "You receive an email claiming to be from your bank asking for account details",
      choices: [
        { id: 1, name: "Click the link and enter your information", type: "unsafe", icon: Mail },
        { id: 2, name: "Delete the email and contact your bank directly", type: "safe", icon: Shield }
      ],
      correct: 2,
      explanation: "Phishing emails try to trick you into revealing personal information. Always verify requests through official channels."
    },
    {
      id: 4,
      title: "ATM Security",
      scenario: "You notice someone watching you at the ATM",
      choices: [
        { id: 1, name: "Continue with your transaction", type: "unsafe", icon: CreditCard },
        { id: 2, name: "Cancel and return when you're alone", type: "safe", icon: EyeOff }
      ],
      correct: 2,
      explanation: "Shoulder surfing is a common way thieves steal PINs. Always be aware of your surroundings during financial transactions."
    },
    {
      id: 5,
      title: "App Permissions",
      scenario: "A money management app requests access to your contacts and location",
      choices: [
        { id: 1, name: "Grant all permissions to use the app", type: "unsafe", icon: User },
        { id: 2, name: "Review and only grant necessary permissions", type: "safe", icon: Shield }
      ],
      correct: 2,
      explanation: "Apps should only have access to information they need. Review permissions to protect your privacy and security."
    },
    {
      id: 6,
      title: "Two-Factor Authentication",
      scenario: "Your bank offers two-factor authentication for online banking",
      choices: [
        { id: 1, name: "Skip it because it's inconvenient", type: "unsafe", icon: XCircle },
        { id: 2, name: "Enable it for extra security", type: "safe", icon: CheckCircle }
      ],
      correct: 2,
      explanation: "Two-factor authentication adds an extra layer of security that significantly reduces the risk of unauthorized access."
    },
    {
      id: 7,
      title: "Sharing Financial Info",
      scenario: "A friend asks to borrow your phone to make a quick payment",
      choices: [
        { id: 1, name: "Hand over your unlocked phone", type: "unsafe", icon: Smartphone },
        { id: 2, name: "Decline or supervise the transaction", type: "safe", icon: Eye }
      ],
      correct: 2,
      explanation: "Never give your unlocked device to others. Your financial information could be accessed or misused."
    },
    {
      id: 8,
      title: "Suspicious Transaction",
      scenario: "You notice an unfamiliar charge on your account",
      choices: [
        { id: 1, name: "Ignore it, assuming it's a mistake", type: "unsafe", icon: AlertTriangle },
        { id: 2, name: "Report it to your bank immediately", type: "safe", icon: Shield }
      ],
      correct: 2,
      explanation: "Report suspicious transactions immediately to minimize potential damage and begin the dispute process quickly."
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
    
    const isCorrect = choice.type === "safe";
    
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
      setFeedbackMessage(`Safe choice! +${points} points. Streak: ${newStreak}x`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage("Unsafe practice! Streak reset!");
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
    return type === "safe" 
      ? "bg-green-500/20 border-green-400 text-green-300" 
      : "bg-red-500/20 border-red-400 text-red-300";
  };

  const getTypeLabel = (type) => {
    return type === "safe" ? "Safe" : "Unsafe";
  };

  return (
    <GameShell
      gameId="finance-teens-100"
      gameType="achievement"
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentScenario + 1}
      score={totalScore}
      totalScore={800} // Max possible score
      onGameComplete={() => navigate("/games/financial-literacy/teen")}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)    
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="text-center text-white space-y-6">
        <h3 className="text-3xl font-bold mb-4">Digital Money Safety Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Become Digital Money Smart!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your knowledge of digital money safety in 8 real-world scenarios
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the safe digital money practice. 
                Build streaks for bonus points and become a Digital Money Master!
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
              Start Safety Challenge
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
                          <span className="text-green-300">✓ Safe practice</span>
                        ) : (
                          <span className="text-red-300">✗ Unsafe practice</span>
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
                <span className="font-bold">Tip:</span> When in doubt about a digital transaction, 
                take a moment to verify through official channels before proceeding.
              </p>
            </div>
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Digital Money Smart Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering digital money safety!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <p className="text-white/90">
                {totalScore >= 700 ? "🏆 Digital Security Expert!" : 
                 totalScore >= 500 ? "🥇 Financial Safety Pro!" : 
                 totalScore >= 300 ? "🥈 Smart Digital User!" : 
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
                <Lock className="mx-auto w-8 h-8 text-blue-400 mb-2" />
                <div className="font-bold">{streak}</div>
                <div className="text-xs text-white/80">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Trophy className="mx-auto w-8 h-8 text-purple-400 mb-2" />
                <div className="font-bold">{multiplier}x</div>
                <div className="text-xs text-white/80">Max Multiplier</div>
              </div>
            </div>
            
            <p className="text-white/80 mb-6">
              Lesson: Master safe digital transactions to protect your financial future!
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

export default BadgeDigitalMoneySmart;