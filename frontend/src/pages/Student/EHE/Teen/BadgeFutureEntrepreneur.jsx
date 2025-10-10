import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeFutureEntrepreneur = () => {
  const navigate = useNavigate();
  const [completedSkills, setCompletedSkills] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const skills = [
    { id: 1, skill: "Opportunity recognition" },
    { id: 2, skill: "Creative problem-solving" },
    { id: 3, skill: "Resilience in failure" },
    { id: 4, skill: "Team collaboration" },
    { id: 5, skill: "Innovation mindset" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedSkills(5);
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowBadge(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCorrectAnswerFeedback]);

  const handleFinish = () => {
    navigate("/games/entrepreneurship/teens");
  };

  return (
    <GameShell
      title="Badge: Future Entrepreneur"
      subtitle="Achievement Unlocked"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ehe-teen-20"
      gameType="educational"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showBadge}
      backPath="/games/entrepreneurship/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {!showBadge ? (
            <>
              <div className="text-7xl mb-4 text-center animate-pulse">🔄</div>
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                Checking your entrepreneurship skills...
              </h3>
            </>
          ) : (
            <>
              <div className="text-9xl mb-4 text-center animate-bounce">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Future Entrepreneur Badge!
              </h2>

              <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  Entrepreneur Skills Mastered:
                </h3>
                <div className="space-y-2">
                  {skills.map(skill => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-3"
                    >
                      <div className="text-2xl">✅</div>
                      <div className="text-white font-semibold">{skill.skill}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  🌟 Congratulations! You've mastered 5 essential entrepreneur skills! You understand 
                  opportunity recognition, creativity, resilience, teamwork, and innovation. Ready to 
                  build something amazing!
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold text-center">
                Badge Earned: Future Entrepreneur! 🚀
              </p>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeFutureEntrepreneur;

