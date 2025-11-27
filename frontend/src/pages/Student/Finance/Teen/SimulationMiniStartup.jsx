import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMiniStartup = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-78");
  const gameId = gameData?.id || "finance-teens-78";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationMiniStartup, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Mini Startup: Snack Stall",
      description: "You have ₹500 to start a snack stall. Buy ingredients (₹300), profit ₹200. Smart?",
      capital: 500,
      cost: 300,
      profit: 200,
      options: [
        { 
          id: "yes", 
          text: "Yes, smart investment", 
          emoji: "💡", 
          description: "40% profit is good",
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe, depends", 
          emoji: "🤔", 
          description: "Need more info",
          isCorrect: false
        },
        { 
          id: "no", 
          text: "No, too risky", 
          emoji: "⚠️", 
          description: "Business is risky",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Mini Startup: Craft Business",
      description: "You have ₹400. Spend ₹250 on materials, sell for ₹400. Good?",
      capital: 400,
      cost: 250,
      profit: 150,
      options: [
        { 
          id: "no2", 
          text: "No, not worth it", 
          emoji: "😕", 
          description: "Too small profit",
          isCorrect: false
        },
        { 
          id: "yes2", 
          text: "Yes, 60% profit", 
          emoji: "💡", 
          description: "Excellent return",
          isCorrect: true
        },
        { 
          id: "maybe2", 
          text: "Maybe, if repeatable", 
          emoji: "🤷", 
          description: "Only if consistent",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Mini Startup: Lemonade Stand",
      description: "You have ₹300. Spend ₹150 on supplies, earn ₹250. Smart?",
      capital: 300,
      cost: 150,
      profit: 100,
      options: [
        { 
          id: "no3", 
          text: "No, too small", 
          emoji: "😕", 
          description: "Not enough money",
          isCorrect: false
        },
        { 
          id: "maybe3", 
          text: "Maybe, if fun", 
          emoji: "😊", 
          description: "Only for enjoyment",
          isCorrect: false
        },
        { 
          id: "yes3", 
          text: "Yes, 67% profit", 
          emoji: "💡", 
          description: "Great return",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Mini Startup: Book Resale",
      description: "You have ₹600. Buy books for ₹400, sell for ₹600. Good?",
      capital: 600,
      cost: 400,
      profit: 200,
      options: [
        { 
          id: "yes4", 
          text: "Yes, 50% profit", 
          emoji: "💡", 
          description: "Good return",
          isCorrect: true
        },
        { 
          id: "no4", 
          text: "No, too slow", 
          emoji: "⏳", 
          description: "Takes too long",
          isCorrect: false
        },
        { 
          id: "maybe4", 
          text: "Maybe, if easy", 
          emoji: "🤷", 
          description: "Only if simple",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Mini Startup: Tutoring Service",
      description: "You have ₹500. Spend ₹200 on materials, charge ₹500. Smart?",
      capital: 500,
      cost: 200,
      profit: 300,
      options: [
        { 
          id: "no5", 
          text: "No, too much work", 
          emoji: "😴", 
          description: "Requires effort",
          isCorrect: false
        },
        { 
          id: "yes5", 
          text: "Yes, 150% profit", 
          emoji: "💡", 
          description: "Excellent return",
          isCorrect: true
        },
        { 
          id: "maybe5", 
          text: "Maybe, if skilled", 
          emoji: "🎓", 
          description: "Only if good at teaching",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const scenario = scenarios[currentScenario];
    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Mini Startup"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Capital:</span>
                    <span className="text-green-400 font-bold">₹{current.capital}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-3">
                    <span className="text-white font-semibold">Cost:</span>
                    <span className="text-red-400 font-bold">₹{current.cost}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-3">
                    <span className="text-white font-semibold">Profit:</span>
                    <span className="text-yellow-400 font-bold">₹{current.profit}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {current.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                      <p className="text-sm opacity-90">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Decision!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You understand mini startup economics!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Mini startups can be smart investments when you have good profit margins (40%+). Always calculate profit = Revenue - Cost!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember, profit = Revenue - Cost, and 40%+ profit is good!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Calculate profit = Revenue - Cost. If you invest ₹300 and earn ₹500, that's ₹200 profit (67% return) - that's smart!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMiniStartup;
