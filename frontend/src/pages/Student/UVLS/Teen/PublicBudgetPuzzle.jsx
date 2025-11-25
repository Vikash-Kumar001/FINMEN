import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PublicBudgetPuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-46";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [allocations, setAllocations] = useState([0, 0, 0, 0, 0]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const needs = [
    "Books",
    "Sports equipment",
    "Computers",
    "Field trips",
    "Cafeteria food"
  ];

  const handleAllocate = (index, amount) => {
    const newAllocations = [...allocations];
    newAllocations[index] = amount;
    setAllocations(newAllocations);
  };

  const handleConfirm = () => {
    const total = allocations.reduce((sum, a) => sum + a, 0);
    if (total === 100) {
      // Assume balanced if no zero
      const isBalanced = allocations.every(a => a > 0);
      if (isBalanced) {
        setCoins(prev => prev + 1);
      }
      showCorrectAnswerFeedback(1, false);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Public Budget Puzzle"
      subtitle="Allocate 100 units"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-46"
      gameType="uvls"
      totalLevels={20}
      currentLevel={46}
      showConfetti={showResult}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Allocate budget to needs:</p>
              
              <div className="space-y-3 mb-6">
                {needs.map((need, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-white mr-4">{need}</span>
                    <input
                      type="number"
                      value={allocations[index]}
                      onChange={(e) => handleAllocate(index, parseInt(e.target.value) || 0)}
                      className="p-2 bg-white/20 border-2 border-white/40 rounded-xl text-white w-20"
                    />
                  </div>
                ))}
              </div>
              
              <p className="text-white mb-4">Total: {allocations.reduce((sum, a) => sum + a, 0)}</p>
              
              <button
                onClick={handleConfirm}
                disabled={allocations.reduce((sum, a) => sum + a, 0) !== 100}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  allocations.reduce((sum, a) => sum + a, 0) === 100
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Allocate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Budget Allocated!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your allocation is set.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {coins > 0 ? "Earned 5 Coins!" : "Make equitable."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach basic cost-benefit reasoning.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PublicBudgetPuzzle;