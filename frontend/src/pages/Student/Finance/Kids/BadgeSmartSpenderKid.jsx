import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSmartSpenderKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-20";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [scenario, setScenario] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
        },
        { 
          id: "split", 
          text: "Save half, share half", 
          emoji: "🤝", 
          description: "Save ₹250 and share ₹250 with siblings",
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
          id: "want", 
          text: "Buy because it's cheap", 
          emoji: "🛒", 
          description: "Buy because it's a good deal",
          isCorrect: false
        },
        { 
          id: "gift", 
          text: "Buy as a gift", 
          emoji: "🎁", 
          description: "Buy it to give as a gift to someone else",
          isCorrect: false
        },
        {
          id: "need",
          text: "Don't buy",
          emoji: "🙅",
          description: "Don't buy because you don't need another toy",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      title: "Shopping List",
      description: "You're going to the market with ₹300. What's the smart approach?",
      choices: [
        { 
          id: "impulse", 
          text: "Buy what looks good", 
          emoji: "🛍️", 
          description: "Buy things that catch your eye",
          isCorrect: false
        },
        {
          id: "plan",
          text: "Make a list first",
          emoji: "📋",
          description: "Plan what you need before shopping",
          isCorrect: true
        },
        { 
          id: "compare", 
          text: "Compare prices", 
          emoji: "🔍", 
          description: "Check different stores for better deals",
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
          id: "ignore", 
          text: "Buy for ₹50", 
          emoji: "💸", 
          description: "Buy from the first store you visited",
          isCorrect: false
        },
        { 
          id: "ask", 
          text: "Ask for advice", 
          emoji: "🙋", 
          description: "Ask parents which option is better",
          isCorrect: false
        },
        {
          id: "compare",
          text: "Buy for ₹40",
          emoji: "🔍",
          description: "Save ₹10 by choosing the cheaper option",
          isCorrect: true
        },
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
        },
        { 
          id: "substitute", 
          text: "Buy healthy snack", 
          emoji: "🥜", 
          description: "Choose a healthier alternative to candy",
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
    
    // If the choice is correct, show flash/confetti and update score
    const isCorrect = scenarios[scenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setFinalScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next scenario or show results
    if (scenario < scenarios.length - 1) {
      setTimeout(() => {
        setScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleNext = () => {
    // This is the last game, so navigate back to the finance games page
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentScenario = () => scenarios[scenario];

  return (
    <GameShell
      title="Badge: Smart Spender Kid"
      subtitle={showResult ? "Quiz Complete!" : `Scenario ${scenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      showGameOver={showResult}
      score={finalScore}
      nextEnabled={false}
      gameId="finance-kids-20"
      gameType="finance"
      totalLevels={scenarios.length}
      maxScore={scenarios.length} // Max score is total number of scenarios (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      currentLevel={scenario + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && getCurrentScenario() ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {scenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentScenario().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default BadgeSmartSpenderKid;