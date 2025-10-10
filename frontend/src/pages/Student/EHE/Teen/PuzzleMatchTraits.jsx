import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchTraits = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const traits = [
    { id: 1, trait: "Leader", emoji: "👑", correct: "inspire" },
    { id: 2, trait: "Risk-Taker", emoji: "🎯", correct: "try-new" },
    { id: 3, trait: "Innovator", emoji: "💡", correct: "create" }
  ];

  const actions = [
    { id: "inspire", name: "Inspires Team", emoji: "🔥" },
    { id: "try-new", name: "Tries New Things", emoji: "🚀" },
    { id: "create", name: "Creates Solutions", emoji: "⚡" }
  ];

  const handleMatch = (traitId, actionId) => {
    setMatches({ ...matches, [traitId]: actionId });
  };

  const handleCheck = () => {
    let correct = 0;
    traits.forEach(trait => {
      if (matches[trait.id] === trait.correct) {
        correct++;
      }
    });

    if (correct >= 2) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
    setShowResult(true);
  };

  const allMatched = traits.every(trait => matches[trait.id]);

  const handleTryAgain = () => {
    setMatches({});
    setShowResult(false);
    setCoins(0);
  };

  const handleNext = () => {
    navigate("/student/ehe/teen/failure-story");
  };

  const correctCount = traits.filter(trait => matches[trait.id] === trait.correct).length;

  return (
    <GameShell
      title="Puzzle: Match Traits"
      subtitle="Entrepreneur Characteristics"
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 2}
      showGameOver={showResult && correctCount >= 2}
      score={coins}
      gameId="ehe-teen-14"
      gameType="educational"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && correctCount >= 2}
      backPath="/games/entrepreneurship/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Match each trait with their action!</h3>
            
            <div className="space-y-4 mb-6">
              {traits.map(trait => {
                return (
                  <div key={trait.id} className="bg-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-5xl">{trait.emoji}</div>
                        <div className="text-white font-bold text-lg">{trait.trait}</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="flex-1 ml-4">
                        <select
                          value={matches[trait.id] || ""}
                          onChange={(e) => handleMatch(trait.id, e.target.value)}
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
              You matched {correctCount} out of {traits.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Leaders inspire, risk-takers try new things, and innovators create solutions!
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

export default PuzzleMatchTraits;

