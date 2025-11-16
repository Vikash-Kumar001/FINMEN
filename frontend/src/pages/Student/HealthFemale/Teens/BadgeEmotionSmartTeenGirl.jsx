import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeEmotionSmartTeenGirl = () => {
  const navigate = useNavigate();
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedCases, setCompletedCases] = useState(0);
  const [requiredCases] = useState(5); // Need to complete 5 emotional health cases to earn badge
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        // In a real implementation, this would check if the user has completed
        // the required emotional health cases. For now, we'll simulate this.
        
        // Simulate checking completion status
        setTimeout(() => {
          // For demonstration, we'll assume the user has completed enough cases
          setCompletedCases(5);
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
      title="Badge: Emotion Smart Teen Girl"
      subtitle={badgeEarned ? "Congratulations! You've earned the badge!" : "Complete emotional health cases"}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={true}
      score={badgeEarned ? 20 : 0}
      gameId="health-female-teen-60"
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
              <p className="text-white/90">Checking your emotional health progress...</p>
            </div>
          ) : badgeEarned ? (
            <div className="py-8">
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-4">Emotion Smart Teen Girl Badge Earned!</h2>
              <p className="text-white/90 text-lg mb-6">
                Congratulations on completing all emotional health cases! You've demonstrated excellent emotional intelligence and coping skills.
              </p>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-full inline-block mx-auto">
                <div className="text-2xl">🏅 Emotion Smart Teen Girl</div>
                <div className="text-sm">Awarded for emotional health mastery</div>
              </div>
              <div className="mt-6 text-white/80">
                <p>You've completed {completedCases} out of {requiredCases} required emotional health cases.</p>
                <p className="mt-2 text-yellow-400 font-bold">+20 XP Earned!</p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="text-8xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Keep Going!</h2>
              <p className="text-white/90 text-lg mb-6">
                You're on your way to becoming an Emotion Smart Teen Girl! Complete all emotional health cases to earn this special badge.
              </p>
              <div className="bg-white/10 text-white font-bold py-4 px-8 rounded-full inline-block mx-auto">
                <div className="text-2xl">🏅 Emotion Smart Teen Girl</div>
                <div className="text-sm">Locked - Complete more cases</div>
              </div>
              <div className="mt-6 text-white/80">
                <p>You've completed {completedCases} out of {requiredCases} required emotional health cases.</p>
                <p className="mt-2">Complete {requiredCases - completedCases} more cases to unlock this badge!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeEmotionSmartTeenGirl;