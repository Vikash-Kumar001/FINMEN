import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationDigitalSpend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [allocation, setAllocation] = useState({ food: 0, book: 0 });

  const stages = [
    { id: 1, amount: 1000, target: { food: 200, book: 300, remaining: 500 } },
    { id: 2, amount: 1200, target: { food: 300, book: 400, remaining: 500 } },
    { id: 3, amount: 800, target: { food: 150, book: 200, remaining: 450 } },
    { id: 4, amount: 1500, target: { food: 400, book: 500, remaining: 600 } },
    { id: 5, amount: 900, target: { food: 200, book: 250, remaining: 450 } }
  ];

  const handleChange = (e) => {
    setAllocation({ ...allocation, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = () => {
    resetFeedback();
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    const stage = stages[currentStage];
    const remaining = stage.amount - total;

    if (total === stage.amount - stage.target.remaining && allocation.food === stage.target.food && allocation.book === stage.target.book) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false, `Total spent should be ₹${stage.amount - stage.target.remaining}, with ₹${stage.target.food} for food and ₹${stage.target.book} for book.`);
      return;
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setAllocation({ food: 0, book: 0 });
        resetFeedback();
      }, 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Simulation: Digital Spend"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score>= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-98"
      gameType="simulation"
    >
      <div className="text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Stage {currentStage + 1}</h3>
            <p className="text-lg mb-6">Allocate ₹{stages[currentStage].amount} for food and book:</p>
            <div className="space-y-4">
              {["food", "book"].map((cat) => (
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
            <h3 className="text-3xl font-bold mb-4">Digital Spend Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Track digital spending carefully!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationDigitalSpend;