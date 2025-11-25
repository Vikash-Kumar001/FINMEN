import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PublicSpeakingPrep = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-47";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
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
    if (hasStructure) {
      setCoins(prev => prev + 1);
    }
    showCorrectAnswerFeedback(1, false);
    setShowResult(true);
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
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-47"
      gameType="uvls"
      totalLevels={20}
      currentLevel={47}
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