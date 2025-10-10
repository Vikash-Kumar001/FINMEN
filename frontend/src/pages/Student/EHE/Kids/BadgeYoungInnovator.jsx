import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeYoungInnovator = () => {
  const navigate = useNavigate();
  const [completedSkills, setCompletedSkills] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const skills = [
    { id: 1, skill: "Problem-solving mindset" },
    { id: 2, skill: "Creative thinking" },
    { id: 3, skill: "Teamwork collaboration" },
    { id: 4, skill: "Taking smart risks" },
    { id: 5, skill: "Innovation attitude" }
  ];

  useEffect(() => {
    // Simulate that user has completed all entrepreneurship skills
    const timer = setTimeout(() => {
      setCompletedSkills(5);
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowBadge(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCorrectAnswerFeedback]);

  const handleFinish = () => {
    navigate("/games/ehe/kids");
  };

  return (
    <GameShell
      title="Badge: Young Innovator"
      subtitle="Achievement Unlocked"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ehe-kids-20"
      gameType="educational"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showBadge}
      backPath="/games/entrepreneurship/kids"
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
                Young Innovator Badge!
              </h2>

              <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
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
                  🌟 Congratulations! You've shown 5 entrepreneur skills! You know how to solve 
                  problems, work with others, and think creatively. Keep innovating!
                </p>
              </div>

              <p className="text-yellow-400 text-2xl font-bold text-center">
                Badge Earned: Young Innovator! 🚀
              </p>
            </>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeYoungInnovator;

