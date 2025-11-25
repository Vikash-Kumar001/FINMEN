import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ToolboxPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-46";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [posters, setPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedTools, setSelectedTools] = useState([]); // State for tracking selected tools
  const [posterTools, setPosterTools] = useState([]); // State for tracking tools added to poster
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      tools: ["Breathe", "Count", "Walk", "Talk"]
    },
    {
      id: 2,
      tools: ["Draw", "Hug toy", "Listen music", "Stretch"]
    },
    {
      id: 3,
      tools: ["Positive think", "Drink water", "Jump", "Rest"]
    },
    {
      id: 4,
      tools: ["Ask help", "Color", "Play game", "Read"]
    },
    {
      id: 5,
      tools: ["Meditate", "Yoga", "Pet animal", "Garden"]
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

  // Function to add selected tools to poster
  const addToPoster = () => {
    if (selectedTools.length > 0) {
      setPosterTools(prev => [...prev, ...selectedTools]);
      setSelectedTools([]); // Clear selection after adding
    }
  };

  const handlePoster = () => {
    const newPosters = [...posters, posterTools];
    setPosters(newPosters);

    const isComplete = posterTools.length >= 3;
    if (isComplete) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setPosterTools([]); // Reset poster for next level
        setSelectedTools([]); // Reset selection
      }, isComplete ? 800 : 0);
    } else {
      const completePosters = newPosters.filter(sel => sel.length >= 3).length;
      setFinalScore(completePosters);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPosters([]);
    setCoins(0);
    setFinalScore(0);
    setPosterTools([]); // Reset poster
    setSelectedTools([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Toolbox Poster"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-46"
      gameType="uvls"
      totalLevels={50}
      currentLevel={46}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Build calming toolbox!</p>
              
              {/* Available tools to select */}
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Available Tools:</h3>
                <div className="flex flex-wrap gap-2">
                  {getCurrentLevel().tools.map(tool => (
                    <button
                      key={tool}
                      onClick={() => toggleToolSelection(tool)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTools.includes(tool)
                          ? "bg-yellow-500 text-black ring-2 ring-yellow-300"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {tool} {selectedTools.includes(tool) ? "✅" : "🛠️"}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add to poster button */}
              <button 
                onClick={addToPoster}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
                disabled={selectedTools.length === 0}
              >
                Add to Poster ({selectedTools.length} selected)
              </button>
              
              {/* Poster area */}
              <div className="mt-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-40">
                <h3 className="text-white font-medium mb-2">Your Toolbox Poster:</h3>
                {posterTools.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {posterTools.map((tool, index) => (
                      <div key={index} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {tool} ✨
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70 italic">Add tools to build your toolbox...</p>
                )}
              </div>
              
              {/* Complete button */}
              <button 
                onClick={handlePoster} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition"
                disabled={posterTools.length === 0}
              >
                Complete Poster ({posterTools.length} tools)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Toolbox Builder!" : "💪 Build More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You built {finalScore} toolboxes!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned a Badge! 🏅" : "Try again!"}
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

export default ToolboxPoster;