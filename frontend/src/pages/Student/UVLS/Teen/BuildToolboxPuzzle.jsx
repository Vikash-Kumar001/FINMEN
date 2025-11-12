import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BuildToolboxPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [selectedTools, setSelectedTools] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const tools = [
    { id: 1, text: "Breathing exercises", type: "breathing" },
    { id: 2, text: "Talk to friend", type: "social" },
    { id: 3, text: "Go for a run", type: "activity" },
    { id: 4, text: "Journaling", type: "breathing" },
    { id: 5, text: "Call family", type: "social" },
    { id: 6, text: "Listen to music", type: "activity" },
    { id: 7, text: "Meditation", type: "breathing" },
    { id: 8, text: "Join club", type: "social" },
    { id: 9, text: "Draw or paint", type: "activity" },
    { id: 10, text: "Yoga", type: "activity" }
  ];

  const handleToolSelect = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    if (selectedTools.length < 6 && !selectedTools.includes(toolId)) {
      setSelectedTools([...selectedTools, toolId]);
      showCorrectAnswerFeedback(1, false);
    }
  };

  const handleConfirm = () => {
    if (selectedTools.length === 6) {
      const types = selectedTools.map(id => tools.find(t => t.id === id).type);
      const hasBreathing = types.filter(t => t === "breathing").length >= 1;
      const hasSocial = types.filter(t => t === "social").length >= 1;
      const hasActivity = types.filter(t => t === "activity").length >= 1;
      if (hasBreathing && hasSocial && hasActivity) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Build Toolbox Puzzle"
      subtitle="Select 6 tools"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="emotion-149"
      gameType="emotion"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={9}
      showConfetti={showResult}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Choose balanced tools:</p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    disabled={selectedTools.includes(tool.id) || selectedTools.length >= 6}
                    className={`py-3 rounded-xl text-white transition ${
                      selectedTools.includes(tool.id) ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'
                    } ${ (selectedTools.includes(tool.id) || selectedTools.length >= 6) ? 'cursor-not-allowed' : ''}`}
                  >
                    {tool.text}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={selectedTools.length !== 6}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedTools.length === 6
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Build Toolbox
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Toolbox Built!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your tools: {selectedTools.map(id => tools.find(t => t.id === id).text).join(", ")}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {coins > 0 ? "Earned 5 Coins for balanced toolbox!" : "Make sure it's balanced."}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BuildToolboxPuzzle;