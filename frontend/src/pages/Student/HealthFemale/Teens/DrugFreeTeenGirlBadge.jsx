import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DrugFreeTeenGirlBadge = () => {
  const navigate = useNavigate();
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedActivities, setCompletedActivities] = useState(0);
  const [requiredActivities] = useState(5); // Need to complete 5 drug-prevention scenarios to earn badge
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        // In a real implementation, this would check if the user has completed
        // the required drug-prevention activities. For now, we'll simulate this.
        
        // Simulate checking completion status
        setTimeout(() => {
          // For demonstration, we'll assume the user has completed enough activities
          setCompletedActivities(5);
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
      title="Badge: Drug-Free Teen Girl"
      subtitle={badgeEarned ? "Congratulations! You've earned the badge!" : "Complete drug-prevention activities"}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={true}
      score={badgeEarned ? 20 : 0}
      gameId="health-female-teen-90"
      gameType="health-female"
      totalLevels={10}
      currentLevel={10}
      showConfetti={badgeEarned}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
          {loading ? (
            <div className="py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/90">Checking your drug-prevention progress...</p>
            </div>
          ) : badgeEarned ? (
            <div className="py-8">
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-4">Drug-Free Teen Girl Badge Earned!</h2>
              <p className="text-white/90 text-lg mb-6">
                Congratulations on completing all drug-prevention activities! You've demonstrated excellent decision-making and commitment to staying substance-free.
              </p>
              <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-4 px-8 rounded-full inline-block mx-auto">
                <div className="text-2xl">🌿 Drug-Free Teen Girl</div>
                <div className="text-sm">Awarded for substance prevention mastery</div>
              </div>
              <div className="mt-6 text-white/80">
                <p>You've completed {completedActivities} out of {requiredActivities} required drug-prevention activities.</p>
                <p className="mt-2 text-yellow-400 font-bold">+20 XP Earned!</p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="text-8xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Keep Going!</h2>
              <p className="text-white/90 text-lg mb-6">
                You're on your way to becoming a Drug-Free Teen Girl! Complete all drug-prevention activities to earn this special badge.
              </p>
              <div className="bg-white/10 text-white font-bold py-4 px-8 rounded-full inline-block mx-auto">
                <div className="text-2xl">🌿 Drug-Free Teen Girl</div>
                <div className="text-sm">Locked - Complete more activities</div>
              </div>
              <div className="mt-6 text-white/80">
                <p>You've completed {completedActivities} out of {requiredActivities} required drug-prevention activities.</p>
                <p className="mt-2">Complete {requiredActivities - completedActivities} more activities to unlock this badge!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default DrugFreeTeenGirlBadge;