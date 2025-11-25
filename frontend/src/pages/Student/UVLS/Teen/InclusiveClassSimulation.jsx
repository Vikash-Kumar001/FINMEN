import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InclusiveClassSimulation = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-14";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [designChoices, setDesignChoices] = useState({
    roles: null,
    time: null,
    materials: null
  });
  const [simulationRun, setSimulationRun] = useState(false);
  const [inclusionScore, setInclusionScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const designOptions = {
    roles: [
      { id: 1, name: "Different roles for different strengths", inclusive: true, score: 30 },
      { id: 2, name: "Everyone does the exact same role", inclusive: false, score: 10 },
      { id: 3, name: "Only high achievers get lead roles", inclusive: false, score: 5 }
    ],
    time: [
      { id: 1, name: "Flexible timing with breaks", inclusive: true, score: 30 },
      { id: 2, name: "Strict time limit for everyone", inclusive: false, score: 15 },
      { id: 3, name: "Unlimited time only for some", inclusive: false, score: 10 }
    ],
    materials: [
      { id: 1, name: "Multiple format options (text, audio, visual)", inclusive: true, score: 30 },
      { id: 2, name: "Only textbooks provided", inclusive: false, score: 10 },
      { id: 3, name: "Digital only (no alternatives)", inclusive: false, score: 15 }
    ]
  };

  const handleDesignChoice = (category, choiceId) => {
    setDesignChoices({
      ...designChoices,
      [category]: choiceId
    });
  };

  const handleRunSimulation = () => {
    const roleChoice = designOptions.roles.find(r => r.id === designChoices.roles);
    const timeChoice = designOptions.time.find(t => t.id === designChoices.time);
    const materialChoice = designOptions.materials.find(m => m.id === designChoices.materials);
    
    const totalScore = (roleChoice?.score || 0) + (timeChoice?.score || 0) + (materialChoice?.score || 0);
    setInclusionScore(totalScore);
    
    if (totalScore >= 80) {
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
    setInclusionScore(0);
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/respect-debate");
  };

  const allSelected = designChoices.roles && designChoices.time && designChoices.materials;

  return (
    <GameShell
      title="Inclusive Class Simulation"
      subtitle="Design an Activity for All"
      onNext={handleNext}
      nextEnabled={showResult && inclusionScore >= 80}
      showGameOver={showResult && inclusionScore >= 80}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-14"
      gameType="uvls"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && inclusionScore >= 80}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!simulationRun ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">Design Your Activity</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-white font-semibold mb-3 block">1. How are roles assigned?</label>
                  <div className="space-y-2">
                    {designOptions.roles.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleDesignChoice('roles', option.id)}
                        className={`w-full text-left border-2 rounded-xl p-3 transition-all ${
                          designChoices.roles === option.id
                            ? 'bg-blue-500/50 border-blue-400'
                            : 'bg-white/20 border-white/40 hover:bg-white/30'
                        }`}
                      >
                        <span className="text-white font-medium text-sm">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white font-semibold mb-3 block">2. How is time structured?</label>
                  <div className="space-y-2">
                    {designOptions.time.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleDesignChoice('time', option.id)}
                        className={`w-full text-left border-2 rounded-xl p-3 transition-all ${
                          designChoices.time === option.id
                            ? 'bg-blue-500/50 border-blue-400'
                            : 'bg-white/20 border-white/40 hover:bg-white/30'
                        }`}
                      >
                        <span className="text-white font-medium text-sm">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white font-semibold mb-3 block">3. What materials are provided?</label>
                  <div className="space-y-2">
                    {designOptions.materials.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleDesignChoice('materials', option.id)}
                        className={`w-full text-left border-2 rounded-xl p-3 transition-all ${
                          designChoices.materials === option.id
                            ? 'bg-blue-500/50 border-blue-400'
                            : 'bg-white/20 border-white/40 hover:bg-white/30'
                        }`}
                      >
                        <span className="text-white font-medium text-sm">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={!allSelected}
                className={`w-full py-3 rounded-xl font-bold text-white transition mt-6 ${
                  allSelected
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Run Simulation! 🎮
              </button>
            </div>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Simulation Results</h3>
            
            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 mb-6">
              <div className="text-6xl mb-3 text-center">
                {inclusionScore >= 80 ? "🎉" : inclusionScore >= 50 ? "😊" : "😕"}
              </div>
              <p className="text-white text-xl font-bold text-center mb-2">
                Inclusion Score: {inclusionScore}%
              </p>
              <p className="text-white/80 text-center">
                {inclusionScore >= 80 
                  ? "Excellent! All students can participate meaningfully!"
                  : inclusionScore >= 50
                  ? "Good start, but some students may struggle to participate"
                  : "Many students are excluded. Consider revisions."}
              </p>
            </div>

            {inclusionScore < 80 && (
              <button
                onClick={handleRevise}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition mb-4"
              >
                Revise Design 🔄
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {inclusionScore >= 80 ? "🎉 Inclusive Designer!" : "💪 Try Different Options!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Final Inclusion Score: {inclusionScore}%
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {inclusionScore >= 80 ? "You earned 3 Coins! 🪙" : "Get 80% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use this as a mini-project to design real inclusive class activities!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusiveClassSimulation;

