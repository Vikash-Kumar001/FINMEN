import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerProtectorBadge = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [acts, setActs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedActs, setSelectedActs] = useState([]); // State for tracking selected acts
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      acts: ["Reported bullying", "Supported friend", "Stood up"]
    },
    {
      id: 2,
      acts: ["Included excluded", "Stopped tease", "Helped online"]
    },
    {
      id: 3,
      acts: ["Listened to victim", "Got teacher", "Promoted kindness"]
    },
    {
      id: 4,
      acts: ["Shared anti-bully message", "Roleplayed safe", "Tracked acts"]
    },
    {
      id: 5,
      acts: ["Encouraged reporting", "Practiced intervention", "Badge earned"]
    }
  ];

  // Function to toggle act selection
  const toggleActSelection = (act) => {
    setSelectedActs(prev => {
      if (prev.includes(act)) {
        return prev.filter(a => a !== act);
      } else {
        return [...prev, act];
      }
    });
  };

  const handleAct = () => {
    const newActs = [...acts, selectedActs];
    setActs(newActs);

    const isComplete = selectedActs.length >= 2;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedActs([]); // Reset selection for next level
      }, isComplete ? 800 : 0);
    } else {
      const completeLevels = newActs.filter(sel => sel.length >= 2).length;
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
    setActs([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedActs([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Peer Protector Badge"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-40"
      gameType="uvls"
      totalLevels={50}
      currentLevel={40}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Complete anti-bullying acts!</p>
              <div className="space-y-3">
                {getCurrentLevel().acts.map(act => (
                  <button 
                    key={act} 
                    onClick={() => toggleActSelection(act)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedActs.includes(act)
                        ? "bg-green-500/30 border-2 border-green-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedActs.includes(act) ? "✅" : "🛡️"}
                    </div>
                    <div className="text-white font-medium text-left">{act}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleAct} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedActs.length === 0} // Disable if no acts selected
              >
                Submit ({selectedActs.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Protector Achieved!" : "💪 More Acts!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed acts in {finalScore} levels!
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

export default PeerProtectorBadge;