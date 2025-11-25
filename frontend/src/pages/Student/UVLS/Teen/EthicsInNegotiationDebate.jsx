import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EthicsInNegotiationDebate = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-68";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentArgument, setCurrentArgument] = useState(0);
  const [selectedStance, setSelectedStance] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const debateArguments = [
    {
      id: 1,
      topic: "Lying in negotiation.",
      emoji: "🤥",
      stances: [
        { id: 1, text: "Sometimes okay if harmless", nuanced: true },
        { id: 2, text: "Always wrong", nuanced: false },
        { id: 3, text: "Depends on context", nuanced: true },
        { id: 4, text: "Always okay", nuanced: false }
      ]
    },
    {
      id: 2,
      topic: "Compromise vs principle.",
      emoji: "⚖️",
      stances: [
        { id: 1, text: "Balance both", nuanced: true },
        { id: 2, text: "Never compromise", nuanced: false },
        { id: 3, text: "Case by case", nuanced: true },
        { id: 4, text: "Always compromise", nuanced: false }
      ]
    },
    {
      id: 3,
      topic: "Bluffing ethical?",
      emoji: "🃏",
      stances: [
        { id: 1, text: "In business yes, personal no", nuanced: true },
        { id: 2, text: "Never", nuanced: false },
        { id: 3, text: "If not harmful", nuanced: true },
        { id: 4, text: "Always", nuanced: false }
      ]
    },
    {
      id: 4,
      topic: "Power imbalance.",
      emoji: "💪",
      stances: [
        { id: 1, text: "Use fairly", nuanced: true },
        { id: 2, text: "Exploit", nuanced: false },
        { id: 3, text: "Level playing field", nuanced: true },
        { id: 4, text: "Ignore", nuanced: false }
      ]
    },
    {
      id: 5,
      topic: "Win-win always possible?",
      emoji: "🏆",
      stances: [
        { id: 1, text: "Strive for it", nuanced: true },
        { id: 2, text: "No, win-lose", nuanced: false },
        { id: 3, text: "In most cases", nuanced: true },
        { id: 4, text: "Always win-win", nuanced: false }
      ]
    }
  ];

  const handleStanceSelect = (stanceId) => {
    setSelectedStance(stanceId);
  };

  const handleConfirm = () => {
    if (!selectedStance) return;

    const argument = debateArguments[currentArgument];
    const stance = argument.stances.find(s => s.id === selectedStance);
    
    const isNuanced = stance.nuanced;
    
    const newResponses = [...responses, {
      argumentId: argument.id,
      stanceId: selectedStance,
      isNuanced,
      stance: stance.text
    }];
    
    setResponses(newResponses);
    
    if (isNuanced) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedStance(null);
    
    if (currentArgument < debateArguments.length - 1) {
      setTimeout(() => {
        setCurrentArgument(prev => prev + 1);
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

  const nuancedCount = responses.filter(r => r.isNuanced).length;

  return (
    <GameShell
      title="Ethics in Negotiation Debate"
      subtitle={`Argument ${currentArgument + 1} of ${debateArguments.length}`}
      onNext={handleNext}
      nextEnabled={showResult && nuancedCount >= 4}
      showGameOver={showResult && nuancedCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-68"
      gameType="uvls"
      totalLevels={20}
      currentLevel={68}
      showConfetti={showResult && nuancedCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{debateArguments[currentArgument].emoji}</div>
              
              <p className="text-white text-xl mb-6">{debateArguments[currentArgument].topic}</p>
              
              <p className="text-white/90 mb-4 text-center">Choose stance:</p>
              
              <div className="space-y-3 mb-6">
                {debateArguments[currentArgument].stances.map(stance => (
                  <button
                    key={stance.id}
                    onClick={() => handleStanceSelect(stance.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedStance === stance.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{stance.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedStance}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedStance
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Debate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {nuancedCount >= 4 ? "🎉 Ethical Debater!" : "💪 More Nuanced!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Nuanced arguments: {nuancedCount} out of {debateArguments.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {nuancedCount >= 4 ? "Earned 10 Coins!" : "Need 4+ nuanced."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Include real-case studies.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EthicsInNegotiationDebate;