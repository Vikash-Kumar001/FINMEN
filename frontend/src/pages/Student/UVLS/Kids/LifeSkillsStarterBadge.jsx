import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LifeSkillsStarterBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-100";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [skills, setSkills] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      behaviors: ["Routine", "Priority", "Task check"]
    },
    {
      id: 2,
      behaviors: ["Day plan", "Goal steps", "SMART poster"]
    },
    {
      id: 3,
      behaviors: ["Weekly journal", "Time budget", "Safety reflex"]
    },
    {
      id: 4,
      behaviors: ["Life skills", "Time manage", "Goal set"]
    },
    {
      id: 5,
      behaviors: ["Safety know", "Badge complete", "Starter achieved"]
    }
  ];

  const toggleBehavior = (behavior) => {
    setSelectedBehaviors(prev => {
      if (prev.includes(behavior)) {
        return prev.filter(b => b !== behavior);
      } else {
        return [...prev, behavior];
      }
    });
  };

  const handleSkill = () => {
    const newSkills = [...skills, selectedBehaviors];
    setSkills(newSkills);

    const isComplete = selectedBehaviors.length >= 2;
    if (isComplete) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedBehaviors([]); // Reset selection for next level
      }, isComplete ? 800 : 0);
    } else {
      const completeLevels = newSkills.filter(sel => sel.length >= 2).length;
      setFinalScore(completeLevels);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setSkills([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedBehaviors([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Life Skills Starter Badge"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-100"
      gameType="uvls"
      totalLevels={100}
      currentLevel={100}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Demonstrate life skills! Select at least 2 behaviors.</p>
              <div className="space-y-3">
                {getCurrentLevel().behaviors.map(beh => (
                  <button 
                    key={beh} 
                    onClick={() => toggleBehavior(beh)}
                    className={`w-full p-4 rounded text-left transition ${
                      selectedBehaviors.includes(beh) 
                        ? "bg-purple-500 text-white" 
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {beh} 🛠️
                  </button>
                ))}
              </div>
              <button 
                onClick={handleSkill}
                disabled={selectedBehaviors.length < 2}
                className={`mt-4 px-6 py-3 rounded-full font-semibold transition ${
                  selectedBehaviors.length >= 2
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                Submit ({selectedBehaviors.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Skills Starter!" : "💪 More Skills!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You demonstrated {finalScore} behaviors!
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

export default LifeSkillsStarterBadge;