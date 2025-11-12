import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PowerDynamicsScenario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      conflict: "Teacher unfair grading.",
      emoji: "📝",
      steps: [
        { id: 1, text: "Discuss privately", equitable: true },
        { id: 2, text: "Complain publicly", equitable: false },
        { id: 3, text: "Provide evidence", equitable: true },
        { id: 4, text: "Ignore", equitable: false }
      ]
    },
    {
      id: 2,
      conflict: "Boss assigns extra work.",
      emoji: "👔",
      steps: [
        { id: 1, text: "Negotiate workload", equitable: true },
        { id: 2, text: "Quit job", equitable: false },
        { id: 3, text: "Seek HR help", equitable: true },
        { id: 4, text: "Overwork silently", equitable: false }
      ]
    },
    {
      id: 3,
      conflict: "Parent restricts freedom.",
      emoji: "🏠",
      steps: [
        { id: 1, text: "Calm discussion", equitable: true },
        { id: 2, text: "Rebel", equitable: false },
        { id: 3, text: "Compromise plan", equitable: true },
        { id: 4, text: "Sneak out", equitable: false }
      ]
    },
    {
      id: 4,
      conflict: "Coach favors players.",
      emoji: "🏀",
      steps: [
        { id: 1, text: "Talk to coach", equitable: true },
        { id: 2, text: "Quit team", equitable: false },
        { id: 3, text: "Gather team support", equitable: true },
        { id: 4, text: "Accept favoritism", equitable: false }
      ]
    },
    {
      id: 5,
      conflict: "Admin ignores complaint.",
      emoji: "🏫",
      steps: [
        { id: 1, text: "Escalate to higher", equitable: true },
        { id: 2, text: "Give up", equitable: false },
        { id: 3, text: "Document and follow up", equitable: true },
        { id: 4, text: "Spread rumors", equitable: false }
      ]
    }
  ];

  const handleStepSelect = (stepId) => {
    setSelectedStep(stepId);
  };

  const handleConfirm = () => {
    if (!selectedStep) return;

    const scenario = scenarios[currentScenario];
    const step = scenario.steps.find(s => s.id === selectedStep);
    
    const isEquitable = step.equitable;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      stepId: selectedStep,
      isEquitable,
      step: step.text
    }];
    
    setResponses(newResponses);
    
    if (isEquitable) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedStep(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      const equitableCount = newResponses.filter(r => r.isEquitable).length;
      if (equitableCount >= 4) {
        setCoins(5);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const equitableCount = responses.filter(r => r.isEquitable).length;

  return (
    <GameShell
      title="Power Dynamics Scenario"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && equitableCount >= 4}
      showGameOver={showResult && equitableCount >= 4}
      score={coins}
      gameId="conflict-171"
      gameType="conflict"
      totalLevels={10}
      currentLevel={1}
      showConfetti={showResult && equitableCount >= 4}
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
                  {scenarios[currentScenario].conflict}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose step:</p>
              
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].steps.map(step => (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedStep === step.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{step.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedStep}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Resolve
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {equitableCount >= 4 ? "🎉 Fair Resolver!" : "💪 More Equitable!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Equitable solutions: {equitableCount} out of {scenarios.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {equitableCount >= 4 ? "Earned 5 Coins!" : "Need 4+ equitable."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Discuss safeguards & escalation.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PowerDynamicsScenario;