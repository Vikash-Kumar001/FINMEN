import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MediationSimulation = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-59";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMediation, setSelectedMediation] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const steps = [
    {
      id: 1,
      dispute: "Classroom seating conflict.",
      emoji: "🪑",
      mediations: [
        { id: 1, text: "Listen to both sides", consensus: true },
        { id: 2, text: "Decide for them", consensus: false },
        { id: 3, text: "Find compromise", consensus: true },
        { id: 4, text: "Ignore", consensus: false }
      ]
    },
    {
      id: 2,
      dispute: "Group project roles.",
      emoji: "👥",
      mediations: [
        { id: 1, text: "Discuss preferences", consensus: true },
        { id: 2, text: "Assign randomly", consensus: false },
        { id: 3, text: "Vote on roles", consensus: true },
        { id: 4, text: "Leader decides", consensus: false }
      ]
    },
    {
      id: 3,
      dispute: "Playground game rules.",
      emoji: "⚽",
      mediations: [
        { id: 1, text: "Agree on rules", consensus: true },
        { id: 2, text: "One person dictates", consensus: false },
        { id: 3, text: "Compromise changes", consensus: true },
        { id: 4, text: "Stop playing", consensus: false }
      ]
    },
    {
      id: 4,
      dispute: "Lunch table seating.",
      emoji: "🍽️",
      mediations: [
        { id: 1, text: "Rotate seats", consensus: true },
        { id: 2, text: "Fixed seats", consensus: false },
        { id: 3, text: "Group decision", consensus: true },
        { id: 4, text: "Fight for seats", consensus: false }
      ]
    },
    {
      id: 5,
      dispute: "Club budget allocation.",
      emoji: "💰",
      mediations: [
        { id: 1, text: "Prioritize needs", consensus: true },
        { id: 2, text: "One decides all", consensus: false },
        { id: 3, text: "Vote on budget", consensus: true },
        { id: 4, text: "No budget", consensus: false }
      ]
    }
  ];

  const handleMediationSelect = (mediationId) => {
    setSelectedMediation(mediationId);
  };

  const handleConfirm = () => {
    if (!selectedMediation) return;

    const step = steps[currentStep];
    const mediation = step.mediations.find(m => m.id === selectedMediation);
    
    const isConsensus = mediation.consensus;
    
    const newResponses = [...responses, {
      stepId: step.id,
      mediationId: selectedMediation,
      isConsensus,
      mediation: mediation.text
    }];
    
    setResponses(newResponses);
    
    if (isConsensus) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedMediation(null);
    
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
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

  const consensusCount = responses.filter(r => r.isConsensus).length;

  return (
    <GameShell
      title="Mediation Simulation"
      subtitle={`Step ${currentStep + 1} of ${steps.length}`}
      onNext={handleNext}
      nextEnabled={showResult && consensusCount >= 4}
      showGameOver={showResult && consensusCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-59"
      gameType="uvls"
      totalLevels={20}
      currentLevel={59}
      showConfetti={showResult && consensusCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{steps[currentStep].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Dispute: {steps[currentStep].dispute}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose mediation:</p>
              
              <div className="space-y-3 mb-6">
                {steps[currentStep].mediations.map(mediation => (
                  <button
                    key={mediation.id}
                    onClick={() => handleMediationSelect(mediation.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedMediation === mediation.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{mediation.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedMediation}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedMediation
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Mediate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {consensusCount >= 4 ? "🎉 Mediator!" : "💪 More Consensus!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Consensus building: {consensusCount} out of {steps.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {consensusCount >= 4 ? "Earned 5 Coins!" : "Need 4+ consensus."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach neutral facilitation phrases.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MediationSimulation;