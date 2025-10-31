import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PolicyPuzzle = () => {
  const navigate = useNavigate();
  const [currentPolicy, setCurrentPolicy] = useState(0);
  const [selectedImprovement, setSelectedImprovement] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const policies = [
    {
      id: 1,
      policy: "No phones in school.",
      emoji: "📱",
      improvements: [
        { id: 1, text: "Allow educational use", feasible: true },
        { id: 2, text: "Ban all tech", feasible: false },
        { id: 3, text: "Phone zones", feasible: true },
        { id: 4, text: "Ignore rule", feasible: false }
      ]
    },
    {
      id: 2,
      policy: "Uniform required.",
      emoji: "👕",
      improvements: [
        { id: 1, text: "Casual Fridays", feasible: true },
        { id: 2, text: "No uniforms", feasible: false },
        { id: 3, text: "Customize uniforms", feasible: true },
        { id: 4, text: "Strict enforcement", feasible: false }
      ]
    },
    {
      id: 3,
      policy: "Homework every day.",
      emoji: "📚",
      improvements: [
        { id: 1, text: "Reduce load", feasible: true },
        { id: 2, text: "More homework", feasible: false },
        { id: 3, text: "Project-based", feasible: true },
        { id: 4, text: "No homework", feasible: false }
      ]
    },
    {
      id: 4,
      policy: "No recess for misbehavior.",
      emoji: "🏃",
      improvements: [
        { id: 1, text: "Alternative activities", feasible: true },
        { id: 2, text: "Longer punishment", feasible: false },
        { id: 3, text: "Counseling instead", feasible: true },
        { id: 4, text: "Ignore behavior", feasible: false }
      ]
    },
    {
      id: 5,
      policy: "Grading on curve.",
      emoji: "📊",
      improvements: [
        { id: 1, text: "Absolute grading", feasible: true },
        { id: 2, text: "No grades", feasible: false },
        { id: 3, text: "Mixed system", feasible: true },
        { id: 4, text: "Curve stricter", feasible: false }
      ]
    }
  ];

  const handleImprovementSelect = (improvementId) => {
    setSelectedImprovement(improvementId);
  };

  const handleConfirm = () => {
    if (!selectedImprovement) return;

    const policy = policies[currentPolicy];
    const improvement = policy.improvements.find(i => i.id === selectedImprovement);
    
    const isFeasible = improvement.feasible;
    
    const newResponses = [...responses, {
      policyId: policy.id,
      improvementId: selectedImprovement,
      isFeasible,
      improvement: improvement.text
    }];
    
    setResponses(newResponses);
    
    if (isFeasible) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedImprovement(null);
    
    if (currentPolicy < policies.length - 1) {
      setTimeout(() => {
        setCurrentPolicy(prev => prev + 1);
      }, 1500);
    } else {
      const feasibleCount = newResponses.filter(r => r.isFeasible).length;
      if (feasibleCount >= 4) {
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

  const feasibleCount = responses.filter(r => r.isFeasible).length;

  return (
    <GameShell
      title="Policy Puzzle"
      subtitle={`Policy ${currentPolicy + 1} of ${policies.length}`}
      onNext={handleNext}
      nextEnabled={showResult && feasibleCount >= 4}
      showGameOver={showResult && feasibleCount >= 4}
      score={coins}
      gameId="decision-159"
      gameType="decision"
      totalLevels={10}
      currentLevel={9}
      showConfetti={showResult && feasibleCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{policies[currentPolicy].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Policy: {policies[currentPolicy].policy}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Suggest improvement:</p>
              
              <div className="space-y-3 mb-6">
                {policies[currentPolicy].improvements.map(improvement => (
                  <button
                    key={improvement.id}
                    onClick={() => handleImprovementSelect(improvement.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedImprovement === improvement.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{improvement.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedImprovement}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedImprovement
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Suggest
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {feasibleCount >= 4 ? "🎉 Policy Improver!" : "💪 More Feasible!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Feasible improvements: {feasibleCount} out of {policies.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {feasibleCount >= 4 ? "Earned 5 Coins!" : "Need 4+ feasible."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Collate proposals for admin review.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PolicyPuzzle;