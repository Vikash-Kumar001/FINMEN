import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartHomeSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    { 
      id: 1, 
      description: "You enter the living room and the lights turn ON automatically.", 
      emoji: "💡" 
    },
    { 
      id: 2, 
      description: "You enter the bedroom and the fan starts running.", 
      emoji: "🌀" 
    },
    { 
      id: 3, 
      description: "You enter the kitchen and the coffee machine starts brewing.", 
      emoji: "☕" 
    },
    { 
      id: 4, 
      description: "You enter the hallway and the heater turns ON.", 
      emoji: "🔥" 
    },
    { 
      id: 5, 
      description: "You enter the study room and the smart speaker plays music.", 
      emoji: "🎵" 
    }
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleAIDidIt = () => {
    showCorrectAnswerFeedback(5, true);
    setCoins(prev => prev + 5);

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => setCurrentScenario(prev => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/ai-explorer-badge"); // next game
  };

  const scenario = scenarios[currentScenario];

  return (
    <GameShell
      title="Smart Home Simulation 🏠"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleFinish}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="ai-teen-50"
      gameType="ai"
      totalLevels={20}
      currentLevel={50}
      showConfetti={showResult}
      backPath="/games/ai-for-all/teens"
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{scenario.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {scenario.description}
            </h2>

            <p className="text-white/80 mb-6 text-center">
              Click below if you think AI triggered the action:
            </p>

            <button
              onClick={handleAIDidIt}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 transition"
            >
              AI Did It! 🤖
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🤖</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Smart Home Completed!
            </h2>
            
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 AI controls your smart home devices, turning lights, fans, coffee machines, heaters, and music on automatically as you enter the room. 
                This makes homes smarter, safer, and energy-efficient!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartHomeSimulation;
