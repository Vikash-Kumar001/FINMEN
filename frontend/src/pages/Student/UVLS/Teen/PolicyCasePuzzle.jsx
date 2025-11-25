import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PolicyCasePuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-19";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [simulationRun, setSimulationRun] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const schoolCase = {
    title: "School Inclusion Challenge",
    description: "Several students with diverse needs report feeling excluded from activities. As a student leader, recommend 3 policy actions to improve inclusion.",
    emoji: "🏫"
  };

  const policyOptions = [
    {
      id: 1,
      policy: "Implement mandatory diversity and inclusion training for all students",
      evidenceBased: true,
      outcome: "Students develop better understanding and empathy. Incidents decrease by 40%.",
      impact: 25
    },
    {
      id: 2,
      policy: "Create student-led inclusion committees",
      evidenceBased: true,
      outcome: "Peer-driven initiatives create lasting cultural change. Engagement increases.",
      impact: 30
    },
    {
      id: 3,
      policy: "Just tell students to be nicer",
      evidenceBased: false,
      outcome: "Vague directive has minimal impact. Problems continue.",
      impact: 5
    },
    {
      id: 4,
      policy: "Establish clear anti-discrimination policies with consequences",
      evidenceBased: true,
      outcome: "Clear boundaries reduce incidents. Students feel safer.",
      impact: 30
    },
    {
      id: 5,
      policy: "Provide accessible materials and flexible participation options",
      evidenceBased: true,
      outcome: "Students with different needs can participate fully. Satisfaction increases.",
      impact: 25
    },
    {
      id: 6,
      policy: "Ignore the problem and hope it goes away",
      evidenceBased: false,
      outcome: "Issues worsen. Students feel unheard and excluded.",
      impact: -10
    },
    {
      id: 7,
      policy: "Celebrate diversity through cultural awareness events",
      evidenceBased: true,
      outcome: "Students learn to appreciate differences. Community strengthens.",
      impact: 20
    },
    {
      id: 8,
      policy: "Segregate students by ability or background",
      evidenceBased: false,
      outcome: "Creates divisions and reinforces stereotypes. Inclusion worsens.",
      impact: -15
    }
  ];

  const handlePolicyToggle = (policyId) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter(id => id !== policyId));
    } else if (selectedPolicies.length < 3) {
      setSelectedPolicies([...selectedPolicies, policyId]);
    }
  };

  const handleRunSimulation = () => {
    const selectedOptions = policyOptions.filter(p => selectedPolicies.includes(p.id));
    const totalImpact = selectedOptions.reduce((sum, policy) => sum + policy.impact, 0);
    const evidenceBasedCount = selectedOptions.filter(p => p.evidenceBased).length;
    
    setOutcomes(selectedOptions.map(p => ({ policy: p.policy, outcome: p.outcome })));
    
    if (evidenceBasedCount === 3 && totalImpact >= 60) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSimulationRun(true);
    setTimeout(() => {
      setShowResult(true);
    }, 2000);
  };

  const handleRevise = () => {
    setSimulationRun(false);
    setOutcomes([]);
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/respect-leader-badge");
  };

  const selectedOptions = policyOptions.filter(p => selectedPolicies.includes(p.id));
  const totalImpact = selectedOptions.reduce((sum, policy) => sum + policy.impact, 0);
  const evidenceBasedCount = selectedOptions.filter(p => p.evidenceBased).length;

  return (
    <GameShell
      title="Policy Case Puzzle"
      subtitle="Recommend Inclusive Policies"
      onNext={handleNext}
      nextEnabled={showResult && evidenceBasedCount === 3 && totalImpact >= 60}
      showGameOver={showResult && evidenceBasedCount === 3 && totalImpact >= 60}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-19"
      gameType="uvls"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showResult && evidenceBasedCount === 3 && totalImpact >= 60}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!simulationRun ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-4 mb-6">
                <div className="text-4xl mb-2 text-center">{schoolCase.emoji}</div>
                <h3 className="text-white text-xl font-bold mb-2 text-center">{schoolCase.title}</h3>
                <p className="text-white/90 text-sm text-center">{schoolCase.description}</p>
              </div>
              
              <h3 className="text-white text-lg font-bold mb-4">
                Choose 3 Policy Actions ({selectedPolicies.length}/3)
              </h3>
              
              <div className="space-y-3 mb-6">
                {policyOptions.map(policy => (
                  <button
                    key={policy.id}
                    onClick={() => handlePolicyToggle(policy.id)}
                    disabled={!selectedPolicies.includes(policy.id) && selectedPolicies.length >= 3}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPolicies.includes(policy.id)
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${!selectedPolicies.includes(policy.id) && selectedPolicies.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-white font-medium text-sm flex-1">{policy.policy}</span>
                      {policy.evidenceBased && (
                        <span className="ml-2 text-xs px-2 py-1 bg-blue-500/50 rounded">Evidence-based</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleRunSimulation}
                disabled={selectedPolicies.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPolicies.length === 3
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Run Simulation! 📊
              </button>
            </div>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Simulation Outcomes</h3>
            
            <div className="space-y-4 mb-6">
              {outcomes.map((outcome, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4">
                  <p className="text-blue-300 font-semibold mb-2 text-sm">{outcome.policy}</p>
                  <p className="text-white/80 text-xs">{outcome.outcome}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-lg p-4 mb-4">
              <p className="text-white text-lg font-bold">
                Total Impact: {totalImpact}%
              </p>
              <p className="text-white/80 text-sm">
                Evidence-Based Policies: {evidenceBasedCount}/3
              </p>
            </div>

            {totalImpact < 60 && (
              <button
                onClick={handleRevise}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Revise Policies 🔄
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {evidenceBasedCount === 3 && totalImpact >= 60 ? "🎉 Policy Expert!" : "💪 Try Evidence-Based Policies!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Impact Score: {totalImpact}%
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {evidenceBasedCount === 3 && totalImpact >= 60 ? "You earned 3 Coins! 🪙" : "Choose 3 evidence-based policies for coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Collate students' policy proposals and present them to school administration!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PolicyCasePuzzle;

