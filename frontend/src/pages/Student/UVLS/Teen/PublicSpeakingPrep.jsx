import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PublicSpeakingPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [opening, setOpening] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleOpeningChange = (e) => {
    setOpening(e.target.value);
  };

  const handleSubmit = () => {
    if (opening.trim() === "") return;
    // Simulate scoring, assume good if has hook and structure
    const hasStructure = opening.length > 100;
    showCorrectAnswerFeedback(1, false);
    setShowResult(true);
    if (hasStructure) {
      setCoins(5);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Public Speaking Prep"
      subtitle="Draft 60-second opening"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="communication-168"
      gameType="communication"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={8}
      showConfetti={showResult}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Draft opening:</p>
              
              <textarea
                value={opening}
                onChange={handleOpeningChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Write your opening..."
              />
              
              <button
                onClick={handleSubmit}
                disabled={opening.trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  opening.trim() !== ""
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prep Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your opening is ready.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {coins > 0 ? "Earned 5 Coins!" : "Improve structure."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Run in class as mini-presentations.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PublicSpeakingPrep;