import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EthicalRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      dilemma: "Copy homework or do it yourself?",
      emoji: "📝",
      approaches: [
        { id: 1, text: "Copy", ethical: false },
        { id: 2, text: "Do yourself", ethical: true },
        { id: 3, text: "Ask for help", ethical: true },
        { id: 4, text: "Skip assignment", ethical: false }
      ]
    },
    {
      id: 2,
      dilemma: "Lie to friend or tell truth?",
      emoji: "🤥",
      approaches: [
        { id: 1, text: "Lie", ethical: false },
        { id: 2, text: "Tell truth kindly", ethical: true },
        { id: 3, text: "Avoid topic", ethical: false },
        { id: 4, text: "Be honest", ethical: true }
      ]
    },
    {
      id: 3,
      dilemma: "Cheat on test or study?",
      emoji: "📝",
      approaches: [
        { id: 1, text: "Cheat", ethical: false },
        { id: 2, text: "Study hard", ethical: true },
        { id: 3, text: "Guess answers", ethical: false },
        { id: 4, text: "Prepare ethically", ethical: true }
      ]
    },
    {
      id: 4,
      dilemma: "Steal small item or pay?",
      emoji: "🛒",
      approaches: [
        { id: 1, text: "Steal", ethical: false },
        { id: 2, text: "Pay for it", ethical: true },
        { id: 3, text: "Leave it", ethical: true },
        { id: 4, text: "Rationalize theft", ethical: false }
      ]
    },
    {
      id: 5,
      dilemma: "Gossip or stay silent?",
      emoji: "🗣️",
      approaches: [
        { id: 1, text: "Gossip", ethical: false },
        { id: 2, text: "Stay silent", ethical: true },
        { id: 3, text: "Defend person", ethical: true },
        { id: 4, text: "Spread rumor", ethical: false }
      ]
    }
  ];

  const handleApproachSelect = (approachId) => {
    setSelectedApproach(approachId);
  };

  const handleConfirm = () => {
    if (!selectedApproach) return;

    const scenario = scenarios[currentScenario];
    const approach = scenario.approaches.find(a => a.id === selectedApproach);
    
    const isEthical = approach.ethical;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      approachId: selectedApproach,
      isEthical,
      approach: approach.text
    }];
    
    setResponses(newResponses);
    
    if (isEthical) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedApproach(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      const ethicalCount = newResponses.filter(r => r.isEthical).length;
      if (ethicalCount >= 4) {
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

  const ethicalCount = responses.filter(r => r.isEthical).length;

  return (
    <GameShell
      title="Ethical Roleplay"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && ethicalCount >= 4}
      showGameOver={showResult && ethicalCount >= 4}
      score={0}
      gameId="decision-155"
      gameType="decision"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && ethicalCount >= 4}
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
                  {scenarios[currentScenario].dilemma}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose ethical approach:</p>
              
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].approaches.map(approach => (
                  <button
                    key={approach.id}
                    onClick={() => handleApproachSelect(approach.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedApproach === approach.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{approach.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedApproach}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedApproach
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Decide
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {ethicalCount >= 4 ? "🎉 Ethical Thinker!" : "💪 More Ethics!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Ethical choices: {ethicalCount} out of {scenarios.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {ethicalCount >= 4 ? "Earned Badge!" : "Need 4+ ethical."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Discuss pressure & incentives.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EthicalRoleplay;