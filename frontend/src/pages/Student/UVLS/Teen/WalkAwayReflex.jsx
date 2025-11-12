import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WalkAwayReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentScenario, setCurrentScenario] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation: "Deal too good to be true.",
      justify: true
    },
    {
      id: 2,
      situation: "Fair negotiation.",
      justify: false
    },
    {
      id: 3,
      situation: "Pressure to sign.",
      justify: true
    },
    {
      id: 4,
      situation: "Mutual agreement.",
      justify: false
    },
    {
      id: 5,
      situation: "Hidden costs revealed.",
      justify: true
    }
  ];

  const handleWalkAway = () => {
    const scenario = scenarios[currentScenario];
    if (scenario.justify) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setFlagged(true);
    proceedToNext();
  };

  const handleStay = () => {
    const scenario = scenarios[currentScenario];
    if (!scenario.justify) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setFlagged(true);
    proceedToNext();
  };

  const proceedToNext = () => {
    setTimeout(() => {
      setFlagged(false);
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        const percentage = (score / scenarios.length) * 100;
        if (percentage >= 70) {
          setCoins(3);
        }
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Walk-away Reflex"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / scenarios.length * 100 >= 70)}
      showGameOver={showResult && (score / scenarios.length * 100 >= 70)}
      score={coins}
      gameId="conflict-178"
      gameType="conflict"
      totalLevels={10}
      currentLevel={8}
      showConfetti={showResult && (score / scenarios.length * 100 >= 70)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6 text-center">"{scenarios[currentScenario].situation}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWalkAway}
                  className="py-3 rounded-xl font-bold text-white bg-red-500 hover:opacity-90"
                >
                  Walk Away!
                </button>
                <button
                  onClick={handleStay}
                  className="py-3 rounded-xl font-bold text-white bg-green-500 hover:opacity-90"
                >
                  Stay
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Reflex Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Score: {score} / {scenarios.length} ({(score / scenarios.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / scenarios.length * 100 >= 70) ? "Earned 3 Coins!" : "Aim for 70%."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach safety & alternatives.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WalkAwayReflex;