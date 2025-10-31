import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationMonthlyBudget = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [allocation, setAllocation] = useState({ needs: 0, wants: 0 });

  const stages = [
    { id: 1, amount: 2000, target: { needs: 1200, wants: 800 } },
    { id: 2, amount: 2500, target: { needs: 1500, wants: 1000 } },
    { id: 3, amount: 1800, target: { needs: 1100, wants: 700 } },
    { id: 4, amount: 3000, target: { needs: 1800, wants: 1200 } },
    { id: 5, amount: 2200, target: { needs: 1300, wants: 900 } }
  ];

  const handleChange = (e) => {
    setAllocation({ ...allocation, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = () => {
    resetFeedback();
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    const stage = stages[currentStage];

    if (total === stage.amount && allocation.needs >= stage.target.needs) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false, `Total must be ₹${stage.amount} with at least ₹${stage.target.needs} for needs.`);
      return;
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setAllocation({ needs: 0, wants: 0 });
        resetFeedback();
      }, 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/student/finance");

  return (
    <GameShell
      title="Simulation: Monthly Budget"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-78"
      gameType="simulation"
    >
      <div className="text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Stage {currentStage + 1}</h3>
            <p className="text-lg mb-6">Allocate ₹{stages[currentStage].amount} for needs and wants:</p>
            <div className="space-y-4">
              {["needs", "wants"].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <label className="w-24 capitalize text-white/90">{cat}:</label>
                  <input
                    type="number"
                    name={cat}
                    value={allocation[cat]}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-24 bg-white/5 text-white"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 mt-6"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Budget Simulation Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Prioritize needs in your budget!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMonthlyBudget;