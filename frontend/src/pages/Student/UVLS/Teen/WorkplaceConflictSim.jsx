import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WorkplaceConflictSim = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-37";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentAssignment, setCurrentAssignment] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const assignments = [
    {
      id: 1,
      conflict: "Intern vs senior task overlap.",
      emoji: "👔",
      roles: [
        { id: 1, text: "Balance tasks", balanced: true },
        { id: 2, text: "Intern does all", balanced: false },
        { id: 3, text: "Rotate duties", balanced: true },
        { id: 4, text: "Senior avoids work", balanced: false }
      ]
    },
    {
      id: 2,
      conflict: "Deadline pressure.",
      emoji: "⏰",
      roles: [
        { id: 1, text: "Prioritize and delegate", balanced: true },
        { id: 2, text: "Overwork one person", balanced: false },
        { id: 3, text: "Team overtime", balanced: true },
        { id: 4, text: "Miss deadline", balanced: false }
      ]
    },
    {
      id: 3,
      conflict: "Idea credit dispute.",
      emoji: "💡",
      roles: [
        { id: 1, text: "Acknowledge contributions", balanced: true },
        { id: 2, text: "Claim all credit", balanced: false },
        { id: 3, text: "Team recognition", balanced: true },
        { id: 4, text: "Ignore issue", balanced: false }
      ]
    },
    {
      id: 4,
      conflict: "Resource sharing.",
      emoji: "🛠️",
      roles: [
        { id: 1, text: "Schedule usage", balanced: true },
        { id: 2, text: "First come", balanced: false },
        { id: 3, text: "Equitable allocation", balanced: true },
        { id: 4, text: "Hoard resources", balanced: false }
      ]
    },
    {
      id: 5,
      conflict: "Feedback conflict.",
      emoji: "🗣️",
      roles: [
        { id: 1, text: "Constructive discussion", balanced: true },
        { id: 2, text: "Ignore feedback", balanced: false },
        { id: 3, text: "Mediate meeting", balanced: true },
        { id: 4, text: "Escalate to boss", balanced: false }
      ]
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (!selectedRole) return;

    const assignment = assignments[currentAssignment];
    const role = assignment.roles.find(r => r.id === selectedRole);
    
    const isBalanced = role.balanced;
    
    const newResponses = [...responses, {
      assignmentId: assignment.id,
      roleId: selectedRole,
      isBalanced,
      role: role.text
    }];
    
    setResponses(newResponses);
    
    if (isBalanced) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedRole(null);
    
    if (currentAssignment < assignments.length - 1) {
      setTimeout(() => {
        setCurrentAssignment(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const balancedCount = responses.filter(r => r.isBalanced).length;

  return (
    <GameShell
      title="Workplace Conflict Sim"
      subtitle={`Assignment ${currentAssignment + 1} of ${assignments.length}`}
      onNext={handleNext}
      nextEnabled={showResult && balancedCount >= 4}
      showGameOver={showResult && balancedCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-37"
      gameType="uvls"
      totalLevels={20}
      currentLevel={37}
      showConfetti={showResult && balancedCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{assignments[currentAssignment].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Conflict: {assignments[currentAssignment].conflict}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Assign role:</p>
              
              <div className="space-y-3 mb-6">
                {assignments[currentAssignment].roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedRole === role.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Assign
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {balancedCount >= 4 ? "🎉 Conflict Solver!" : "💪 More Balanced!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Balanced assignments: {balancedCount} out of {assignments.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {balancedCount >= 4 ? "Earned 5 Coins!" : "Need 4+ balanced."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Useful for internship prep.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WorkplaceConflictSim;