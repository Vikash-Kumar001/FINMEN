import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShortVsLongGoalsDebate = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-99";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentArgument, setCurrentArgument] = useState(0);
  const [selectedView, setSelectedView] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const debateArguments = [
    {
      id: 1,
      topic: "Short-term wins motivate.",
      emoji: "🏆",
      views: [
        { id: 1, text: "But long-term sustains", balanced: true },
        { id: 2, text: "Short only", balanced: false },
        { id: 3, text: "Balance both", balanced: true },
        { id: 4, text: "Long only", balanced: false }
      ]
    },
    {
      id: 2,
      topic: "Long-term builds future.",
      emoji: "🔮",
      views: [
        { id: 1, text: "With short milestones", balanced: true },
        { id: 2, text: "Ignore short", balanced: false },
        { id: 3, text: "Integrated plan", balanced: true },
        { id: 4, text: "Short wins rule", balanced: false }
      ]
    },
    {
      id: 3,
      topic: "Priorities conflict.",
      emoji: "⚖️",
      views: [
        { id: 1, text: "Align them", balanced: true },
        { id: 2, text: "Choose one", balanced: false },
        { id: 3, text: "Trade-off reasoning", balanced: true },
        { id: 4, text: "No priority", balanced: false }
      ]
    },
    {
      id: 4,
      topic: "Examples from life.",
      emoji: "📖",
      views: [
        { id: 1, text: "Student examples balanced", balanced: true },
        { id: 2, text: "Extreme short", balanced: false },
        { id: 3, text: "Mixed approach", balanced: true },
        { id: 4, text: "Extreme long", balanced: false }
      ]
    },
    {
      id: 5,
      topic: "Conclusion.",
      emoji: "🏁",
      views: [
        { id: 1, text: "Balance for success", balanced: true },
        { id: 2, text: "One over other", balanced: false },
        { id: 3, text: "Evidence-backed balance", balanced: true },
        { id: 4, text: "No conclusion", balanced: false }
      ]
    }
  ];

  const handleViewSelect = (viewId) => {
    setSelectedView(viewId);
  };

  const handleConfirm = () => {
    if (!selectedView) return;

    const argument = debateArguments[currentArgument];
    const view = argument.views.find(v => v.id === selectedView);
    
    const isBalanced = view.balanced;
    
    const newResponses = [...responses, {
      argumentId: argument.id,
      viewId: selectedView,
      isBalanced,
      view: view.text
    }];
    
    setResponses(newResponses);
    
    if (isBalanced) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedView(null);
    
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

  const balancedCount = responses.filter(r => r.isBalanced).length;

  return (
    <GameShell
      title="Short vs Long Goals Debate"
      subtitle={`Argument ${currentArgument + 1} of ${debateArguments.length}`}
      onNext={handleNext}
      nextEnabled={showResult && balancedCount >= 4}
      showGameOver={showResult && balancedCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-99"
      gameType="uvls"
      totalLevels={20}
      currentLevel={99}
      showConfetti={showResult && balancedCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{debateArguments[currentArgument].emoji}</div>
              
              <p className="text-white text-xl mb-6">{debateArguments[currentArgument].topic}</p>
              
              <p className="text-white/90 mb-4 text-center">Choose view:</p>
              
              <div className="space-y-3 mb-6">
                {debateArguments[currentArgument].views.map(view => (
                  <button
                    key={view.id}
                    onClick={() => handleViewSelect(view.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedView === view.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{view.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedView}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedView
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
              {balancedCount >= 4 ? "🎉 Balanced Debater!" : "💪 More Balanced!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Balanced positions: {balancedCount} out of {debateArguments.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {balancedCount >= 4 ? "Earned 10 Coins!" : "Need 4+ balanced."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use examples from students' lives.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShortVsLongGoalsDebate;