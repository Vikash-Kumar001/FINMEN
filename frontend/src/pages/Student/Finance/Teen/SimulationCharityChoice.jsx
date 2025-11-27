import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationCharityChoice = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-98");
  const gameId = gameData?.id || "finance-teens-98";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationCharityChoice, using fallback ID");
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
      title: "Charity Choice: ₹1000 Budget",
      description: "You have ₹1000. Spend all on gadgets or donate ₹200 + save ₹300 + spend ₹500?",
      options: [
        { 
          id: "all-gadgets", 
          text: "Spend all on gadgets", 
          emoji: "📱", 
          description: "Buy everything",
          isCorrect: false
        },
        { 
          id: "balanced", 
          text: "Donate ₹200 + Save ₹300 + Spend ₹500", 
          emoji: "⚖️", 
          description: "Balanced approach",
          isCorrect: true
        },
        { 
          id: "save-all", 
          text: "Save all ₹1000", 
          emoji: "💰", 
          description: "Keep everything",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Charity Choice: ₹500 Budget",
      description: "You have ₹500. Options: Spend all, or Donate ₹100 + Save ₹200 + Spend ₹200?",
      options: [
        { 
          id: "balanced2", 
          text: "Donate ₹100 + Save ₹200 + Spend ₹200", 
          emoji: "✨", 
          description: "Balanced choice",
          isCorrect: true
        },
        { 
          id: "spend-all2", 
          text: "Spend all ₹500", 
          emoji: "💸", 
          description: "Use everything",
          isCorrect: false
        },
        { 
          id: "donate-all", 
          text: "Donate all ₹500", 
          emoji: "💝", 
          description: "Give everything",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Charity Choice: ₹2000 Budget",
      description: "You have ₹2000. Spend all on wants or Donate ₹400 + Save ₹600 + Spend ₹1000?",
      options: [
        { 
          id: "spend-all3", 
          text: "Spend all on wants", 
          emoji: "🛍️", 
          description: "Buy everything",
          isCorrect: false
        },
        { 
          id: "balanced3", 
          text: "Donate ₹400 + Save ₹600 + Spend ₹1000", 
          emoji: "🎯", 
          description: "Smart balance",
          isCorrect: true
        },
        { 
          id: "save-all2", 
          text: "Save all ₹2000", 
          emoji: "🏦", 
          description: "Keep everything",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Charity Choice: ₹800 Budget",
      description: "You have ₹800. Options: All on entertainment or Donate ₹150 + Save ₹250 + Spend ₹400?",
      options: [
        { 
          id: "balanced4", 
          text: "Donate ₹150 + Save ₹250 + Spend ₹400", 
          emoji: "⚖️", 
          description: "Balanced plan",
          isCorrect: true
        },
        { 
          id: "entertainment", 
          text: "All on entertainment", 
          emoji: "🎮", 
          description: "Fun only",
          isCorrect: false
        },
        { 
          id: "no-donate", 
          text: "No donation, save all", 
          emoji: "💾", 
          description: "Keep everything",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Charity Choice: ₹1500 Budget",
      description: "You have ₹1500. Spend all on shopping or Donate ₹300 + Save ₹450 + Spend ₹750?",
      options: [
        { 
          id: "shopping", 
          text: "Spend all on shopping", 
          emoji: "🛒", 
          description: "Buy everything",
          isCorrect: false
        },
        { 
          id: "balanced5", 
          text: "Donate ₹300 + Save ₹450 + Spend ₹750", 
          emoji: "🌟", 
          description: "Responsible choice",
          isCorrect: true
        },
        { 
          id: "only-donate", 
          text: "Donate all ₹1500", 
          emoji: "❤️", 
          description: "Give everything",
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

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Charity Choice"
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationCharityChoice;
