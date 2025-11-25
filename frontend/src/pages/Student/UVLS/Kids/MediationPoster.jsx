import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MediationPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-76";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [posters, setPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      steps: ["Listen both", "Find fair", "Agree"]
    },
    {
      id: 2,
      steps: ["Calm down", "Share feelings", "Solve together"]
    },
    {
      id: 3,
      steps: ["Stop argue", "Think win-win", "Try plan"]
    },
    {
      id: 4,
      steps: ["Hear sides", "Propose compromise", "Check happy"]
    },
    {
      id: 5,
      steps: ["Breathe", "Talk kind", "Hug end"]
    }
  ];

  const handleStepToggle = (step) => {
    if (selectedSteps.includes(step)) {
      setSelectedSteps(selectedSteps.filter(s => s !== step));
    } else {
      setSelectedSteps([...selectedSteps, step]);
    }
  };

  const handlePoster = () => {
    const newPosters = [...posters, selectedSteps];
    setPosters(newPosters);

    const isComplete = selectedSteps.length >= 3;
    if (isComplete) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedSteps([]); // Reset for next level
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
    setSelectedSteps([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Mediation Poster"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-76"
      gameType="uvls"
      totalLevels={100}
      currentLevel={76}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Create mediation poster!</p>
              
              {/* Display current selections */}
              <div className="mb-4 min-h-[30px]">
                {selectedSteps.length > 0 ? (
                  <p className="text-white">Selected steps: {selectedSteps.join(', ')}</p>
                ) : (
                  <p className="text-white/50">Click steps below to add them to your poster</p>
                )}
              </div>
              
              {/* Steps */}
              <div className="flex flex-wrap gap-4">
                {getCurrentLevel().steps.map(step => (
                  <div 
                    key={step} 
                    className={`p-2 rounded cursor-pointer ${selectedSteps.includes(step) ? 'bg-green-600' : 'bg-green-500'}`}
                    onClick={() => handleStepToggle(step)}
                  >
                    {step} {selectedSteps.includes(step) ? '✅' : '⬜'}
                  </div>
                ))}
              </div>
              
              {/* Poster Area */}
              <div className="mt-4 bg-gray-500 h-40 rounded flex items-center justify-center">
                {selectedSteps.length > 0 ? (
                  <div className="text-center">
                    <p className="text-white font-bold">Mediation Poster:</p>
                    {selectedSteps.map((step, idx) => (
                      <p key={idx} className="text-white">{idx + 1}. {step}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50">Poster Area - Select steps above</p>
                )}
              </div>
              
              <button 
                onClick={handlePoster} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={selectedSteps.length === 0}
              >
                Complete
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Mediation Artist!" : "💪 Design More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed {finalScore} posters!
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

export default MediationPoster;