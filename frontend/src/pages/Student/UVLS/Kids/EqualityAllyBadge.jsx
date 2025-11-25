import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EqualityAllyBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-30";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
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
      acts: ["Share toy with anyone", "Help friend regardless of gender", "Speak up against unfairness"]
    },
    {
      id: 2,
      acts: ["Invite all to play", "Compliment without bias", "Rotate chores fairly"]
    },
    {
      id: 3,
      acts: ["Encourage dreams", "Stand against stereotypes", "Promote equality in group"]
    },
    {
      id: 4,
      acts: ["Support discouraged peer", "Share opportunities", "Celebrate diversity"]
    },
    {
      id: 5,
      acts: ["Be inclusive", "Challenge bias kindly", "Lead by example"]
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

    const isComplete = selectedActs.length >= 2; // Need at least 2 acts per level
    if (isComplete) {
      setCoins(prev => prev + 1);
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
    navigate("/games/uvls/kids"); // Adjust as needed
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Equality Ally Badge"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-30"
      gameType="uvls"
      totalLevels={30}
      currentLevel={30}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Complete equality acts!</p>
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
                      {selectedActs.includes(act) ? "✅" : "🏅"}
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
                Submit Acts ({selectedActs.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Ally Achieved!" : "💪 Do More Acts!"}
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

export default EqualityAllyBadge;