import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CorrectingBiasRoleplay = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-17";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      biasStatement: "A classmate says: 'Girls aren't good at math.'",
      emoji: "🔢",
      approaches: [
        { id: 1, text: "Hey, that's not true. Many girls excel at math, and everyone can learn it.", respectful: true, safe: true },
        { id: 2, text: "You're being sexist and ignorant!", respectful: false, safe: false },
        { id: 3, text: "Whatever, I don't care.", respectful: false, safe: true },
        { id: 4, text: "I understand you may think that, but research shows gender doesn't determine math ability.", respectful: true, safe: true }
      ]
    },
    {
      id: 2,
      biasStatement: "Someone says: 'People from that country are all lazy.'",
      emoji: "🌍",
      approaches: [
        { id: 1, text: "That's a stereotype. I know hardworking people from many countries.", respectful: true, safe: true },
        { id: 2, text: "You're racist! Stop talking!", respectful: false, safe: false },
        { id: 3, text: "Just ignore and walk away", respectful: false, safe: true },
        { id: 4, text: "Actually, that's a harmful generalization. Each person is unique.", respectful: true, safe: true }
      ]
    },
    {
      id: 3,
      biasStatement: "A peer jokes: 'That's so gay' as an insult.",
      emoji: "🏳️‍🌈",
      approaches: [
        { id: 1, text: "Hey, using 'gay' as an insult is hurtful. Let's choose better words.", respectful: true, safe: true },
        { id: 2, text: "Shut up, you're so offensive!", respectful: false, safe: false },
        { id: 3, text: "Say nothing but feel uncomfortable", respectful: false, safe: true },
        { id: 4, text: "I don't think you meant harm, but that language can hurt people. Let's be more mindful.", respectful: true, safe: true }
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
    
    const isGood = approach.respectful && approach.safe;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      approachId: selectedApproach,
      isGood,
      approach: approach.text
    }];
    
    setResponses(newResponses);
    
    if (isGood) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedApproach(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/name-respect-reflex");
  };

  const goodCount = responses.filter(r => r.isGood).length;

  return (
    <GameShell
      title="Correcting Bias Roleplay"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && goodCount >= 2}
      showGameOver={showResult && goodCount >= 2}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-17"
      gameType="uvls"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showResult && goodCount >= 2}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  💡 Remember: Safety first. If you feel unsafe, get adult help.
                </p>
              </div>
              
              <div className="text-5xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  "{scenarios[currentScenario].biasStatement}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">How do you respond?</p>
              
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
                Respond
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {goodCount >= 2 ? "🎉 Respectful Advocate!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You used {goodCount} out of {scenarios.length} respectful and safe approaches!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {goodCount >= 2 ? "You earned 3 Coins! 🏆" : "Use 2+ respectful approaches to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Emphasize safety and escalation paths. Students should know when to get adult help!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CorrectingBiasRoleplay;

