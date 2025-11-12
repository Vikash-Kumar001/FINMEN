import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ListeningVsSpeakingDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentArgument, setCurrentArgument] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const debateArguments = [
    {
      id: 1,
      topic: "Listening builds trust.",
      emoji: "👂",
      positions: [
        { id: 1, text: "Agree with evidence", nuanced: true },
        { id: 2, text: "Speaking is better", nuanced: false },
        { id: 3, text: "Both important", nuanced: true },
        { id: 4, text: "No opinion", nuanced: false }
      ]
    },
    {
      id: 2,
      topic: "Speaking leads change.",
      emoji: "🗣️",
      positions: [
        { id: 1, text: "Balanced view", nuanced: true },
        { id: 2, text: "Listening only", nuanced: false },
        { id: 3, text: "Evidence for both", nuanced: true },
        { id: 4, text: "Ignore", nuanced: false }
      ]
    },
    {
      id: 3,
      topic: "Leaders listen more.",
      emoji: "👑",
      positions: [
        { id: 1, text: "Examples of listeners", nuanced: true },
        { id: 2, text: "Speakers only", nuanced: false },
        { id: 3, text: "Nuanced argument", nuanced: true },
        { id: 4, text: "Personal bias", nuanced: false }
      ]
    },
    {
      id: 4,
      topic: "Speaking motivates.",
      emoji: "🔥",
      positions: [
        { id: 1, text: "But listening understands", nuanced: true },
        { id: 2, text: "Listening passive", nuanced: false },
        { id: 3, text: "Integrated approach", nuanced: true },
        { id: 4, text: "No need", nuanced: false }
      ]
    },
    {
      id: 5,
      topic: "Balance is key.",
      emoji: "⚖️",
      positions: [
        { id: 1, text: "Agree with reasons", nuanced: true },
        { id: 2, text: "One over other", nuanced: false },
        { id: 3, text: "Evidence-backed", nuanced: true },
        { id: 4, text: "Dismiss", nuanced: false }
      ]
    }
  ];

  const handlePositionSelect = (positionId) => {
    setSelectedPosition(positionId);
  };

  const handleConfirm = () => {
    if (!selectedPosition) return;

    const argument = debateArguments[currentArgument];
    const position = argument.positions.find(p => p.id === selectedPosition);
    
    const isNuanced = position.nuanced;
    
    const newResponses = [...responses, {
      argumentId: argument.id,
      positionId: selectedPosition,
      isNuanced,
      position: position.text
    }];
    
    setResponses(newResponses);
    
    if (isNuanced) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedPosition(null);
    
    if (currentArgument < debateArguments.length - 1) {
      setTimeout(() => {
        setCurrentArgument(prev => prev + 1);
      }, 1500);
    } else {
      const nuancedCount = newResponses.filter(r => r.isNuanced).length;
      if (nuancedCount >= 4) {
        setCoins(10);
      }
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
      title="Listening vs Speaking Debate"
      subtitle={`Argument ${currentArgument + 1} of ${debateArguments.length}`}
      onNext={handleNext}
      nextEnabled={showResult && nuancedCount >= 4}
      showGameOver={showResult && nuancedCount >= 4}
      score={coins}
      gameId="communication-169"
      gameType="communication"
      totalLevels={10}
      currentLevel={9}
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
              
              <p className="text-white/90 mb-4 text-center">Choose position:</p>
              
              <div className="space-y-3 mb-6">
                {debateArguments[currentArgument].positions.map(position => (
                  <button
                    key={position.id}
                    onClick={() => handlePositionSelect(position.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPosition === position.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{position.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedPosition}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPosition
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Argue
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {nuancedCount >= 4 ? "🎉 Nuanced Debater!" : "💪 More Nuance!"}
            </h2>
              <p className="text-white/90 text-xl mb-4">
              Nuanced arguments: {nuancedCount} out of {debateArguments.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {nuancedCount >= 4 ? "Earned 10 Coins!" : "Need 4+ nuanced."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Emphasize both skills.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ListeningVsSpeakingDebate;