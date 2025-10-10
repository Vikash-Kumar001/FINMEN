import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeSaverKid = () => {
  const navigate = useNavigate();
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleClaimBadge = () => {
    setShowBadge(true);
    setCoins(10);
    showCorrectAnswerFeedback(10, true);
  };

  const handleFinish = () => {
    // Navigate back to the financial literacy games page
    navigate("/games/financial-literacy/kids");
  };

  return (
    <GameShell
      title="Badge: Saver Kid"
      subtitle="Congratulations on completing all financial games!"
      coins={coins}
      currentLevel={10}
      totalLevels={10}
      onNext={handleFinish}
      nextEnabled={showBadge}
      nextLabel="Finish"
      showGameOver={showBadge}
      score={coins}
      gameId="finance-kids-10"
      gameType="finance"
      showConfetti={showBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6">🏅</div>
            <h3 className="text-3xl font-bold text-white mb-6">Congratulations!</h3>
            <p className="text-white/90 text-xl mb-8">
              You've completed all 10 financial literacy games!
            </p>
            <p className="text-white/80 mb-8">
              You've learned valuable lessons about saving, spending wisely, and making smart financial decisions.
            </p>
            <button
              onClick={handleClaimBadge}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Claim Your Badge
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-6">🏆</div>
            <h3 className="text-3xl font-bold text-white mb-4">Saver Kid Badge Unlocked!</h3>
            <p className="text-white/90 text-xl mb-6">
              You are now a certified Saver Kid!
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-8 rounded-2xl inline-block mb-6">
              <div className="text-5xl mb-2">💰</div>
              <h4 className="text-2xl font-bold">Saver Kid</h4>
              <p className="text-lg">Master of Smart Saving</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              <span>+10 Coins</span>
            </div>
            <p className="text-white/80 mb-8">
              Keep up the great work on your financial journey!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSaverKid;