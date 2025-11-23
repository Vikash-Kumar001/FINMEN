import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AITrainingBadgee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [unlocked, setUnlocked] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Simulated check — replace with actual logic from player progress data
  const trainingGamesCompleted = 5; // For demo, assuming 5 completed

  useEffect(() => {
    if (trainingGamesCompleted >= 5) {
      setUnlocked(true);
      setCoins(20);
      showCorrectAnswerFeedback(20, true);
    }
  }, []);

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/dataset-builder-simulation");
  };

  return (
    <GameShell
      title="AI Training Badge"
      subtitle="Achievement Unlocked!"
      onNext={handleNext}
      nextEnabled={unlocked}
      showGameOver={unlocked}
      score={coins}
      gameId="ai-teen-18"
      gameType="achievement"
      totalLevels={20}
      currentLevel={18}
      showConfetti={unlocked}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-6 text-center">
        {!unlocked ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-white text-2xl font-bold mb-4">
              🧠 Train AI to Earn Your Badge
            </h3>
            <p className="text-white/80 text-lg mb-4">
              Complete <span className="text-yellow-400 font-bold">5 AI training games</span> to unlock this special badge!
            </p>
            <p className="text-white/60">
              Keep improving AI by correcting mistakes, identifying errors, and enhancing its learning accuracy.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-600/30 to-blue-500/30 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🏅 Achievement Unlocked!</h2>
            <p className="text-white/90 text-xl mb-4">
              Congratulations! You've earned the <span className="text-yellow-400 font-bold">AI Training Badge</span>.
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Your effort in retraining AI helps it become smarter and more accurate.
                You’ve shown the spirit of a true AI mentor!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              +20 Coins Earned! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AITrainingBadgee;
