import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIExplorerHeroBadgee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [showAchievement, setShowAchievement] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    // Award achievement coins when component mounts
    showCorrectAnswerFeedback(25, true);
    setCoins(25);
    setShowAchievement(true);
  }, []);

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/what-is-ai-quiz"); // Redirect to summary or dashboard
  };

  return (
    <GameShell
      title="AI Explorer Hero Badge"
      subtitle="Achievement Unlocked!"
      onNext={handleNext}
      nextEnabled={showAchievement}
      showGameOver={showAchievement}
      score={coins}
      gameId="ai-teen-25"
      gameType="achievement"
      totalLevels={25}
      currentLevel={25}
      showConfetti={showAchievement}
      backPath="/games/ai-for-all/teens"
    
      maxScore={25} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {showAchievement && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Congratulations, AI Explorer!
            </h2>
            <p className="text-white/90 text-lg mb-6">
              You have completed all 25 ethics and future games.
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-center text-sm">
                🌟 Outcome: Full AI literacy recognition! You've demonstrated knowledge, creativity, and ethical understanding of AI concepts.
              </p>
            </div>

            <p className="text-yellow-400 text-3xl font-bold mb-6">
              You earned 25 Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Go to Summary
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIExplorerHeroBadgee;
