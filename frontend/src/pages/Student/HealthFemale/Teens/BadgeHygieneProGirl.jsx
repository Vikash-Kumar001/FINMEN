import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeHygieneProGirl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedGames, setCompletedGames] = useState(0);
  const [requiredGames] = useState(8); // Need to complete 8 hygiene games to earn badge
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        // In a real implementation, this would check if the user has completed
        // the required hygiene games. For now, we'll simulate this.
        // You would typically check the user's progress through the gameCompletionService.
        
        // Simulate checking completion status
        setTimeout(() => {
          // For demonstration, we'll assume the user has completed enough games
          setCompletedGames(8);
          setBadgeEarned(true);
          showCorrectAnswerFeedback(20, true); // Award 20 XP for earning the badge
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error checking completion status:", error);
        setLoading(false);
      }
    };

    checkCompletionStatus();
  }, []);

  const handleNext = () => {
    // Navigate to the next category or main menu
    navigate("/games/health-female/teens");
  };

  return (
    <GameShell
      title="Badge: Hygiene Pro Girl"
      subtitle={badgeEarned ? "Congratulations! You've earned the badge!" : "Complete hygiene mastery tasks"}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={true}
      score={badgeEarned ? 20 : 0}
      gameId="health-female-teen-50"
      gameType="health-female"
      totalLevels={10}
      currentLevel={10}
      showConfetti={badgeEarned}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
          {loading ? (
            <div className="py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/90">Checking your hygiene mastery progress...</p>
            </div>
          ) : badgeEarned ? (
            <div className="py-8">
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-4">Hygiene Pro Girl Badge Earned!</h2>
              <p className="text-white/90 text-lg mb-6">
                Congratulations on completing all hygiene mastery tasks! You've demonstrated excellent knowledge and habits in teen hygiene.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-full inline-block mx-auto">
                <div className="text-2xl">🏅 Hygiene Pro Girl</div>
                <div className="text-sm">Awarded for hygiene mastery</div>
              </div>
              <div className="mt-6 text-white/80">
                <p>You've completed {completedGames} out of {requiredGames} required hygiene tasks.</p>
                <p className="mt-2 text-yellow-400 font-bold">+20 XP Earned!</p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="text-8xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Keep Going!</h2>
              <p className="text-white/90 text-lg mb-6">
                You're on your way to becoming a Hygiene Pro Girl! Complete all hygiene mastery tasks to earn this special badge.
              </p>
              <div className="bg-white/10 text-white font-bold py-4 px-8 rounded-full inline-block mx-auto">
                <div className="text-2xl">🏅 Hygiene Pro Girl</div>
                <div className="text-sm">Locked - Complete more tasks</div>
              </div>
              <div className="mt-6 text-white/80">
                <p>You've completed {completedGames} out of {requiredGames} required hygiene tasks.</p>
                <p className="mt-2">Complete {requiredGames - completedGames} more tasks to unlock this badge!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeHygieneProGirl;