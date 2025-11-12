import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfAwareBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [toolsUsed, setToolsUsed] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedTools, setSelectedTools] = useState([]); // State for tracking selected tools
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      tools: ["Breathe", "Journal", "Talk"]
    },
    {
      id: 2,
      tools: ["Count", "Draw", "Walk"]
    },
    {
      id: 3,
      tools: ["Positive think", "Music", "Rest"]
    },
    {
      id: 4,
      tools: ["Ask help", "Play", "Stretch"]
    },
    {
      id: 5,
      tools: ["Meditate", "Read", "Hug"]
    }
  ];

  // Function to toggle tool selection
  const toggleToolSelection = (tool) => {
    setSelectedTools(prev => {
      if (prev.includes(tool)) {
        return prev.filter(t => t !== tool);
      } else {
        return [...prev, tool];
      }
    });
  };

  const handleUse = () => {
    const newToolsUsed = [...toolsUsed, selectedTools];
    setToolsUsed(newToolsUsed);

    const isComplete = selectedTools.length >= 2;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedTools([]); // Reset selection for next level
      }, isComplete ? 800 : 0);
    } else {
      const completeLevels = newToolsUsed.filter(sel => sel.length >= 2).length;
      setFinalScore(completeLevels);
      if (completeLevels >= 3) {
        setCoins(5); // Achievement
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setToolsUsed([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedTools([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids"); // End
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Self-Aware Badge"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-50"
      gameType="uvls"
      totalLevels={50}
      currentLevel={50}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Use emotion tools!</p>
              <div className="space-y-3">
                {getCurrentLevel().tools.map(tool => (
                  <button 
                    key={tool} 
                    onClick={() => toggleToolSelection(tool)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedTools.includes(tool)
                        ? "bg-green-500/30 border-2 border-green-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedTools.includes(tool) ? "✅" : "🧠"}
                    </div>
                    <div className="text-white font-medium text-left">{tool}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleUse} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedTools.length === 0} // Disable if no tools selected
              >
                Submit ({selectedTools.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Self-Aware Achieved!" : "💪 Use More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You used tools in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned the Badge! 🏆" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SelfAwareBadge;