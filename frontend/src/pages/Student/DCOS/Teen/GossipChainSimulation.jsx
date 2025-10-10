import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GossipChainSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [stoppedRumor, setStoppedRumor] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const steps = [
    {
      id: 1,
      chat: "Group Chat 1",
      message: "Did you hear? Alex failed the exam!",
      emoji: "💬",
      actions: [
        { id: 1, text: "Forward to another group", stops: false },
        { id: 2, text: "Stop and don't share", stops: true },
        { id: 3, text: "Ask if it's true first", stops: true }
      ]
    },
    {
      id: 2,
      chat: "Group Chat 2",
      message: "Someone said Alex cheated on the exam",
      emoji: "📱",
      actions: [
        { id: 1, text: "Share with more friends", stops: false },
        { id: 2, text: "Stop the rumor", stops: true },
        { id: 3, text: "Add your own details", stops: false }
      ]
    },
    {
      id: 3,
      chat: "Group Chat 3",
      message: "Everyone's saying Alex is a cheater",
      emoji: "💥",
      actions: [
        { id: 1, text: "Spread it further", stops: false },
        { id: 2, text: "Defend Alex and stop rumor", stops: true },
        { id: 3, text: "Stay silent", stops: false }
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  const handleAction = (actionId) => {
    setSelectedAction(actionId);
  };

  const handleConfirm = () => {
    const action = currentStepData.actions.find(a => a.id === selectedAction);
    
    if (action.stops) {
      setStoppedRumor(true);
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowResult(true);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedAction(null);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/debate-stage-trolling");
  };

  return (
    <GameShell
      title="Gossip Chain Simulation"
      subtitle={!showResult ? `Chat ${currentStep + 1} of ${steps.length}` : "Rumor Result"}
      onNext={handleNext}
      nextEnabled={showResult && stoppedRumor}
      showGameOver={showResult && stoppedRumor}
      score={coins}
      gameId="dcos-teen-13"
      gameType="dcos"
      totalLevels={20}
      currentLevel={13}
      showConfetti={showResult && stoppedRumor}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{currentStepData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStepData.chat}</h2>
            
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg font-semibold text-center">
                "{currentStepData.message}"
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What will you do?</h3>
            
            <div className="space-y-3 mb-6">
              {currentStepData.actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedAction === action.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-center">{action.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAction}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAction
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Action
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{stoppedRumor ? "🛡️" : "💔"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {stoppedRumor ? "🌟 Rumor Stopped!" : "😢 Rumor Spread"}
            </h2>
            
            {stoppedRumor ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! You stopped the rumor from spreading further. Gossip and rumors can 
                    destroy reputations and cause serious emotional harm. Always verify information 
                    and refuse to spread unconfirmed stories. You protected Alex!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    The rumor spread across {currentStep + 1} group chats and hurt Alex's reputation. 
                    Gossip causes real damage - anxiety, depression, and social isolation. Always 
                    stop rumors, don't spread them!
                  </p>
                </div>
                <p className="text-white/70 text-center">Choose to stop rumors early next time!</p>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GossipChainSimulation;

