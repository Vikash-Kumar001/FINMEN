import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToughBargainRoleplay = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      resource: "Limited tickets to event.",
      emoji: "🎟️",
      trades: [
        { id: 1, text: "Share costs", fair: true },
        { id: 2, text: "Take all", fair: false },
        { id: 3, text: "Alternate events", fair: true },
        { id: 4, text: "Fight for them", fair: false }
      ]
    },
    {
      id: 2,
      resource: "Group budget for trip.",
      emoji: "✈️",
      trades: [
        { id: 1, text: "Prioritize activities", fair: true },
        { id: 2, text: "Spend on one thing", fair: false },
        { id: 3, text: "Vote on spending", fair: true },
        { id: 4, text: "Leader decides", fair: false }
      ]
    },
    {
      id: 3,
      resource: "Time for project.",
      emoji: "⏰",
      trades: [
        { id: 1, text: "Divide tasks evenly", fair: true },
        { id: 2, text: "One does all", fair: false },
        { id: 3, text: "Schedule meetings", fair: true },
        { id: 4, text: "Procrastinate", fair: false }
      ]
    },
    {
      id: 4,
      resource: "Shared room space.",
      emoji: "🛏️",
      trades: [
        { id: 1, text: "Divide space fairly", fair: true },
        { id: 2, text: "Claim more", fair: false },
        { id: 3, text: "Rotate usage", fair: true },
        { id: 4, text: "Ignore other", fair: false }
      ]
    },
    {
      id: 5,
      resource: "Limited food at party.",
      emoji: "🍕",
      trades: [
        { id: 1, text: "Portion equally", fair: true },
        { id: 2, text: "First come first", fair: false },
        { id: 3, text: "Share plates", fair: true },
        { id: 4, text: "Hoard food", fair: false }
      ]
    }
  ];

  const handleTradeSelect = (tradeId) => {
    setSelectedTrade(tradeId);
  };

  const handleConfirm = () => {
    if (!selectedTrade) return;

    const scenario = scenarios[currentScenario];
    const trade = scenario.trades.find(t => t.id === selectedTrade);
    
    const isFair = trade.fair;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      tradeId: selectedTrade,
      isFair,
      trade: trade.text
    }];
    
    setResponses(newResponses);
    
    if (isFair) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedTrade(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      const fairCount = newResponses.filter(r => r.isFair).length;
      if (fairCount >= 4) {
        setBadge(true);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const fairCount = responses.filter(r => r.isFair).length;

  return (
    <GameShell
      title="Tough Bargain Roleplay"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && fairCount >= 4}
      showGameOver={showResult && fairCount >= 4}
      score={0}
      gameId="conflict-175"
      gameType="conflict"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && fairCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Resource: {scenarios[currentScenario].resource}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Negotiate trade-off:</p>
              
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].trades.map(trade => (
                  <button
                    key={trade.id}
                    onClick={() => handleTradeSelect(trade.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedTrade === trade.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{trade.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedTrade}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedTrade
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Bargain
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {fairCount >= 4 ? "🎉 Bargain Master!" : "💪 More Fair!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Fair trade-offs: {fairCount} out of {scenarios.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {fairCount >= 4 ? "Earned Badge!" : "Need 4+ fair."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Debrief on value creation.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ToughBargainRoleplay;