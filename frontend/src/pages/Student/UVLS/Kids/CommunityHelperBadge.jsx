import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CommunityHelperBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [acts, setActs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [completedActs, setCompletedActs] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      acts: ["Clean up", "Citizen duty", "Volunteer"]
    },
    {
      id: 2,
      acts: ["Roles match", "Fundraise", "Poster make"]
    },
    {
      id: 3,
      acts: ["Journal contribute", "Help elder", "Report need"]
    },
    {
      id: 4,
      acts: ["Community service", "Civic responsibility", "Badge tasks"]
    },
    {
      id: 5,
      acts: ["Help community", "Be good citizen", "Achieve badge"]
    }
  ];

  const handleActToggle = (act) => {
    if (completedActs.includes(act)) {
      setCompletedActs(completedActs.filter(a => a !== act));
    } else {
      setCompletedActs([...completedActs, act]);
    }
  };

  const handleAct = () => {
    const newActs = [...acts, completedActs];
    setActs(newActs);

    const isComplete = completedActs.length >= 2;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setCompletedActs([]); // Reset for next level
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
    setCompletedActs([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Community Helper Badge"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-90"
      gameType="uvls"
      totalLevels={100}
      currentLevel={90}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Complete community acts!</p>
              <div className="space-y-3">
                {getCurrentLevel().acts.map(act => (
                  <button 
                    key={act} 
                    onClick={() => handleActToggle(act)}
                    className={`w-full p-4 rounded text-left ${completedActs.includes(act) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {act} {completedActs.includes(act) ? '✅' : '⬜'}
                  </button>
                ))}
              </div>
              <button onClick={handleAct} className="mt-4 bg-purple-500 text-white p-2 rounded">Submit</button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Helper Achieved!" : "💪 More Acts!"}
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

export default CommunityHelperBadge;