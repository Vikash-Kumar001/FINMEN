import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchSkills = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const roles = [
    { id: 1, role: "Leader", emoji: "👑", correct: "guide" },
    { id: 2, role: "Innovator", emoji: "💡", correct: "invent" },
    { id: 3, role: "Team Player", emoji: "🤝", correct: "support" }
  ];

  const actions = [
    { id: "guide", name: "Guides Others", emoji: "🧭" },
    { id: "invent", name: "Creates New Ideas", emoji: "🚀" },
    { id: "support", name: "Helps the Team", emoji: "💪" }
  ];

  const handleMatch = (roleId, actionId) => {
    setMatches({ ...matches, [roleId]: actionId });
  };

  const handleCheck = () => {
    let correct = 0;
    roles.forEach(role => {
      if (matches[role.id] === role.correct) {
        correct++;
      }
    });

    if (correct >= 2) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
    setShowResult(true);
  };

  const allMatched = roles.every(role => matches[role.id]);

  const handleTryAgain = () => {
    setMatches({});
    setShowResult(false);
    setCoins(0);
  };

  const handleNext = () => {
    navigate("/student/ehe/kids/teamwork-story");
  };

  const correctCount = roles.filter(role => matches[role.id] === role.correct).length;

  return (
    <GameShell
      title="Puzzle: Match Skills"
      subtitle="Match Roles to Actions"
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 2}
      showGameOver={showResult && correctCount >= 2}
      score={coins}
      gameId="ehe-kids-14"
      gameType="educational"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && correctCount >= 2}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Match each role with what they do!</h3>
            
            <div className="space-y-4 mb-6">
              {roles.map(role => {
                const selectedAction = actions.find(a => a.id === matches[role.id]);
                return (
                  <div key={role.id} className="bg-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-5xl">{role.emoji}</div>
                        <div className="text-white font-bold text-lg">{role.role}</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="flex-1 ml-4">
                        <select
                          value={matches[role.id] || ""}
                          onChange={(e) => handleMatch(role.id, e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border-2 border-white/40 rounded-lg text-white"
                        >
                          <option value="">Select action...</option>
                          {actions.map(action => (
                            <option key={action.id} value={action.id} className="text-black">
                              {action.emoji} {action.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCheck}
              disabled={!allMatched}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                allMatched
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Check My Answers
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {correctCount >= 2 ? "🎉 Great Match!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You matched {correctCount} out of {roles.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Leaders guide, innovators invent, and team players support. Each role is important!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {correctCount >= 2 ? "You earned 5 Coins! 🪙" : "Get 2 or more correct to earn coins!"}
            </p>
            {correctCount < 2 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchSkills;

