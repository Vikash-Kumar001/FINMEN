import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CoalitionSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentStakeholder, setCurrentStakeholder] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const stakeholders = [
    {
      id: 1,
      stakeholder: "Local business.",
      emoji: "🏬",
      roles: [
        { id: 1, text: "Sponsor events", complementary: true },
        { id: 2, text: "No role", complementary: false },
        { id: 3, text: "Provide resources", complementary: true },
        { id: 4, text: "Compete", complementary: false }
      ]
    },
    {
      id: 2,
      stakeholder: "Community leaders.",
      emoji: "👥",
      roles: [
        { id: 1, text: "Mobilize people", complementary: true },
        { id: 2, text: "Ignore", complementary: false },
        { id: 3, text: "Advocate policy", complementary: true },
        { id: 4, text: "Oppose", complementary: false }
      ]
    },
    {
      id: 3,
      stakeholder: "Schools.",
      emoji: "🏫",
      roles: [
        { id: 1, text: "Educate students", complementary: true },
        { id: 2, text: "No involvement", complementary: false },
        { id: 3, text: "Host events", complementary: true },
        { id: 4, text: "Block access", complementary: false }
      ]
    },
    {
      id: 4,
      stakeholder: "NGOs.",
      emoji: "🤝",
      roles: [
        { id: 1, text: "Expertise sharing", complementary: true },
        { id: 2, text: "Duplicate efforts", complementary: false },
        { id: 3, text: "Funding support", complementary: true },
        { id: 4, text: "Compete for funds", complementary: false }
      ]
    },
    {
      id: 5,
      stakeholder: "Government.",
      emoji: "🏛️",
      roles: [
        { id: 1, text: "Policy support", complementary: true },
        { id: 2, text: "Bureaucracy", complementary: false },
        { id: 3, text: "Grants", complementary: true },
        { id: 4, text: "Regulations block", complementary: false }
      ]
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (!selectedRole) return;

    const stakeholder = stakeholders[currentStakeholder];
    const role = stakeholder.roles.find(r => r.id === selectedRole);
    
    const isComplementary = role.complementary;
    
    const newResponses = [...responses, {
      stakeholderId: stakeholder.id,
      roleId: selectedRole,
      isComplementary,
      role: role.text
    }];
    
    setResponses(newResponses);
    
    if (isComplementary) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedRole(null);
    
    if (currentStakeholder < stakeholders.length - 1) {
      setTimeout(() => {
        setCurrentStakeholder(prev => prev + 1);
      }, 1500);
    } else {
      const complementaryCount = newResponses.filter(r => r.isComplementary).length;
      if (complementaryCount >= 4) {
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

  const complementaryCount = responses.filter(r => r.isComplementary).length;

  return (
    <GameShell
      title="Coalition Simulation"
      subtitle={`Stakeholder ${currentStakeholder + 1} of ${stakeholders.length}`}
      onNext={handleNext}
      nextEnabled={showResult && complementaryCount >= 4}
      showGameOver={showResult && complementaryCount >= 4}
      score={coins}
      gameId="civic-188"
      gameType="civic"
      totalLevels={10}
      currentLevel={8}
      showConfetti={showResult && complementaryCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{stakeholders[currentStakeholder].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Stakeholder: {stakeholders[currentStakeholder].stakeholder}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Negotiate role:</p>
              
              <div className="space-y-3 mb-6">
                {stakeholders[currentStakeholder].roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedRole === role.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{role.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedRole}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedRole
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Recruit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {complementaryCount >= 4 ? "🎉 Coalition Builder!" : "💪 More Complementary!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Complementary strengths: {complementaryCount} out of {stakeholders.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {complementaryCount >= 4 ? "Earned 5 Coins!" : "Need 4+ complementary."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach stakeholder mapping.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CoalitionSimulation;