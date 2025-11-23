import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmpathyAIRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      message: "I am sad 😢",
      correctAction: "Comfort",
    },
    {
      id: 2,
      message: "I feel lonely 🥺",
      correctAction: "Talk",
    },
    {
      id: 3,
      message: "I am frustrated 😠",
      correctAction: "Encourage",
    },
    {
      id: 4,
      message: "I am anxious 😰",
      correctAction: "Reassure",
    },
    {
      id: 5,
      message: "I am excited but nervous 😃😬",
      correctAction: "Celebrate",
    }
  ];

  const currentData = scenarios[currentScenario];
  const [selectedAction, setSelectedAction] = useState(null);

  const handleAction = (action) => {
    setSelectedAction(action);
  };

  const handleConfirm = () => {
    if (selectedAction === currentData.correctAction) {
      showCorrectAnswerFeedback(1, true); // 1 coin per scenario for total 5
      setCoins(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedAction(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/teen/ai-career-quiz");
    }
  };

  const handleTryAgain = () => {
    setSelectedAction(null);
    setShowFeedback(false);
    setCoins(0);
    setCurrentScenario(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="Empathy & AI Roleplay"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentScenario === scenarios.length - 1}
      score={coins}
      gameId="ai-teen-21"
      gameType="ai"
      totalLevels={21}
      currentLevel={21}
      showConfetti={showFeedback}
      backPath="/games/ai-for-all/teens"
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">AI says:</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg text-center font-semibold">{currentData.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {["Comfort", "Talk", "Encourage", "Reassure", "Celebrate"].map(action => (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  className={`border-2 rounded-xl p-5 transition-all text-center font-semibold text-white ${
                    selectedAction === action
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAction}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAction
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Action
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedAction === currentData.correctAction ? "💖" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedAction === currentData.correctAction ? "Well done!" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {currentData.message} → You chose: {selectedAction}
            </p>

            {selectedAction === currentData.correctAction ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 1 Coin! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Scenario
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyAIRoleplay;
