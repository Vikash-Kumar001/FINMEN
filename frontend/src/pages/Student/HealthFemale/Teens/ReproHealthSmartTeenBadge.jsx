import React from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproHealthSmartTeenBadge = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti } = useGameFeedback();

  const handleNext = () => {
    // This would typically navigate to the next category or game
    navigate("/games/health-female/teens");
  };

  return (
    <GameShell
      title="Badge: Repro Health Smart Teen"
      subtitle="Congratulations on completing reproductive health tasks!"
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={true}
      score={20}
      gameId="health-female-teen-40"
      gameType="health-female"
      totalLevels={40}
      currentLevel={40}
      showConfetti={true}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 40 of 40</span>
            <span className="text-yellow-400 font-bold">XP: 20</span>
          </div>

          <div className="text-center py-8">
            <div className="inline-block bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-full mb-6">
              <div className="bg-white p-4 rounded-full">
                <div className="text-6xl">🏆</div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Repro Health Smart Teen
            </h2>
            
            <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
              Congratulations! You've successfully completed 5 reproductive health tasks and demonstrated 
              excellent knowledge about reproductive health and wellness.
            </p>
            
            <div className="bg-white/20 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Skills Demonstrated:</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Understanding of reproductive system functions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Knowledge of menstrual health management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Appropriate communication about reproductive health</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Healthy decision-making for reproductive wellness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Support for peers with reproductive health concerns</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-400 rounded-xl p-4 max-w-2xl mx-auto mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <div>
                  <h4 className="font-bold text-yellow-400">Achievement Unlocked!</h4>
                  <p className="text-white/80 mt-1">
                    You've earned the "Repro Health Smart Teen" badge for your comprehensive understanding 
                    of reproductive health topics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReproHealthSmartTeenBadge;