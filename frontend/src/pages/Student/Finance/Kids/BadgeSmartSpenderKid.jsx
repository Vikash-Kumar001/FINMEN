import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeSmartSpenderKid = () => {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Birthday Money",
      description: "You received ₹500 as a birthday gift. What do you do?",
      choices: [
        { 
          id: "save", 
          text: "Save ₹300, spend ₹200", 
          emoji: "💰", 
          description: "Save most of it for future needs",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on toys", 
          emoji: "🧸", 
          description: "Buy toys and treats with all the money",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sale Offer",
      description: "Your favorite toy is on 50% off, but you already have similar toys. Do you buy it?",
      choices: [
        { 
          id: "need", 
          text: "Don't buy", 
          emoji: "🙅", 
          description: "Don't buy because you don't need another toy",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy because it's cheap", 
          emoji: "🛒", 
          description: "Buy because it's a good deal",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Shopping List",
      description: "You're going to the market with ₹300. What's the smart approach?",
      choices: [
        { 
          id: "plan", 
          text: "Make a list first", 
          emoji: "📋", 
          description: "Plan what you need before shopping",
          isCorrect: true
        },
        { 
          id: "impulse", 
          text: "Buy what looks good", 
          emoji: "🛍️", 
          description: "Buy things that catch your eye",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Comparing Prices",
      description: "The same notebook is ₹50 at one store and ₹40 at another. Which do you choose?",
      choices: [
        { 
          id: "compare", 
          text: "Buy for ₹40", 
          emoji: "🔍", 
          description: "Save ₹10 by choosing the cheaper option",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Buy for ₹50", 
          emoji: "💸", 
          description: "Buy from the first store you visited",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Impulse Purchase",
      description: "You planned to buy fruits for ₹100 but see candy on the way. What do you do?",
      choices: [
        { 
          id: "stick", 
          text: "Buy only fruits", 
          emoji: "🍎", 
          description: "Stick to your original plan",
          isCorrect: true
        },
        { 
          id: "add", 
          text: "Buy fruits and candy", 
          emoji: "🍬", 
          description: "Add candy to your purchase",
          isCorrect: false
        }
      ]
    }
  ];

  const handleDecision = (selectedChoice) => {
    const newDecisions = [...decisions, { 
      scenarioId: scenarios[scenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setDecisions(newDecisions);
    
    // If the choice is correct, show flash/confetti
    const isCorrect = scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next scenario or show results
    if (scenario < scenarios.length - 1) {
      setTimeout(() => {
        setScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctDecisions = newDecisions.filter(decision => decision.isCorrect).length;
      setFinalScore(correctDecisions);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setScenario(0);
    setDecisions([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    // This is the last game, so navigate back to the finance games page
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentScenario = () => scenarios[scenario];

  // Calculate progress
  const progress = Math.round(((scenario + 1) / scenarios.length) * 100);

  return (
    <GameShell
      title="Badge: Smart Spender Kid"
      subtitle={showResult ? "Achievement Complete!" : `Scenario ${scenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={finalScore}
      gameId="finance-kids-20"
      gameType="finance"
      totalLevels={10}
      currentLevel={10}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-4">
                <div className="flex justify-between text-white/80 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentScenario().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentScenario().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleDecision(choice.id)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{choice.emoji}</div>
                    <h4 className="font-bold text-xl mb-2">{choice.text}</h4>
                    <p className="text-white/90">{choice.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Smart Spender Kid!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart spending decisions out of {scenarios.length} scenarios!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Smart Spender Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Smart Choices</h4>
                    <p className="text-white/90">
                      You chose to save money, make shopping lists, compare prices, and stick to needs over wants.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90">
                      These habits will help you make smart financial decisions throughout your life!
                    </p>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6">
                  Congratulations on completing all 10 finance games! You're well on your way to becoming financially literate.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart spending decisions out of {scenarios.length} scenarios.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, smart spending means thinking about needs vs wants, saving money, 
                  comparing prices, and making plans before buying.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSmartSpenderKid;