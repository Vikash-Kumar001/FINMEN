import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TimedDebate = () => {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedArgument, setSelectedArgument] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const rounds = [
    {
      id: 1,
      topic: "Homework should be banned.",
      emoji: "📚",
      arguments: [
        { id: 1, text: "Pro: More free time", logical: true },
        { id: 2, text: "Con: Less practice", logical: true },
        { id: 3, text: "Emotional rant", logical: false },
        { id: 4, text: "Evidence-based pro", logical: true }
      ]
    },
    {
      id: 2,
      topic: "Social media is harmful.",
      emoji: "📱",
      arguments: [
        { id: 1, text: "Pro: Addiction", logical: true },
        { id: 2, text: "Con: Connectivity", logical: true },
        { id: 3, text: "Personal story", logical: false },
        { id: 4, text: "Study citation con", logical: true }
      ]
    },
    {
      id: 3,
      topic: "School uniforms are good.",
      emoji: "👕",
      arguments: [
        { id: 1, text: "Pro: Equality", logical: true },
        { id: 2, text: "Con: Expression limit", logical: true },
        { id: 3, text: "I hate them", logical: false },
        { id: 4, text: "Research pro", logical: true }
      ]
    },
    {
      id: 4,
      topic: "Video games cause violence.",
      emoji: "🎮",
      arguments: [
        { id: 1, text: "Pro: Correlation studies", logical: true },
        { id: 2, text: "Con: No causation", logical: true },
        { id: 3, text: "My opinion", logical: false },
        { id: 4, text: "Expert quote con", logical: true }
      ]
    },
    {
      id: 5,
      topic: "Pets in class?",
      emoji: "🐶",
      arguments: [
        { id: 1, text: "Pro: Reduces stress", logical: true },
        { id: 2, text: "Con: Allergies", logical: true },
        { id: 3, text: "Cute animals!", logical: false },
        { id: 4, text: "Study on benefits", logical: true }
      ]
    }
  ];

  const handleArgumentSelect = (argumentId) => {
    setSelectedArgument(argumentId);
  };

  const handleConfirm = () => {
    if (!selectedArgument) return;

    const round = rounds[currentRound];
    const argument = round.arguments.find(a => a.id === selectedArgument);
    
    const isLogical = argument.logical;
    
    const newResponses = [...responses, {
      roundId: round.id,
      argumentId: selectedArgument,
      isLogical,
      argument: argument.text
    }];
    
    setResponses(newResponses);
    
    if (isLogical) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedArgument(null);
    
    if (currentRound < rounds.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
      }, 1500);
    } else {
      const logicalCount = newResponses.filter(r => r.isLogical).length;
      if (logicalCount >= 4) {
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

  const logicalCount = responses.filter(r => r.isLogical).length;

  return (
    <GameShell
      title="Timed Debate"
      subtitle={`Round ${currentRound + 1} of ${rounds.length}`}
      onNext={handleNext}
      nextEnabled={showResult && logicalCount >= 4}
      showGameOver={showResult && logicalCount >= 4}
      score={coins}
      gameId="decision-158"
      gameType="decision"
      totalLevels={10}
      currentLevel={8}
      showConfetti={showResult && logicalCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{rounds[currentRound].emoji}</div>
              
              <p className="text-white text-xl mb-6">Topic: {rounds[currentRound].topic}</p>
              
              <p className="text-white/90 mb-4 text-center">Choose logical argument:</p>
              
              <div className="space-y-3 mb-6">
                {rounds[currentRound].arguments.map(argument => (
                  <button
                    key={argument.id}
                    onClick={() => handleArgumentSelect(argument.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedArgument === argument.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{argument.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedArgument}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedArgument
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
              {logicalCount >= 4 ? "🎉 Debate Master!" : "💪 More Logic!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Logical arguments: {logicalCount} out of {rounds.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {logicalCount >= 4 ? "Earned 10 Coins!" : "Need 4+ logical."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Rotate roles: pro/con/judge.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TimedDebate;